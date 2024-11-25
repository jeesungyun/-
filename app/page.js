'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/auth');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        setUser(null);
        router.refresh(); // Refresh page after logout
    };

    return (
        <div>
            {user ? (
                <>
                    <h1>{user.name}님, 어서오세요!</h1>
                    <p>ID: {user.id}</p>
                    <div>
                        <button onClick={handleLogout}>Log Out</button>
                        <button onClick={() => router.push('/withdraw')}>Withdraw</button>
                    <button onClick={() => router.push('/applyMatching')}>Apply Matching</button>
                    </div>
                </>
            ) : (
                <>
                    <h1>Not Logged In</h1>
                    <div>
                        <button onClick={() => router.push('/login')}>Log In</button>
                        <button onClick={() => router.push('/signup')}>Sign Up</button>
                    </div>
                </>
            )}
        </div>
    );
}
