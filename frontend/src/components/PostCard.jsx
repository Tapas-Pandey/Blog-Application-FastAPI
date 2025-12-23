import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.is_liked || false);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);

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
                await api.post(`/posts/${post.id}/unlike`);
            } else {
                await api.post(`/posts/${post.id}/like`);
            }
        } catch (error) {
            // Revert on error
            setLiked(wasLiked);
            setLikeCount(likeCount);
            console.error("Error toggling like", error);
        }
    };

    const isLongContent = post.content.length > 200;
    const contentPreview = isLongContent 
        ? post.content.substring(0, 200) + '...' 
        : post.content;

    return (
        <div className="glass-panel post-card" style={{ 
            padding: '24px', 
            marginBottom: '24px', 
            width: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }}>
            <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 style={{ 
                    marginTop: 0, 
                    marginBottom: '12px',
                    color: '#fff',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#fff';
                }}>
                    {post.title}
                </h2>
            </Link>
            <p style={{ 
                color: '#94a3b8', 
                fontSize: '0.875rem', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>By {post.author?.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                })}</span>
            </p>
            <div style={{ 
                margin: '0 0 20px 0',
                color: '#e2e8f0',
                lineHeight: '1.6',
                fontSize: '1rem'
            }}>
                <p style={{ 
                    margin: 0, 
                    whiteSpace: 'pre-line',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}>
                    {contentPreview}
                </p>
                {isLongContent && (
                    <Link 
                        to={`/posts/${post.id}`}
                        className="read-more-link"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginTop: '12px',
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--primary)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--accent)';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <span>Read More</span>
                        <span style={{ fontSize: '1.1em' }}>→</span>
                    </Link>
                )}
            </div>
            <div className="actions" style={{ 
                display: 'flex', 
                gap: '24px', 
                borderTop: '1px solid rgba(255,255,255,0.1)', 
                paddingTop: '16px',
                alignItems: 'center'
            }}>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        handleLike();
                    }}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: liked ? '#ef4444' : '#94a3b8', 
                        cursor: user ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'color 0.2s',
                        padding: '4px 8px',
                        borderRadius: '6px'
                    }}
                    onMouseEnter={(e) => {
                        if (user) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                    }}
                    disabled={!user}
                >
                    <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
                    <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                </button>
                <Link 
                    to={`/posts/${post.id}`} 
                    style={{ 
                        color: '#94a3b8', 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'color 0.2s',
                        padding: '4px 8px',
                        borderRadius: '6px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.background = 'none';
                    }}
                >
                    <span>💬</span>
                    <span>View Comments</span>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
