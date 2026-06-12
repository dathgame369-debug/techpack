import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shirt, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    const result = login(data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass animate-slideUp">
        {/* Logo */}
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--sp-8)' }}>
          <div className="sidebar__logo-icon" style={{ width: 40, height: 40 }}>
            <Shirt size={20} />
          </div>
          <div>
            <div className="sidebar__logo-name gradient-text">TechPac</div>
            <div className="text-xs text-muted">Welcome back</div>
          </div>
        </div>

        <h1 className="text-h2" style={{ marginBottom: 'var(--sp-2)' }}>Sign in</h1>
        <p className="text-sm text-secondary" style={{ marginBottom: 'var(--sp-6)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--gold)' }}>Create one free</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              {...register('email')}
              type="email"
              className="form-input"
              placeholder="designer@studio.com"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          {serverError && (
            <div style={{ padding: 'var(--sp-3)', background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.25)', borderRadius: 'var(--r-sm)', color: '#ff6b7a', fontSize: '0.875rem' }}>
              {serverError}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 'var(--sp-3)', marginTop: 'var(--sp-2)' }} disabled={isSubmitting}>
            {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
            Sign in
          </button>
        </form>

        <div className="divider" style={{ margin: 'var(--sp-6) 0' }} />
        <p className="text-xs text-muted" style={{ textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
};
