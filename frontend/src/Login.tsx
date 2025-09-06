import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';




const inputStyle: React.CSSProperties = {

  padding: '5px 8px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  marginBottom: '7px',
  fontSize: '0.92rem',
  fontFamily: 'Inter, sans-serif',
  background: '#f9fafb',
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
  height: '28px',
  transition: 'border 0.2s',

};

const labelStyle: React.CSSProperties = {

  marginBottom: '2px',
  color: '#374151',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.92rem',
  
};

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');

    try {

      const response = await fetch('http://localhost:3000/auth/login', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),

      });
      const data = await response.json();

      if (response.ok && data.access_token) {

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('user_id', String(data.user.id));
        localStorage.setItem('user_name', data.user.name || data.user.email || '');

        

        if (data.user.role === 'admin') {

          navigate('/admin');

        } else if (data.user.role === 'owner') {

          navigate('/owner');

        } else {

          navigate('/user');

        }
      } else {

        setError(data.error || 'Login failed');

      }

    } catch (err) {

      setError('Network error');
    }
  };

  return (

    <div style={{

      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', fontFamily: 'Inter, sans-serif'
    
    }}>
      <div style={{

        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px 0 #d1d5db44',
        padding: '32px 36px 24px 36px',
        minWidth: '420px',
        maxWidth: '98vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',


      }}>
        
        
        
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.7rem', color: '#304777', marginBottom: '6px', marginTop: '-10px', letterSpacing: '0.5px' }}>Login</h2>
        
        <div style={{ width: '100%', borderBottom: '1.5px solid #e5e7eb', margin: '0 0 14px 0' }} />
       
       
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '360px', maxWidth: '100%' }}>
          
          <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={labelStyle}>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          
          
          <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
            
            <label style={labelStyle}>Password:</label>
           
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
           
           />
           
            <span
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: 10, top: 32, cursor: 'pointer', color: '#304777', fontSize: 13, userSelect: 'none' }}
           
           
           >
              {showPassword ? 'Hide' : 'Show'}
          
            </span>
         
          </div>
         
         
          <button
            type="submit"
            style={{

              marginTop: '18px',
              padding: '10px 0',
              background: 'linear-gradient(90deg, #304777 0%, #14213d 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.05rem',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              transition: 'margin-top 0.22s',
              boxShadow: '0 1px 4px #30477722',
              position: 'relative',
              zIndex: 1,


            }}
          >


            Login
          </button>

          {error && <div style={{ color: 'red', marginTop: '9px', textAlign: 'center', fontSize: '0.98rem' }}>{error}</div>}
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.98rem' }}>
            New user?{' '}

            <span
              style={{ color: '#304777', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => navigate('/signup')}

            >
              Sign up
            </span>


          </div>

        </form>

      </div>
    </div>


  );
  
};




export default Login;
