import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const { name, email, phone, password } = formData;
        if (!name) return "Name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Invalid email format";

        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phone)) return "Phone must be 10-15 digits";

        if (password.length < 6) return "Password must be at least 6 characters";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await register(formData.email, formData.password, formData.name, formData.phone);
            // Auto login or redirect to login
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Register</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="input-field"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="phone"
                        type="text"
                        placeholder="Phone Number"
                        className="input-field"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Register
                    </button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
