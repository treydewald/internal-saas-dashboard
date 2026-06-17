import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';

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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--layer-0)',
      }}
    >
      {/* ── Left: Brand Panel ───────────────────────── */}
      <div
        style={{
          flex: '1',
          background: 'linear-gradient(145deg, #1E3A8A 0%, #1D4ED8 40%, #4338CA 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-brand-panel"
      >
        {/* Subtle geometric overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }}
        />
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '380px' }}>
          {/* Logo mark */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <Zap size={26} />
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 12px 0',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            DataPulse
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)',
              margin: '0 0 48px 0',
              lineHeight: 1.5,
            }}
          >
            Analytics platform for high-performance SaaS teams
          </p>

          {/* Feature list */}
          {['Real-time API monitoring', 'ML-powered anomaly detection', 'Advanced workflow automation'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '10px',
                  }}
                >
                  ✓
                </div>
                {feature}
              </div>
            )
          )}
        </div>
      </div>

      {/* ── Right: Login Form ───────────────────────── */}
      <div
        style={{
          width: '480px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 32px',
          backgroundColor: 'var(--layer-1)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
      >
        {/* Form header */}
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: '0 0 8px 0',
            }}
          >
            Welcome back
          </p>
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Sign in to your account
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
            padding: '32px',
          }}
        >
          {/* Email field */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
              }}
            >
              <Mail size={12} />
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{ width: '100%' }}
            />
          </div>

          {/* Password field */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
              }}
            >
              <Lock size={12} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <p style={{ margin: 0, fontSize: '13px' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 600,
              marginTop: '4px',
              gap: '8px',
            }}
          >
            {isLoading ? 'Signing in...' : (
              <>
                Sign in <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          style={{
            padding: '16px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              margin: '0 0 10px 0',
            }}
          >
            Demo Access
          </p>
          {[
            { role: 'Admin', email: 'admin@example.com', pass: 'admin123' },
            { role: 'Analyst', email: 'analyst@example.com', pass: 'analyst123' },
            { role: 'Viewer', email: 'viewer@example.com', pass: 'viewer123' },
          ].map(({ role, email: e, pass }) => (
            <button
              key={role}
              type="button"
              onClick={() => { setEmail(e); setPassword(pass); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '7px 10px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                marginBottom: '6px',
                transition: 'all var(--duration-sm)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(el) => {
                (el.currentTarget as HTMLButtonElement).style.background = 'var(--layer-1)';
                (el.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-primary)';
              }}
              onMouseLeave={(el) => {
                (el.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (el.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{role}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{e}</span>
            </button>
          ))}
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '6px 0 0 0', textAlign: 'center' }}>
            Click a role to auto-fill credentials
          </p>
        </div>
      </div>
    </div>
  );
};
