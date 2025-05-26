const bcrypt = require('bcrypt');

const passwordToHash = 'TanfAdmin!2025';
const saltRounds = 10; // Ez az ajánlott "cost factor"

try {
    const hashedPassword = bcrypt.hashSync(passwordToHash, saltRounds);
    console.log('A jelszó:', passwordToHash);
    console.log('Bcrypt hash:', hashedPassword);
} catch (error) {
    console.error('Hiba a hash generálása közben:', error);
}
