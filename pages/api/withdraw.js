import { fetchUser, removeUser } from '../../lib/users';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id } = req.body;

        const user = await fetchUser(id);
        if (user) {
            await removeUser(id);
            res.setHeader(
                'Set-Cookie',
                `USER_VALIDATION_COOKIE=; Path=/; HttpOnly; Max-Age=0`
            );
            res.status(200).json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
