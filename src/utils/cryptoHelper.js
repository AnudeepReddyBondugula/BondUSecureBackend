import crypto from 'crypto';

export const getHash = (key, hashAlgo='sha256', encodingType='hex') => {
    const hash = new crypto.createHash(hashAlgo);
    hash.update(key);
    const result = hash.digest(encodingType);
    return result;
}

export const encrypt = (
    content, 
    key, 
    algorithm='aes256', 
    inputEncodingType='utf8', 
    outputEncodingType='hex'
) => {
    
    if (typeof content !== 'string') content = JSON.stringify(content);

    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(content, inputEncodingType, outputEncodingType) + cipher.final(outputEncodingType);
    return encrypted;
}

export const decrypt = (
    encryptedData,
    key,
    algorithm='aes256',
    inputEncodingType='hex',
    outputEncodingType='utf8'
) => {
    const decipher = crypto.createDecipher(algorithm, key)
    let decrypted = decipher.update(encryptedData, inputEncodingType, outputEncodingType) + decipher.final(outputEncodingType);
    return JSON.parse(decrypted);
}