import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shirt, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type FormData = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');
  const register2 = useAuthStore(s => s.register);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    const result = register2({ ...data });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error ?? 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass animate-slideUp" style={{ maxWidth: 500 }}>
        {/* Logo */}
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="sidebar__logo-icon" style={{ width: 40, height: 40 }}>
            <Shirt size={20} />
          </div>
          <div>
            <div className="sidebar__logo-name gradient-text">TechPac</div>
            <div className="text-xs text-muted">Create your free account</div>
          </div>
        </div>

        <h1 className="text-h2" style={{ marginBottom: 'var(--sp-2)' }}>Get started</h1>
        <p className="text-sm text-secondary" style={{ marginBottom: 'var(--sp-6)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
            <div className="form-group">
              <label className="form-label">First name</label>
              <input {...register('firstName')} className="form-input" placeholder="Jane" />
              {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input {...register('lastName')} className="form-input" placeholder="Smith" />
              {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Brand / Studio <span className="text-muted">(optional)</span></label>
            <input {...register('companyName')} className="form-input" placeholder="Jane Smith Studio" />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input {...register('email')} type="email" className="form-input" placeholder="jane@studio.com" />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 8 characters"
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input {...register('confirm')} type="password" className="form-input" placeholder="••••••••" />
            {errors.confirm && <span className="form-error">{errors.confirm.message}</span>}
          </div>

          {serverError && (
            <div style={{ padding: 'var(--sp-3)', background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.25)', borderRadius: 'var(--r-sm)', color: '#ff6b7a', fontSize: '0.875rem' }}>
              {serverError}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 'var(--sp-3)', marginTop: 'var(--sp-2)' }} disabled={isSubmitting}>
            {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
            Create Account
          </button>
        </form>

        <div className="divider" style={{ margin: 'var(--sp-5) 0' }} />
        <p className="text-xs text-muted" style={{ textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
};
