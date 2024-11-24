import { fetchUser, createUser } from '../../lib/users';
import { generateToken } from '../../lib/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id, name, password } = req.body;

        const user = await fetchUser(id);
        if (user) {
            res.status(400).json({ error: `Duplicate username: ${id}` });
            return;
        }

        await createUser({ id, name, password });
        const token = generateToken(id);
        res.setHeader(
            'Set-Cookie',
            `USER_VALIDATION_COOKIE=${token}; Path=/; HttpOnly`
        );
        res.status(201).json({ message: 'User created successfully' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
