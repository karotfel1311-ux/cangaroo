import crypto from "node:crypto";

export function createSecret(
  email: string,
  password: string,
  domain: string,
): Buffer {
  return crypto
    .createHash("sha256")
    .update(email.toLowerCase() + password + domain)
    .digest();
}

export function sign(key: Buffer, data: string): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

export function encrypt(data: string, ivKey: Buffer): string {
  const iv = ivKey.subarray(0, 16);
  const key = ivKey.subarray(16, 32);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString("base64");
}

/** Poprawiona decrypt – obsługuje zarówno zaszyfrowane odpowiedzi jak i błędy serwera */
export function decrypt(data: string, ivKey: Buffer): string {
  if (!data || typeof data !== "string") {
    return data;
  }

  const trimmed = data.trim();

  // Jeśli odpowiedź wygląda na MyJDownloader error (niezaszyfrowany JSON)
  if (
    trimmed.startsWith("{") &&
    trimmed.includes('"src":') &&
    trimmed.includes('"type":')
  ) {
    console.log("MyJD raw error detected, skipping decryption");
    return trimmed;
  }

  // Sprawdź czy to Base64
  if (!/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
    console.log("Not base64 → returning raw");
    return trimmed;
  }

  try {
    const iv = ivKey.subarray(0, 16);
    const key = ivKey.subarray(16, 32);

    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

    let decrypted = decipher.update(Buffer.from(trimmed, "base64"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (err: any) {
    console.error("Decryption failed:", err.message);
    // Fallback – zwracamy surowe dane (lepsze niż crash)
    return trimmed;
  }
}

export function updateEncryptionToken(
  oldToken: Buffer,
  updateToken: string,
): Buffer {
  const updateTokenBytes = Buffer.from(updateToken, "hex");
  return crypto
    .createHash("sha256")
    .update(Buffer.concat([oldToken, updateTokenBytes]))
    .digest();
}
