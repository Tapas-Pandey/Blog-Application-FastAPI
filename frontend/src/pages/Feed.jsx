import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '40px', maxWidth: '800px', paddingBottom: '40px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ 
                        marginBottom: '8px', 
                        color: '#fff',
                        fontSize: '2rem',
                        fontWeight: '700'
                    }}>
                        Latest Posts
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                        Discover what the community is sharing
                    </p>
                </div>
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Loading posts...</span>
                    </div>
                ) : (
                    <>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="glass-panel" style={{ 
                                padding: '60px 40px', 
                                textAlign: 'center' 
                            }}>
                                <p style={{ 
                                    color: '#94a3b8', 
                                    fontSize: '1.1rem',
                                    marginBottom: '20px'
                                }}>
                                    No posts yet. Be the first to share something!
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Feed;
