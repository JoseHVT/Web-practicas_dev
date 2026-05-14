require('dotenv').config();

const { hashTextForDemo } = require('../src/utils/passwordHash');

const originalText = process.argv[2] || 'password123';
const modifiedText = process.argv[3] || `${originalText}!`;
const demoSalt = 'sal-fija-para-la-practica';

const firstHash = hashTextForDemo(originalText, demoSalt);
const secondHash = hashTextForDemo(originalText, demoSalt);
const modifiedHash = hashTextForDemo(modifiedText, demoSalt);

console.log('Demo de hash con crypto.scrypt');
console.log('Texto original:', originalText);
console.log('Hash 1:', firstHash);
console.log('Hash 2:', secondHash);
console.log('Mismo texto genera mismo hash:', firstHash === secondHash);
console.log('Texto modificado:', modifiedText);
console.log('Hash modificado:', modifiedHash);
console.log('Texto modificado genera hash diferente:', firstHash !== modifiedHash);
