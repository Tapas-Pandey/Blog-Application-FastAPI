import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" style={{ 
            padding: '1rem 2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: 'rgba(15, 23, 42, 0.8)', 
            backdropFilter: 'blur(20px)', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <div className="logo">
                <Link to="/" style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#fff', 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    BlogApp
                </Link>
            </div>
            <div className="links" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <Link to="/" style={{ 
                    color: '#e2e8f0', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                }}>
                    Feed
                </Link>
                <Link to="/create-post" style={{ 
                    color: '#e2e8f0', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                }}>
                    Create Post
                </Link>
                {user?.is_admin && (
                    <Link to="/admin" style={{ 
                        color: '#fbbf24', 
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        Admin
                    </Link>
                )}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    paddingLeft: '16px',
                    borderLeft: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ 
                        color: '#94a3b8', 
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        {user?.name}
                    </span>
                    <button 
                        onClick={handleLogout} 
                        className="btn-primary"
                        style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#ef4444',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
