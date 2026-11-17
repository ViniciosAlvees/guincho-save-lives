package br.com.fiap.guincho.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class EmployeeSessions {
    public record Session(String token, Instant expiresAt) { }
    private record Attempts(Instant startedAt, int count) { }
    private final Map<String, Instant> sessions = new ConcurrentHashMap<>();
    private final Map<String, Attempts> attempts = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();
    private final String pinHash;
    private final Clock clock;

    @Autowired
    public EmployeeSessions(@Value("${EMPLOYEE_PIN_HASH:}") String pinHash) {
        this(pinHash, Clock.systemUTC());
    }

    EmployeeSessions(String pinHash, Clock clock) {
        this.pinHash = pinHash;
        this.clock = clock;
    }

    public synchronized Session login(String pin, String address) {
        Instant now = clock.instant();
        attempts.entrySet().removeIf(entry -> !entry.getValue().startedAt().plus(Duration.ofMinutes(10)).isAfter(now));
        sessions.entrySet().removeIf(entry -> !entry.getValue().isAfter(now));
        String source = address == null ? "unknown" : address;
        Attempts previous = attempts.get(source);
        if ((previous != null && previous.count() >= 5) || attempts.size() >= 10000 || sessions.size() >= 1000) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS);
        }
        attempts.put(source, new Attempts(previous == null ? now : previous.startedAt(), previous == null ? 1 : previous.count() + 1));
        if (pin == null || !pin.matches("[0-9]{8}")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        if (pinHash == null || pinHash.isBlank()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        if (!matches(pin)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        attempts.remove(source);
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        Instant expiresAt = now.plus(Duration.ofMinutes(30));
        sessions.put(digest(token), expiresAt);
        return new Session(token, expiresAt);
    }

    public void requireAuthorization(String header) {
        String token = bearer(header);
        String key = digest(token);
        Instant expiresAt = sessions.get(key);
        if (expiresAt == null || !expiresAt.isAfter(clock.instant())) {
            sessions.remove(key);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    public void logout(String header) {
        requireAuthorization(header);
        sessions.remove(digest(bearer(header)));
    }

    private String bearer(String header) {
        if (header == null || !header.startsWith("Bearer ") || !header.substring(7).matches("[A-Za-z0-9_-]{43}")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return header.substring(7);
    }

    private boolean matches(String pin) {
        PBEKeySpec spec = null;
        char[] characters = pin.toCharArray();
        try {
            String[] parts = pinHash.split("\\$", -1);
            if (parts.length != 4 || !parts[0].equals("pbkdf2_sha256")) throw new IllegalArgumentException();
            int iterations = Integer.parseInt(parts[1]);
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] expected = Base64.getDecoder().decode(parts[3]);
            if (iterations < 600000 || iterations > 1000000 || salt.length < 16 || salt.length > 32 || expected.length != 32) throw new IllegalArgumentException();
            spec = new PBEKeySpec(characters, salt, iterations, 256);
            byte[] actual = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
            return MessageDigest.isEqual(expected, actual);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        } finally {
            Arrays.fill(characters, '\0');
            if (spec != null) spec.clearPassword();
        }
    }

    private String digest(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) { throw new IllegalStateException("Sessão indisponível."); }
    }
}
