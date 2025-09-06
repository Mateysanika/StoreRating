
import { useEffect } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


type SortState = { field: 'name' | 'address' | 'avg' | 'ratings'; direction: 'asc' | 'desc' };

const menuIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#304777" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
);



const OwnerDashboard: React.FC = () => {

  const [sort, setSort] = React.useState<SortState>({ field: 'name', direction: 'asc' });
  function handleSort(field: 'name' | 'address' | 'avg' | 'ratings') {
    setSort(prev => prev.field === field ? { field: field, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { field: field, direction: 'asc' });
  }
  const [menuOpen, setMenuOpen] = useState(false);

  const [showMenuIcon, setShowMenuIcon] = useState(true);

  const [stores, setStores] = useState<any[]>([]);
  const [ratingsByStore, setRatingsByStore] = useState<{ [storeId: number]: any[] }>({});
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editStore, setEditStore] = useState<any | null>(null);
  const [editName, setEditName] = useState('');

  const [editAddress, setEditAddress] = useState('');

  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [ratingsModalStore, setRatingsModalStore] = React.useState<any | null>(null);
  const navigate = useNavigate();

  const ownerId = localStorage.getItem('user_id');

  const ownerName = localStorage.getItem('user_name');



  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);



  useEffect(() => {

    async function fetchStoresAndRatings() {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/stores/owner/${ownerId}`);
      const data = await res.json();
      setStores(data);

      const ratingsObj: { [storeId: number]: any[] } = {};

      await Promise.all(
        data.map(async (store: any) => {

          const rRes = await fetch(`http://localhost:3000/ratings/store/${store.id}`);
          ratingsObj[store.id] = await rRes.json();
        })

      );

      setRatingsByStore(ratingsObj);
      setLoading(false);

    }

    if (ownerId) fetchStoresAndRatings();
  }, [ownerId]);


  const handleLogout = () => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/login');

  };


  const handleRegisterStore = () => {
    navigate('/register-store');
  };


  return (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', position: 'relative' }}>
      {/* Left-side floating menu icon, hidden when menu is open */}
      {showMenuIcon && !menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 32,
            left: 18,
            zIndex: 40,
          }}


        >
          <div
            style={{
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '50%',
              padding: 7,
              boxShadow: '0 2px 8px #30477722',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.18s',
            }}
            onClick={() => { setMenuOpen(true); setShowMenuIcon(false); }}
          >
            {menuIcon}
          </div>
        </div>
      )}



      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 220,
          background: '#f8fafc',
          boxShadow: menuOpen ? '2px 0 16px #30477722' : 'none',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-110%)',
          transition: 'transform 0.32s cubic-bezier(.77,.2,.05,1.0)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 32
        }}

        onTransitionEnd={() => {
          if (!menuOpen) setShowMenuIcon(true);
        }}


      >

        <div
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            cursor: 'pointer',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setMenuOpen(false)}


        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#304777" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>

  <div style={{ padding: '18px 28px', cursor: 'pointer', color: '#304777', fontWeight: 500, fontSize: '1.08rem', marginTop: 32 }} onClick={handleRegisterStore}>Register Store</div>

  <div style={{ padding: '18px 28px', cursor: 'pointer', color: '#304777', fontWeight: 500, fontSize: '1.08rem' }} onClick={() => setEditModalOpen(true)}>Edit Stores</div>
        <div style={{ padding: '18px 28px', cursor: 'pointer', color: '#304777', fontWeight: 500, fontSize: '1.08rem' }} onClick={handleLogout}>Log out</div>



      {editModalOpen && (

        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
             background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #30477733', padding: 32, minWidth: 340, maxWidth: 400, width: '100%', position: 'relative', animation: 'fadeInUp 0.5s cubic-bezier(.4,1.3,.5,1)' }}>
            <div style={{
               position: 'absolute', top: 16, right: 16, cursor: 'pointer', fontSize: 22, color: '#304777' }} onClick={() => { setEditModalOpen(false); setEditStore(null); setEditError(''); }}>&times;</div>
            <h3 style={{ color: '#304777', textAlign: 'center', marginBottom: 18 }}>Edit Your Stores</h3>
            {!editStore ? (

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stores.map((store: any) => (

                  <li key={store.id} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontWeight: 500 }}>{store.name}</span>
                    <button style={{ background: '#304777', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 12px', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setEditStore(store); setEditName(store.name); setEditAddress(store.address || ''); setEditError(''); }}>Edit</button>
                    <button style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 12px', fontWeight: 500, cursor: 'pointer' }} onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this store?')) return;
                      setEditSubmitting(true);
                      setEditError('');
                      try {

                        await fetch(`http://localhost:3000/stores/${store.id}`, { method: 'DELETE' });
                        setStores(s => s.filter((s: any) => s.id !== store.id));
                        setEditStore(null);
                      } catch (err) {

                        setEditError('Failed to delete store');
                      } finally {

                        setEditSubmitting(false);

                      }
                    }}>Delete</button>

                  </li>
                ))}
                {editError && <div style={{ color: '#b91c1c', textAlign: 'center', fontWeight: 500, marginTop: 8 }}>{editError}</div>}

              </ul>

            ) : (

              <form onSubmit={async e => {
                e.preventDefault();
                setEditSubmitting(true);
                setEditError('');
                try {
                  const res = await fetch(`http://localhost:3000/stores/${editStore.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: editName, address: editAddress }),
                  });
                  if (!res.ok) throw new Error('Failed to update store');
                  setStores(s => s.map((s: any) => s.id === editStore.id ? { ...s, name: editName, address: editAddress } : s));
                  setEditStore(null);
                } catch (err) {
                  setEditError('Failed to update store');
                } finally {
                  setEditSubmitting(false);
                }


              }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required placeholder="Store Name" style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />

                <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} required placeholder="Address" style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />

                {editError && <div style={{ color: '#b91c1c', textAlign: 'center', fontWeight: 500 }}>{editError}</div>}

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="submit" disabled={editSubmitting} style={{ background: '#304777', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: editSubmitting ? 'not-allowed' : 'pointer' }}>{editSubmitting ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={() => setEditStore(null)} style={{ background: '#eee', color: '#304777', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            )}

          </div>

          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

        </div>
      )}

      </div>



      {menuOpen && <div onClick={() => { setMenuOpen(false); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0002', zIndex: 25 }} />}
  <div style={{ maxWidth: 700, margin: '32px auto 0', padding: '0 24px' }}>

        <h2 style={{ textAlign: 'center', color: '#304777' }}>Store Owner Dashboard</h2>

        <p style={{ textAlign: 'center', marginBottom: 32, fontWeight: 500, fontSize: 18 }}>Welcome{ownerName ? `, ${ownerName}` : ''}! Here you can manage your store and view ratings.</p>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#304777', fontWeight: 500 }}>Loading your stores...</div>

        ) : stores.length === 0 ? (

          <div style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 1px 8px #30477711', padding: 32, textAlign: 'center', marginTop: 32 }}>
            <div style={{ fontSize: 18, color: '#304777', fontWeight: 600, marginBottom: 12 }}>No current owned store</div>

            <div style={{ color: '#555', marginBottom: 18 }}>Would you like to register your store?</div>
            <button onClick={handleRegisterStore} style={{ background: '#304777', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.18s' }}>Register Store</button>
          </div>

        ) : (

          <div style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 16px #30477722', padding: 0, maxHeight: 500, overflowY: 'auto', marginTop: 32, transition: 'background 0.4s, box-shadow 0.4s, filter 0.4s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Store Name {sort.field === 'name' && (sort.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('address')}>
                    Address {sort.field === 'address' && (sort.direction === 'asc' ? '▲' : '▼')}
                  </th>

                  <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Description</th>

                  <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('avg')}>
                    Avg. Rating {sort.field === 'avg' && (sort.direction === 'asc' ? '▲' : '▼')}
                  </th>

                  <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('ratings')}>
                    Ratings {sort.field === 'ratings' && (sort.direction === 'asc' ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody>


                {[...stores].sort((a, b) => {
                  const ratingsA = ratingsByStore[a.id] || [];

                  const ratingsB = ratingsByStore[b.id] || [];

                  const avgA = ratingsA.length ? ratingsA.reduce((sum, r) => sum + r.stars, 0) / ratingsA.length : 0;
                  const avgB = ratingsB.length ? ratingsB.reduce((sum, r) => sum + r.stars, 0) / ratingsB.length : 0;
                  if (sort.field === 'name') {
                    return sort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                  }

                  if (sort.field === 'address') {
                    return sort.direction === 'asc'
                      ? (a.address || '').localeCompare(b.address || '')
                      : (b.address || '').localeCompare(a.address || '');
                  }

                  if (sort.field === 'avg') {
                    return sort.direction === 'asc' ? avgA - avgB : avgB - avgA;
                  }

                  if (sort.field === 'ratings') {
                    return sort.direction === 'asc' ? ratingsA.length - ratingsB.length : ratingsB.length - ratingsA.length;
                  }

                  return a.id - b.id;

                }).map((store: any) => {
                  const ratings = ratingsByStore[store.id] || [];
                  const avg = ratings.length ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(2) : 'N/A';
                  return (
                    <tr key={store.id} style={{ borderTop: '1px solid #f1f1f1', cursor: 'pointer', transition: 'background 0.25s cubic-bezier(.4,1.3,.5,1), box-shadow 0.3s cubic-bezier(.4,1.3,.5,1)' }}
                      onClick={() => setRatingsModalStore(store)}
                      onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <td style={{ padding: '8px 6px' }}>{store.name}</td>
                      <td style={{ padding: '8px 6px' }}>{store.address || <span style={{ color: '#aaa' }}>No address</span>}</td>
                      <td style={{ padding: '8px 6px' }}>{store.description || <span style={{ color: '#aaa' }}>No description</span>}</td>
                      <td style={{ padding: '8px 6px' }}>{avg}</td>
                      <td style={{ padding: '8px 6px', color: '#304777', fontWeight: 500 }}>
                        {ratings.length === 0 ? <span style={{ color: '#aaa' }}>No ratings</span> : `${ratings.length} rating${ratings.length > 1 ? 's' : ''}`}
                      </td>
                    </tr>
                  );
                })}



      {ratingsModalStore && (

        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #30477733', padding: 32, minWidth: 340, maxWidth: 400, width: '100%', position: 'relative', animation: 'fadeInUp 0.5s cubic-bezier(.4,1.3,.5,1)' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', fontSize: 22, color: '#304777' }} onClick={() => setRatingsModalStore(null)}>&times;</div>

            <h3 style={{ color: '#304777', textAlign: 'center', marginBottom: 18 }}>Ratings for {ratingsModalStore.name}</h3>
            {(() => {

              const ratings = ratingsByStore[ratingsModalStore.id] || [];
              if (ratings.length === 0) return <div style={{ color: '#aaa', textAlign: 'center' }}>No ratings for this store yet.</div>;
              return (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {ratings.map((r: any) => (
                    <li key={r.id} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                      <div style={{ fontWeight: 600, color: '#304777' }}>{r.stars}★</div>
                      <div style={{ color: '#555', fontSize: 14 }}>{r.comment || <span style={{ color: '#bbb' }}>No comment</span>}</div>
                      <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>By: {r.user?.name || r.user?.email || 'User'}</div>
                      
                    </li>

                  ))}


                </ul>

              );

            })()}
          </div>
        </div>
      )}



              </tbody>


            </table>

          </div>
        )}

      </div>


    </div>

  );
};


export default OwnerDashboard;
