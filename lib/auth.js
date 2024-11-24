import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET_KEY;
const TOKEN_EXPIRATION_PERIOD = 2 * 60 * 1000; // 2 minutes in milliseconds

export function generateToken(id) {
    return jwt.sign(
        { id, exp: Date.now() + TOKEN_EXPIRATION_PERIOD },
        JWT_SECRET
    );
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.exp < Date.now()) {
            return null;
        }
        return decoded.id;
    } catch {
        return null;
    }
}
