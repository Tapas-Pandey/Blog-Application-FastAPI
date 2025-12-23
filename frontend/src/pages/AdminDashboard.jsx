import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchPosts()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users");
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                alert("Failed to delete user: " + error.response?.data?.detail);
            }
        }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await api.delete(`/posts/${id}`);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete post", error);
                alert("Failed to delete post");
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '40px', maxWidth: '1200px' }}>
                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h1 style={{ marginTop: 0, color: '#fff', marginBottom: '30px' }}>Admin Dashboard</h1>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Loading...</div>
                    ) : (
                        <>

                            <h2 style={{ marginTop: '30px', marginBottom: '20px', color: '#fff' }}>Users</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>ID</th>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Role</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '10px' }}>{u.id}</td>
                                    <td style={{ padding: '10px' }}>{u.name}</td>
                                    <td style={{ padding: '10px' }}>{u.email}</td>
                                    <td style={{ padding: '10px' }}>{u.is_admin ? <span style={{ color: 'var(--secondary)' }}>Admin</span> : 'User'}</td>
                                    <td style={{ padding: '10px' }}>
                                        {!u.is_admin && (
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                style={{
                                                    background: '#ef4444',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                            <h2 style={{ marginTop: '40px', marginBottom: '20px', color: '#fff' }}>All Posts</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>ID</th>
                                <th style={{ padding: '10px' }}>Title</th>
                                <th style={{ padding: '10px' }}>Author</th>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '10px' }}>{p.id}</td>
                                    <td style={{ padding: '10px' }}>{p.title}</td>
                                    <td style={{ padding: '10px' }}>{p.author?.name || p.author_id}</td>
                                    <td style={{ padding: '10px' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button
                                            onClick={() => handleDeletePost(p.id)}
                                            style={{
                                                background: '#ef4444',
                                                border: 'none',
                                                color: 'white',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
