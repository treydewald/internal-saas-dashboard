import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Internal SaaS Dashboard</h1>
        <p style={styles.subtitle}>Login to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.demoInfo}>
          <p style={styles.demoLabel}>Demo Credentials:</p>
          <p>Admin: admin@example.com / admin123</p>
          <p>Analyst: analyst@example.com / analyst123</p>
          <p>Viewer: viewer@example.com / viewer123</p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0F172A',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#1E293B',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#38BDF8',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94A3B8',
    margin: '0 0 32px 0',
  },
  form: {
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#E2E8F0',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #334155',
    borderRadius: '6px',
    backgroundColor: '#0F172A',
    color: '#E2E8F0',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#38BDF8',
    color: '#0F172A',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  error: {
    color: '#EF4444',
    fontSize: '13px',
    marginBottom: '16px',
    padding: '8px 12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '4px',
  },
  demoInfo: {
    backgroundColor: '#0F172A',
    padding: '16px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#94A3B8',
  },
  demoLabel: {
    fontWeight: '600',
    marginTop: '0',
    marginBottom: '8px',
  },
};
