import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            setPost(response.data);
            setLiked(response.data.is_liked || false);
            setLikeCount(response.data.like_count || 0);
        } catch (error) {
            console.error("Error fetching post", error);
            setError('Post not found');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/posts/${id}/comments`, { content: commentContent });
            setCommentContent('');
            fetchPost(); // Refresh comments
        } catch (err) {
            console.error("Error submitting comment", err);
        }
    };

    const handleLike = async () => {
        if (!user) return;
        
        const wasLiked = liked;
        const newLiked = !wasLiked;
        const newCount = newLiked ? likeCount + 1 : likeCount - 1;
        
        // Optimistic update
        setLiked(newLiked);
        setLikeCount(newCount);
        
        try {
            if (wasLiked) {
                await api.post(`/posts/${id}/unlike`);
            } else {
                await api.post(`/posts/${id}/like`);
            }
        } catch (error) {
            // Revert on error
            setLiked(wasLiked);
            setLikeCount(likeCount);
            console.error("Error toggling like", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                navigate('/');
            } catch (err) {
                console.error("Error deleting post", err);
                alert("Failed to delete post");
            }
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <span>Loading post...</span>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
                <Navbar />
                <div className="container" style={{ marginTop: '40px', maxWidth: '800px' }}>
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                        <p className="error-msg" style={{ margin: 0 }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }
    if (!post) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '40px', maxWidth: '800px' }}>
                <div className="glass-panel" style={{ padding: '40px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ marginTop: 0, color: '#fff', fontSize: '2.5rem' }}>{post.title}</h1>
                        {(user?.id === post.author_id || user?.is_admin) && (
                            <button 
                                onClick={handleDelete} 
                                className="btn-primary"
                                style={{ 
                                    background: '#ef4444',
                                    padding: '10px 20px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Delete Post
                            </button>
                        )}
                    </div>

                    <div style={{ 
                        color: '#94a3b8', 
                        fontSize: '0.95rem', 
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        <span>By <strong style={{ color: 'var(--primary)' }}>{post.author.name}</strong></span>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <article 
                        className="post-content"
                        style={{ 
                            color: '#e2e8f0', 
                            lineHeight: '1.8', 
                            fontSize: '1.1rem', 
                            marginBottom: '30px',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%'
                        }}
                    >
                        {post.content.split(/\n\s*\n/).map((paragraph, index) => {
                            const trimmed = paragraph.trim();
                            if (trimmed === '') {
                                return null;
                            }
                            return (
                                <p key={index} style={{ 
                                    margin: '0 0 1.2em 0',
                                    padding: 0,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {trimmed}
                                </p>
                            );
                        }).filter(Boolean)}
                    </article>
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '20px'
                    }}>
                        <button 
                            onClick={handleLike}
                            style={{ 
                                background: 'none', 
                                border: '1px solid rgba(255,255,255,0.2)', 
                                color: liked ? '#ef4444' : '#94a3b8', 
                                cursor: user ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                padding: '8px 16px',
                                borderRadius: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (user) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.borderColor = liked ? '#ef4444' : 'rgba(255,255,255,0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                            disabled={!user}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
                            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                        </button>
                    </div>

                    <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                        <h3 style={{ 
                            color: '#fff', 
                            marginBottom: '24px',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>
                            Comments ({post.comments?.length || 0})
                        </h3>

                        <div style={{ marginBottom: '30px' }}>
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px',
                                            marginBottom: '8px'
                                        }}>
                                            <p style={{ 
                                                fontWeight: '600', 
                                                color: 'var(--primary)', 
                                                fontSize: '0.95rem',
                                                margin: 0
                                            }}>
                                                {comment.user?.name || 'User ' + comment.user_id}
                                            </p>
                                            <span style={{ 
                                                color: 'rgba(255,255,255,0.3)',
                                                fontSize: '0.85rem'
                                            }}>
                                                {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p style={{ 
                                            color: '#e2e8f0', 
                                            margin: 0,
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {comment.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ 
                                    color: '#94a3b8', 
                                    textAlign: 'center',
                                    padding: '20px',
                                    fontStyle: 'italic'
                                }}>
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} style={{ marginTop: '30px' }}>
                            <textarea
                                className="input-field"
                                placeholder="Write a comment..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                required
                                style={{ minHeight: '100px', marginBottom: '16px' }}
                            />
                            <button type="submit" className="btn-primary">Post Comment</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
