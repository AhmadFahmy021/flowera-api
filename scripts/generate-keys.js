const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Buat folder keys kalau belum ada
const keysDir = path.join(__dirname, '..', 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Simpan file PEM
fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);

// Convert ke base64 untuk .env
const privateBase64 = Buffer.from(privateKey).toString('base64');
const publicBase64 = Buffer.from(publicKey).toString('base64');

console.log('✅ Key berhasil digenerate!\n');
console.log('Salin nilai berikut ke .env:\n');
console.log(`JWT_ACCESS_PRIVATE_KEY=${privateBase64}`);
console.log(`JWT_ACCESS_PUBLIC_KEY=${publicBase64}`);
console.log(`JWT_REFRESH_PRIVATE_KEY=${privateBase64}`);
console.log(`JWT_REFRESH_PUBLIC_KEY=${publicBase64}`);