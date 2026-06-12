import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Ruler, FileText, Download, Layers, Palette, ArrowRight, CheckCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: Layers,
    color: 'var(--gold)',
    bg: 'rgba(201,168,76,0.12)',
    title: 'Interactive Canvas',
    desc: 'Draw dimension lines, add annotations, and upload custom garment sketches on a professional drawing canvas.',
  },
  {
    icon: Ruler,
    color: 'var(--teal)',
    bg: 'rgba(0,196,167,0.12)',
    title: 'Precise Measurements',
    desc: 'Add measurement annotations with auto-snapping. Color-coded by category — length, width, and curves.',
  },
  {
    icon: FileText,
    color: '#7b61ff',
    bg: 'rgba(123,97,255,0.12)',
    title: 'Full Spec Sheets',
    desc: 'Product info, materials, fabric compositions, construction details, and size grading — all in one place.',
  },
  {
    icon: Palette,
    color: 'var(--gold)',
    bg: 'rgba(201,168,76,0.12)',
    title: 'Color Management',
    desc: 'Manage colorways with hex codes and Pantone references. Visual swatches for your entire collection.',
  },
  {
    icon: Download,
    color: 'var(--teal)',
    bg: 'rgba(0,196,167,0.12)',
    title: 'One-Click PDF Export',
    desc: 'Generate production-ready A4 techpacks instantly. Professional layouts with your branding.',
  },
  {
    icon: Shirt,
    color: '#7b61ff',
    bg: 'rgba(123,97,255,0.12)',
    title: 'Garment Library',
    desc: 'Start with pre-built silhouettes: T-Shirt, Dress, Jacket, Jeans, Skirt, Shirt, Hoodie, Coat and more.',
  },
];

const PERKS = [
  'Professional techpack layouts used by top fashion brands',
  'Size grading table with auto-fill and CSV import',
  'Unlimited techpacks saved locally, export anytime',
  'One-click PDF generation — no design software needed',
];

// Animated garment preview SVG
const HeroGarment: React.FC = () => (
  <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 220, height: 260 }}>
    <path d="M65 45 Q70 30 80 26 Q97 18 110 18 Q123 18 140 26 Q150 30 155 45
             L175 60 L175 82 L158 79 L158 230 Q158 238 150 238 L70 238 Q62 238 62 230
             L62 79 L45 82 L45 60 Z"
          fill="#1a2236" stroke="#c9a84c" strokeWidth="1.5"/>
    <path d="M80 26 Q97 38 110 38 Q123 38 140 26" fill="#111621" stroke="#c9a84c" strokeWidth="1.5"/>
    {/* Dimension lines */}
    <line x1="30" y1="79" x2="30" y2="230" stroke="#00c4a7" strokeWidth="1" strokeDasharray="0"/>
    <line x1="25" y1="79" x2="35" y2="79" stroke="#00c4a7" strokeWidth="1"/>
    <line x1="25" y1="230" x2="35" y2="230" stroke="#00c4a7" strokeWidth="1"/>
    <text x="20" y="160" fill="#00c4a7" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 160)">68 cm</text>
    {/* Width dimension */}
    <line x1="62" y1="250" x2="158" y2="250" stroke="#c9a84c" strokeWidth="1"/>
    <line x1="62" y1="245" x2="62" y2="255" stroke="#c9a84c" strokeWidth="1"/>
    <line x1="158" y1="245" x2="158" y2="255" stroke="#c9a84c" strokeWidth="1"/>
    <text x="110" y="262" fill="#c9a84c" fontSize="8" textAnchor="middle">52 cm</text>
    {/* Callout */}
    <circle cx="158" cy="79" r="3" fill="none" stroke="#c9a84c" strokeWidth="1"/>
    <line x1="161" y1="76" x2="180" y2="60" stroke="#c9a84c" strokeWidth="0.75" strokeDasharray="3 2"/>
    <text x="185" y="58" fill="#c9a84c" fontSize="7">Armhole</text>
    {/* Grid dots */}
    {Array.from({ length: 6 }).map((_, i) =>
      Array.from({ length: 8 }).map((_, j) => (
        <circle key={`${i}-${j}`} cx={40 + i * 30} cy={25 + j * 30} r="0.8" fill="rgba(255,255,255,0.06)" />
      ))
    )}
  </svg>
);

export const LandingPage: React.FC = () => {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="landing-nav glass">
        <div className="flex items-center gap-3">
          <div className="sidebar__logo-icon" style={{ width: 36, height: 36 }}>
            <Shirt size={18} />
          </div>
          <span className="sidebar__logo-name gradient-text" style={{ fontSize: '1.125rem' }}>TechPac</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" style={{ paddingTop: 100 }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, width: '100%' }}>
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: 'var(--sp-5)' }}>
            <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
              ✦ Professional Fashion Tech Design
            </span>
          </div>

          <h1 className="text-display" style={{ marginBottom: 'var(--sp-5)' }}>
            Create <span className="gradient-text">Professional Techpacks</span>{' '}
            in Minutes
          </h1>

          <p className="text-body text-secondary" style={{ fontSize: '1.125rem', marginBottom: 'var(--sp-8)', maxWidth: 560, margin: '0 auto var(--sp-8)' }}>
            The all-in-one platform for fashion designers to create technical specification sheets
            with interactive drawings, measurements, and one-click PDF export.
          </p>

          <div className="flex items-center justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Creating Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          {/* Hero visual */}
          <div style={{
            marginTop: 'var(--sp-12)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: 'var(--sp-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--sp-8)',
            flexWrap: 'wrap',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            <HeroGarment />
            <div style={{ textAlign: 'left', maxWidth: 280 }}>
              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <div className="text-xs text-muted" style={{ marginBottom: 4 }}>STYLE</div>
                <div className="text-h3">Classic Crew Neck</div>
                <div className="text-sm text-secondary">SS2024 · T-Shirt</div>
              </div>
              <div className="divider" style={{ marginBottom: 'var(--sp-4)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {['100% Organic Cotton', 'Weight: 180 GSM', 'Flat-lock stitching'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <CheckCircle size={14} color="var(--teal)" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="divider" style={{ margin: 'var(--sp-4) 0' }} />
              <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                {['#1a1a2e', '#c9a84c', '#00c4a7', '#f0f2f8'].map(hex => (
                  <div key={hex} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: hex, border: '2px solid var(--border-hover)'
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Perks */}
          <div style={{ marginTop: 'var(--sp-10)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', alignItems: 'center' }}>
            {PERKS.map(p => (
              <div key={p} className="flex items-center gap-3 text-sm text-secondary">
                <CheckCircle size={16} color="var(--teal)" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--sp-16) var(--sp-8) var(--sp-8)' }}>
          <h2 className="text-h1" style={{ marginBottom: 'var(--sp-3)' }}>
            Everything you need for <span className="gradient-text">production-ready techpacks</span>
          </h2>
          <p className="text-body text-secondary">Built specifically for fashion designers and product developers.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-card__icon" style={{ background: bg }}>
                <Icon size={24} color={color} />
              </div>
              <h3 className="text-h4" style={{ marginBottom: 'var(--sp-2)' }}>{title}</h3>
              <p className="text-sm text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: 'var(--sp-16) var(--sp-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-h1" style={{ marginBottom: 'var(--sp-4)' }}>
            Ready to create your first techpack?
          </h2>
          <p className="text-body text-secondary" style={{ marginBottom: 'var(--sp-8)' }}>
            Join fashion designers using TechPac to streamline their production workflow.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: 'var(--sp-6) var(--sp-8)', textAlign: 'center' }}>
        <p className="text-sm text-muted">© 2024 TechPac — Professional Fashion Techpack Platform</p>
      </footer>
    </div>
  );
};
