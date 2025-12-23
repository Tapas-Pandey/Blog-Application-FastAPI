import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/posts', { title, content });
            navigate('/');
        } catch (err) {
            setError('Failed to create post');
            console.error(err);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '40px', maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h2 style={{ marginBottom: '20px', color: '#fff' }}>Create New Post</h2>
                        {error && <div className="error-msg" style={{ marginBottom: '20px' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: '#ccc', marginBottom: '5px', display: 'block' }}>Title</label>
                            <input
                                type="text"
                                className="input-field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ color: '#ccc', marginBottom: '5px', display: 'block' }}>Content</label>
                            <textarea
                                className="input-field"
                                style={{ minHeight: '200px', resize: 'vertical' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Publish Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
