import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RegisterStore: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  
  const ownerId = localStorage.getItem('user_id');
  const ownerName = localStorage.getItem('user_name');
  const ownerRole = localStorage.getItem('user_role');


  useEffect(() => {

    if (!ownerId || !ownerRole || ownerRole !== 'owner') {
      navigate('/login', { replace: true });
    }

  }, [ownerId, ownerRole, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');
    if (!ownerId || isNaN(Number(ownerId)) || Number(ownerId) <= 0) {
      setError('You must be logged in as a store owner to register a store. Please log in again.');
      return;

    }
    setSubmitting(true);
    try {

      const res = await fetch('http://localhost:3000/stores/admin-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ name, address, description, ownerId: Number(ownerId) }),

      });
      if (!res.ok) throw new Error('Failed to register store');
  navigate('/owner');
    } catch (err: any) {

      setError(err.message || 'Error registering store');

    } finally {

      setSubmitting(false);

    }
  };

  return (

    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #30477722', padding: 36, minWidth: 340, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeInUp 0.7s cubic-bezier(.4,1.3,.5,1)' }}>

        <h2 style={{ textAlign: 'center', color: '#304777', marginBottom: 8 }}>Register Your Store</h2>
        <div style={{ color: '#304777', fontWeight: 500, marginBottom: 8, textAlign: 'center' }}>Owner: {ownerName}</div>

        <input type="text" placeholder="Store Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }} />
        <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }} />

        <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, minHeight: 60 }} />
        {error && <div style={{ color: '#b91c1c', textAlign: 'center', fontWeight: 500 }}>{error}</div>}

        <button type="submit" disabled={submitting} style={{ background: '#304777', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.18s' }}>
          {submitting ? 'Registering...' : 'Register Store'}
        </button>

      </form>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}

      </style>
      
    </div>
  );
};

export default RegisterStore;
