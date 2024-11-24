'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [id, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, password }),
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
                Name: <input value={name} onChange={e => setName(e.target.value)} />
            </label>
            <br />
            <label>
                Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Sign Up</button>
        </form>
    );
}
