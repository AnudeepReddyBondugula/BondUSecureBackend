import crypto from 'crypto';
import { PassThrough } from 'stream';


const key = '1234'
const content = {
    username : 'user@example.com',
    password : 'password123',
    age : 30,
    role : 'admin'
}

const cipher = crypto.createCipher('aes256', key);
const decipher = crypto.createDecipher('aes256', key);

var encryptedData = cipher.update(JSON.stringify(content), 'utf8', 'hex') + cipher.final('hex');
console.log(encryptedData)

console.log("################################################################")

var decryptedData = decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');
console.log(JSON.parse(decryptedData))