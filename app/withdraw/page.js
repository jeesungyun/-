'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
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
                router.push('/'); // Not logged in, redirect to home
            }
        };
        fetchUser();
    }, [router]);

    const handleWithdraw = async () => {
        const res = await fetch('/api/withdraw', {
            method: 'POST',
            body: JSON.stringify({ id: user.id }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            alert('Account has been successfully deleted.');
            router.push('/'); // Redirect to home after successful withdrawal
        } else {
            const error = await res.json();
            alert(error.error);
        }
    };

    return (
        <div>
            {user ? (
                <>
                    <h1>Are you sure you want to withdraw your account?</h1>
                    <p>ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <button onClick={handleWithdraw}>Yes, Withdraw</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
