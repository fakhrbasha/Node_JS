// import pkg from 'jsonwebtoken';
// const { sign, verify } = pkg;
import jwt from 'jsonwebtoken'
const secretKey = 'fakhr'
const expireDate = '1h'

export const generateToken = ({ payload, options = {} } = {}) => {
    return jwt.sign(payload, secretKey, { expiresIn: expireDate, ...options })
}

export const verifyToken = ({ token, options = {} } = {}) => {
    try {
        return jwt.verify(token, secretKey, options)
    } catch (error) {
        return null
    }
}