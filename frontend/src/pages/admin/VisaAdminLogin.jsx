import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, Plane } from 'lucide-react';
import { useVisaAdmin } from '../../lib/VisaAdminContext';

const VisaAdminLogin = ({ onSuccess }) => {
  const { login } = useVisaAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error);
    else if (onSuccess) onSuccess();
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#003D52 0%,#006080 50%,#003D52 100%)',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'1.5rem',padding:'2.5rem',width:'100%',maxWidth:'420px',boxShadow:'0 25px 50px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{width:'60px',height:'60px',background:'linear-gradient(135deg,#FF2A2A,#ff6b6b)',borderRadius:'1rem',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
            <Plane size={28} color="white" />
          </div>
          <h1 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#003D52',marginBottom:'0.25rem'}}>Visa Admin Portal</h1>
          <p style={{color:'#64748b',fontSize:'0.875rem'}}>Sign in to manage visa pricing & listings</p>
        </div>

        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div>
            <label style={{display:'block',fontSize:'0.875rem',fontWeight:'600',color:'#003D52',marginBottom:'0.5rem'}}>Email</label>
            <div style={{position:'relative'}}>
              <Mail size={16} style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="banjaratravel@gmail.com"
                style={{width:'100%',padding:'0.625rem 0.75rem 0.625rem 2.25rem',border:'1px solid #e2e8f0',borderRadius:'0.5rem',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
              />
            </div>
          </div>

          <div>
            <label style={{display:'block',fontSize:'0.875rem',fontWeight:'600',color:'#003D52',marginBottom:'0.5rem'}}>Password</label>
            <div style={{position:'relative'}}>
              <Lock size={16} style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{width:'100%',padding:'0.625rem 0.75rem 0.625rem 2.25rem',border:'1px solid #e2e8f0',borderRadius:'0.5rem',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
              />
            </div>
          </div>

          {error && (
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'0.5rem',padding:'0.75rem',color:'#dc2626',fontSize:'0.875rem'}}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{background:'linear-gradient(135deg,#FF2A2A,#E01F1F)',color:'white',border:'none',borderRadius:'0.5rem',padding:'0.75rem',fontWeight:'600',fontSize:'0.875rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}
          >
            {loading && <Loader2 size={16} style={{animation:'spin 1s linear infinite'}} />}
            {loading ? 'Signing in...' : 'Sign in to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisaAdminLogin;
