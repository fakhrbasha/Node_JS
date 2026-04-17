import jwt from 'jsonwebtoken'
const expireDate = '1h'

export const generateToken = ({ payload, secretKey, options = {} }: { payload: any, secretKey: string, options?: jwt.SignOptions }) => {
    return jwt.sign(payload, secretKey, { expiresIn: expireDate, ...options })
}

export const verifyToken = ({ token, secretKey, options = {} }: { token: string, secretKey: string, options?: jwt.VerifyOptions }) => {
    try {
        return jwt.verify(token, secretKey, options)
    } catch (error) {
        return null
    }
}