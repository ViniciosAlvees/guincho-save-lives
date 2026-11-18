import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

public class GenerateEmployeePinHash {
    public static void main(String[] arguments) throws Exception {
        if (System.console() == null) throw new IllegalStateException("Execute diretamente em um terminal local.");
        char[] pin = System.console().readPassword("Escolha um novo PIN de oito dígitos: ");
        PBEKeySpec spec = null;
        try {
            if (pin == null || pin.length != 8) throw new IllegalArgumentException("O PIN precisa ter oito dígitos.");
            for (char value : pin) if (value < '0' || value > '9') throw new IllegalArgumentException("Use somente dígitos.");
            byte[] salt = new byte[16];
            new SecureRandom().nextBytes(salt);
            spec = new PBEKeySpec(pin, salt, 600000, 256);
            byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
            System.out.println("Valor de EMPLOYEE_PIN_HASH (guardar somente no Render):");
            System.out.println("pbkdf2_sha256$600000$" + Base64.getEncoder().encodeToString(salt) + "$" + Base64.getEncoder().encodeToString(hash));
        } finally {
            if (pin != null) Arrays.fill(pin, '\0');
            if (spec != null) spec.clearPassword();
        }
    }
}
