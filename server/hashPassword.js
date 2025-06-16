const bcrypt = require('bcryptjs');

// Ambil password dari argumen command line
// Contoh penggunaan: node hashPassword.js passwordyangmaudihash
const plainTextPassword = process.argv[2];

if (!plainTextPassword) {
  console.error('Error: Harap masukkan password yang ingin di-hash.');
  console.log('Contoh: node hashPassword.js password123');
  process.exit(1);
}

// Buat hash dari password tersebut
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(plainTextPassword, salt);

console.log(`\nPassword Asli: ${plainTextPassword}`);
console.log('============================================================');
console.log('BCRYPT HASH (Salin dan gunakan ini di database):');
console.log(hashedPassword);
console.log('============================================================\n');