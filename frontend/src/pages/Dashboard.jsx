import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '40px', maxWidth: '800px' }}>
                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h1 style={{ marginTop: 0, color: '#fff' }}>Welcome, {user?.name}</h1>
                    <div style={{ marginTop: '30px', color: '#ddd' }}>
                        <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#94a3b8', marginBottom: '5px' }}>Email</p>
                            <p style={{ fontSize: '1.1rem' }}>{user?.email}</p>
                        </div>
                        <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#94a3b8', marginBottom: '5px' }}>Phone</p>
                            <p style={{ fontSize: '1.1rem' }}>{user?.phone}</p>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', marginBottom: '5px' }}>Role</p>
                            <p style={{ fontSize: '1.1rem' }}>
                                <span style={{ 
                                    background: user?.is_admin ? 'var(--secondary)' : 'var(--primary)', 
                                    padding: '4px 12px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.9rem',
                                    display: 'inline-block'
                                }}>
                                    {user?.is_admin ? 'Admin' : 'User'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
