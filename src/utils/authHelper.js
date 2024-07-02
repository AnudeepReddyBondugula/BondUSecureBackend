import jwt from 'jsonwebtoken';
import constants from '../config/constants.js';

export const generateToken = (content, secret=constants.JWT_SECRET) => {
    const jwtoken = jwt.sign(content, secret);
    return jwtoken;
}

export const verifyToken = async (token, secret=constants.JWT_SECRET) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
    
            resolve(decoded);
        })
    })
}