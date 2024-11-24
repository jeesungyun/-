import { verifyToken } from '../../lib/auth';
import { fetchUser } from '../../lib/users';

export default async function handler(req, res) {
    const token = req.cookies.USER_VALIDATION_COOKIE;

    if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const username = verifyToken(token);
    if (!username) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }

    const user = await fetchUser(username);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.status(200).json({ user: { username: user.username, name: user.name } });
}
