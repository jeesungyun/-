'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [university, setUniversity] = useState('');
    const [verified, setVerified] = useState(false);
    const [IDcard, setIDcard] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, password, university, verified }),
        });

        if (res.ok) {
            const message = await res.json();
            const formData = new FormData();
            const customFileName = `${id}_${Date.now()}.jpg`;
            formData.append('IDcard', IDcard);
            formData.append('id', id);
            console.log(formData);
            const fileRes = await fetch('/api/uploadIDcard', {
                method: 'POST',
                body: formData,
            });
            if (!fileRes.ok) {
                const error = await fileRes.json();
                alert(`Error in file upload: ${error.error}`);
                return;
            }
            alert(message.message);
            router.push('/login');
        } else {
            const error = await res.json();
            alert(error.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                ID: <input value={id} onChange={e => setId(e.target.value)} required />
            </label>
            <br />
            <label>
                Name: <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <br />
            <label>
                Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <br />
            <label>
                University: <input value={university} onChange={e => setUniversity(e.target.value)} required />
            </label>
            <br />
            <label>
                University student ID card: <input type='file' onChange={(e) => setIDcard(e.target.files[0])} required /> <br /> (Upload a student ID card image smaller than 1MB)
            </label>
            <br />
            <button type="submit">Sign Up</button>
        </form>
    );
}
