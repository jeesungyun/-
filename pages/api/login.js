import { fetchUser } from '../../lib/users';
import { generateToken } from '../../lib/auth';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const user = await fetchUser(username);
        if (!user) {
            res.status(400).json({ error: `Not registered username: ${username}` });
            return;
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            res.status(400).json({ error: 'Incorrect password' });
            return;
        }

        const token = generateToken(username);
        res.setHeader(
            'Set-Cookie',
            `USER_VALIDATION_COOKIE=${token}; Path=/; HttpOnly`
        );
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}