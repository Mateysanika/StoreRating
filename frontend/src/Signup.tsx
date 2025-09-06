import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from './UserTypeIcons/UserNormal.png';
import ownerIcon from './UserTypeIcons/StoreKaOwner.png';
import adminIcon from './UserTypeIcons/AdminBhai.png';

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


const roleOptions = [
  {
    value: 'user',
    icon: userIcon,
    label: 'User',
  },
  {
    value: 'owner',
    icon: ownerIcon,
    label: 'Store Owner',
  },
  {
    value: 'admin',
    icon: adminIcon,
    label: 'Admin',
  },
];

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminKey, setAdminKey] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminBlockVisible, setAdminBlockVisible] = useState(false); 

  const [buttonMargin, setButtonMargin] = useState('8px'); 
  const navigate = useNavigate();

  // Sequencing button slide and admin block fade
  React.useEffect(() => {
    let fadeTimeout: NodeJS.Timeout | undefined;
    let slideTimeout: NodeJS.Timeout | undefined;
    if (role === 'admin') {
      setAdminBlockVisible(true);

      setButtonMargin('66px');
      slideTimeout = setTimeout(() => setShowAdminKey(true), 220); 
    } else {

      setShowAdminKey(false);
      fadeTimeout = setTimeout(() => {
        setAdminBlockVisible(false); 
        setButtonMargin('8px');

      }, 220);


    }

    return () => {
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (slideTimeout) clearTimeout(slideTimeout);
    };
  }, [role]);


  

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');

    
    
    if (name.length < 20 || name.length > 60) {

      setError('Name must be between 20 and 60 characters.');
      return;

    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {

      setError('Please enter a valid email address.');
      return;
    }


    
    if (address.length > 400) {

      setError('Address must be at most 400 characters.');
      return;
    }

    

    if (password.length < 8 || password.length > 16) {
      setError('Password must be 8-16 characters.');
      return;


    }

    if (!/[A-Z]/.test(password)) {

      setError('Password must include at least one uppercase letter.');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {

      setError('Password must include at least one special character.');
      return;
    }

    if (role === 'admin' && adminKey !== 'AdminAuthKey') {
      setError('Invalid admin authorization key');
      return;
    }


    try {

      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name, address }),


      });

      const data = await response.json();

      if (response.ok) {

        alert('Signup successful!');
        navigate('/login');
      } else {

        setError(data.message || 'Signup failed');
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


  <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.7rem', color: '#304777', marginBottom: '6px', marginTop: '-10px', letterSpacing: '0.5px' }}>Sign Up</h2>
  <div style={{ width: '100%', borderBottom: '1.5px solid #e5e7eb', margin: '0 0 14px 0' }} />
  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '1.02rem', color: '#304777', marginBottom: '7px', marginTop: '2px', letterSpacing: '0.1px' }}>Choose one</div>




  <div style={{ display: 'flex', gap: '32px', marginBottom: '22px', justifyContent: 'center' }}>
          
          
          {roleOptions.map(opt => (
            <div
              
            key={opt.value}
              
              onClick={() => setRole(opt.value)}
              style={{

                display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                border: role === opt.value ? '2.5px solid #304777' : '2.5px solid #e5e7eb',
                borderRadius: '12px',

                padding: '12px 18px 8px 18px',
                background: role === opt.value ? '#f3f4f6' : '#fff',

                boxShadow: role === opt.value ? '0 2px 8px #30477722' : 'none',
                transition: 'all 0.18s',
                minWidth: '70px',
                
              }}

            >
              <img

                src={opt.icon}
                alt={opt.label}
                style={{

                  width: 54,
                  height: 54,
                  marginBottom: 4,
                  filter: role === opt.value ? 'none' : 'grayscale(0.7)',
                  transition: 'filter 0.18s'
                }}

              />
              <span style={{ fontSize: '1.02rem', color: role === opt.value ? '#304777' : '#888', fontWeight: 600, marginTop: '2px' }}>{opt.label}</span>
            </div>

          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '360px', maxWidth: '100%' }}>
         
          <div style={{ marginBottom: '12px', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            
            
            <label style={labelStyle}>Name:</label>
            <input

              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={20}
              maxLength={60}
              style={{ ...inputStyle, width: '100%' }}
              placeholder="Enter Your Full Name (20-60 characters)"

            />
          </div>

          <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={labelStyle}>Address:</label>
            <textarea

              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              maxLength={400}
              style={{ ...inputStyle, minHeight: '48px', resize: 'vertical' }}
              placeholder="Enter Your Address (max 400 characters)"

            />
          </div>


          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', width: '100%' }}>
            
            <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Email:</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
              
              <label style={labelStyle}>Password:</label>
              <input
              
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={16}
                style={inputStyle}
                placeholder="8-16 chars"

              />
              
              <span
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 10, top: 32, cursor: 'pointer', color: '#304777', fontSize: 13, userSelect: 'none' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>

            </div>


          </div>




          <div style={{
            minHeight: '60px',
            marginBottom: '2px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            transition: 'min-height 0.2s',
          }}>


            {/*Fade Animation, Auth key ke liye*/}
            {adminBlockVisible && (
              <div
                style={{

                  opacity: showAdminKey ? 1 : 0,
                  pointerEvents: showAdminKey ? 'auto' : 'none',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: 2,
                  transition: 'opacity 0.22s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  marginBottom: '12px',

                }}
              >
                
                <label style={labelStyle}>Admin Authorization Key:</label>
                <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)} required={role === 'admin'} style={inputStyle} />
             
              </div>
            )}





            <button
              type="submit"
              style={{

                marginTop: buttonMargin,
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
              Sign Up
            </button>
          </div>

          {error && <div style={{ color: 'red', marginTop: '9px', textAlign: 'center', fontSize: '0.98rem' }}>{error}</div>}




                    
          
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.98rem' }}>
            Already registered?{' '}
            
            
            <span
              style={{ color: '#304777', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => navigate('/login')}
            >
              Log in
            </span>


          </div>

        </form>

      </div>

    </div>


  );

};



export default Signup;
