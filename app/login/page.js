'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [id, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password }),
        });

        if (res.ok) {
            router.push('/');
        } else {
            const error = await res.json();
            alert(error.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                ID: <input value={id} onChange={e => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Log In</button>
        </form>
    );
}
