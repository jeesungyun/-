'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [user, setUser] = useState(null);
    const [applyID, setApplyID] = useState('');
    const [id, setID] = useState('');
    const [interest, setInterest] = useState('');
    const [timeStart, setTimeStart] = useState(-1);
    const [timeEnd, setTimeEnd] = useState(-1);
    const [minHeadCount, setMinHeadCount] = useState(-1);
    const [maxHeadCount, setMaxHeadCount] = useState(-1);
    const router = useRouter();

    // 로그인 상태를 확인하는 useEffect 추가
    useEffect(() => {
        const checkAuth = async () => {
            const resAuth = await fetch('/api/auth');
            if (resAuth.ok) {
                const data = await resAuth.json();
                setUser(data.user);
            } else {
                setUser(null);
                alert('You must be logged in to apply.');
                router.push('/');
            }
        };
        checkAuth();
    }, [router]); // router 변경 감지 (일반적으로 stable)

    useEffect(() => {
        if (user) {
            setID(user.id);
        }
    }, [user]); // id가 변경될 때마다 실행

    // id가 변경될 때마다 applyID를 업데이트
    useEffect(() => {
        if (id) {
            setApplyID(`${id}_${new Date().toISOString()}`);
        }
    }, [id]); // id가 변경될 때마다 실행

    const handleSubmit = async (e) => {
        e.preventDefault();
        setID(user.id); // id 상태를 업데이트
        console.log(applyID);
        const res = await fetch('/api/applyMatching', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applyID, id, interest, timeStart, timeEnd, minHeadCount, maxHeadCount }),
        });

        if (res.ok) {
            const message = await res.json();
            alert(message.message);
            router.push('/');
        } else {
            const error = await res.json();
            alert(error.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Interest: 
                <input 
                    value={interest} 
                    onChange={(e) => setInterest(e.target.value)} 
                    required 
                />
            </label>
            <br />
            <label>
                Time Start: 
                <input 
                    type="number" 
                    onChange={(e) => setTimeStart(Number(e.target.value))} 
                    required 
                />
            </label>
            <br />
            <label>
                Time End: 
                <input 
                    type="number" 
                    onChange={(e) => setTimeEnd(Number(e.target.value))} 
                    required 
                />
            </label>
            <br />
            <label>
                Min Head Count: 
                <input 
                    type="number" 
                    onChange={(e) => setMinHeadCount(Number(e.target.value))} 
                    required 
                />
            </label>
            <br />
            <label>
                Max Head Count: 
                <input 
                    type="number" 
                    onChange={(e) => setMaxHeadCount(Number(e.target.value))} 
                    required 
                />
            </label>
            <br />
            <button type="submit">Apply</button>
        </form>
    );
}
