package br.com.fiap.guincho.security;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.time.*;
import java.util.Base64;
import static org.junit.jupiter.api.Assertions.*;

class EmployeeSessionsTest {
    private final String pin = String.valueOf(10000000 + new SecureRandom().nextInt(90000000));

    private String hash() throws Exception {
        byte[] salt = new byte[16]; new SecureRandom().nextBytes(salt);
        PBEKeySpec spec = new PBEKeySpec(pin.toCharArray(), salt, 600000, 256);
        try {
            byte[] value = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
            return "pbkdf2_sha256$600000$" + Base64.getEncoder().encodeToString(salt) + "$" + Base64.getEncoder().encodeToString(value);
        } finally { spec.clearPassword(); }
    }

    @Test void loginLogoutAndNoPinInToken() throws Exception {
        EmployeeSessions sessions = new EmployeeSessions(hash(), Clock.systemUTC());
        EmployeeSessions.Session session = sessions.login(pin, "test");
        assertEquals(43, session.token().length());
        assertFalse(session.token().contains(pin));
        String header = "Bearer " + session.token();
        assertDoesNotThrow(() -> sessions.requireAuthorization(header));
        sessions.logout(header);
        assertEquals(401, assertThrows(ResponseStatusException.class, () -> sessions.requireAuthorization(header)).getStatusCode().value());
    }

    @Test void rejectsMissingUnknownAndExpiredTokens() throws Exception {
        MutableClock clock = new MutableClock();
        EmployeeSessions sessions = new EmployeeSessions(hash(), clock);
        assertThrows(ResponseStatusException.class, () -> sessions.requireAuthorization(null));
        assertThrows(ResponseStatusException.class, () -> sessions.requireAuthorization("Bearer " + "x".repeat(43)));
        var session = sessions.login(pin, "test");
        clock.now = clock.now.plus(Duration.ofMinutes(31));
        assertThrows(ResponseStatusException.class, () -> sessions.requireAuthorization("Bearer " + session.token()));
    }

    @Test void rateLimitsWrongPinsAndAllowsRetryAfterWindow() throws Exception {
        MutableClock clock = new MutableClock();
        EmployeeSessions sessions = new EmployeeSessions(hash(), clock);
        String wrong = (pin.charAt(0) == '1' ? "2" : "1") + pin.substring(1);
        for (int attempt = 0; attempt < 5; attempt++) {
            assertEquals(401, assertThrows(ResponseStatusException.class, () -> sessions.login(wrong, "test")).getStatusCode().value());
        }
        assertEquals(429, assertThrows(ResponseStatusException.class, () -> sessions.login(pin, "test")).getStatusCode().value());
        clock.now = clock.now.plus(Duration.ofMinutes(11));
        assertNotNull(sessions.login(pin, "test"));
    }

    @Test void rejectsMissingConfigurationAndInvalidInput() {
        EmployeeSessions sessions = new EmployeeSessions("", Clock.systemUTC());
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> sessions.login("invalid", "test")).getStatusCode().value());
        assertEquals(503, assertThrows(ResponseStatusException.class, () -> sessions.login(pin, "test")).getStatusCode().value());
    }

    private static class MutableClock extends Clock {
        Instant now = Instant.parse("2026-11-17T12:00:00Z");
        public ZoneId getZone() { return ZoneOffset.UTC; }
        public Clock withZone(ZoneId zone) { return this; }
        public Instant instant() { return now; }
    }
}
