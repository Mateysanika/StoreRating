
import { useEffect } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';




type SortState = { field: 'name' | 'address' | 'overall' | 'your', direction: 'asc' | 'desc' };

interface Store {

  id: number;
  name: string;
  address: string;
  description?: string;

}

interface Rating {

  id: number;
  stars: number;
  comment?: string;
  userId: number;
  storeId: number;

}

const menuIcon = (

  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#304777" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>

);

const UserDashboard: React.FC = () => {


  const [sort, setSort] = React.useState<SortState>({ field: 'name', direction: 'asc' });
  function handleSort(field: 'name' | 'address' | 'overall' | 'your') {
    setSort(prev => prev.field === field ? { field: field, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { field: field, direction: 'asc' });
  
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenuIcon, setShowMenuIcon] = useState(true);

  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);

  const [ratings, setRatings] = useState<Rating[]>([]);

  const [userRatings, setUserRatings] = useState<{ [storeId: number]: Rating }>({});
  const [searchName, setSearchName] = useState('');

  const [searchAddress, setSearchAddress] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  
  const [ratingUI, setRatingUI] = useState<{ [storeId: number]: { selectedStars: number | null, hoverStars: number | null, submitting: boolean, error?: string } }>({});
  
  
  useEffect(() => {
   
    setUserId(Number(localStorage.getItem('user_id')) || 1);
  }, []);



  
  useEffect(() => {

    async function fetchData() {
      const storesRes = await fetch('http://localhost:3000/stores');
      const storesData = await storesRes.json();
      setStores(storesData);
      const ratingsRes = await fetch('http://localhost:3000/ratings');
      let ratingsData = await ratingsRes.json();

      
      ratingsData = ratingsData.map((r: any) => ({

        ...r,
        userId: r.userId !== undefined ? r.userId : (r.user && r.user.id),
        storeId: r.storeId !== undefined ? r.storeId : (r.store && r.store.id),
      }));


      setRatings(ratingsData);

      
      const userRatingsMap: { [storeId: number]: Rating } = {};
      ratingsData.forEach((r: Rating) => {

        if (userId && r.userId === userId) userRatingsMap[r.storeId] = r;

      });
      setUserRatings(userRatingsMap);

    }
    fetchData();
  }, [userId]);


  
  useEffect(() => {

    const token = localStorage.getItem('access_token');
    if (!token) {

      navigate('/login', { replace: true });

    }
  }, [navigate]);


  const handleLogout = () => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/login');

  };

  return (

  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', position: 'relative', transition: 'background 0.4s, box-shadow 0.4s, filter 0.4s' }}>


  {showMenuIcon && !menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 32,
            left: 18,
            zIndex: 40,
            transition: 'top 0.4s cubic-bezier(.4,1.3,.5,1), left 0.4s cubic-bezier(.4,1.3,.5,1)',
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
              transition: 'background 0.18s, box-shadow 0.3s cubic-bezier(.4,1.3,.5,1)',
            
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

  <div style={{ padding: '18px 28px', cursor: 'pointer', color: '#304777', fontWeight: 500, fontSize: '1.08rem', marginTop: 32 }} onClick={handleLogout}>Log out</div>
      </div>



  {menuOpen && <div onClick={() => { setMenuOpen(false); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0002', zIndex: 25 }} />}
  <div style={{ maxWidth: 700, margin: '32px auto 0', padding: '0 24px' }}>

        <h2 style={{ textAlign: 'center' }}>Hi{userId ? `, ${localStorage.getItem('user_name') || 'User'}` : ''}!</h2>
       
        <p style={{ textAlign: 'center', marginBottom: 32, fontWeight: 500, fontSize: 18 }}>Rate your favourite stores</p>
        {/* Search fields */}
       
       
        <div style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center' }}>
          <input type="text" placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} style={{ padding: 7, borderRadius: 6, border: '1px solid #d1d5db', minWidth: 120 }} />
          <input type="text" placeholder="Search by address" value={searchAddress} onChange={e => setSearchAddress(e.target.value)} style={{ padding: 7, borderRadius: 6, border: '1px solid #d1d5db', minWidth: 120 }} />
        </div>
       



 <div style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 1px 8px #30477711', padding: 0, maxHeight: 400, overflowY: 'auto' }}>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            
            <thead>
              
              
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Store Name {sort.field === 'name' && (sort.direction === 'asc' ? '▲' : '▼')}
                </th>
               
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('address')}>
                  Address {sort.field === 'address' && (sort.direction === 'asc' ? '▲' : '▼')}
                </th>
               
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('overall')}>
                  Overall Rating {sort.field === 'overall' && (sort.direction === 'asc' ? '▲' : '▼')}
                </th>
                
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('your')}>
                  Your Rating {sort.field === 'your' && (sort.direction === 'asc' ? '▲' : '▼')}
                </th>
                
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Action</th>
              </tr>
            
            </thead>
           
           
            <tbody>
              
              {stores.filter(s =>
                (!searchName || s.name.toLowerCase().includes(searchName.toLowerCase())) &&
                (!searchAddress || (s.address || '').toLowerCase().includes(searchAddress.toLowerCase()))
              )
               
              .sort((a, b) => {

                
                  const storeRatingsA = ratings.filter(r => r.storeId === a.id);
                  const storeRatingsB = ratings.filter(r => r.storeId === b.id);
                  const overallA = storeRatingsA.length ? storeRatingsA.reduce((sum, r) => sum + r.stars, 0) / storeRatingsA.length : 0;
                  const overallB = storeRatingsB.length ? storeRatingsB.reduce((sum, r) => sum + r.stars, 0) / storeRatingsB.length : 0;
                  const yourA = userRatings[a.id]?.stars ?? -1;
                  const yourB = userRatings[b.id]?.stars ?? -1;

                  if (sort.field === 'name') {

                    return sort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                 
                  }
                  if (sort.field === 'address') {

                    return sort.direction === 'asc' ? (a.address || '').localeCompare(b.address || '') : (b.address || '').localeCompare(a.address || '');
                  
                  }
                  if (sort.field === 'overall') {

                    return sort.direction === 'asc' ? overallA - overallB : overallB - overallA;
                  }

                  if (sort.field === 'your') {
                    return sort.direction === 'asc' ? yourA - yourB : yourB - yourA;
                  }



                  const aRated = userRatings[a.id]?.stars !== undefined;
                  const bRated = userRatings[b.id]?.stars !== undefined;
                  if (aRated && !bRated) return -1;
                  if (!aRated && bRated) return 1;
                  return a.id - b.id;
                })

                .map(store => {

                  
                  const storeRatings = ratings.filter(r => r.storeId === store.id).sort((a, b) => (b.id || 0) - (a.id || 0));
                  const overall = storeRatings.length ? (storeRatings.reduce((sum, r) => sum + r.stars, 0) / storeRatings.length).toFixed(2) : 'N/A';
                 
                  const userRatingValue = userRatings[store.id]?.stars !== undefined ? userRatings[store.id].stars : 'N/A';
                  const ui = ratingUI[store.id] || { selectedStars: null, hoverStars: null, submitting: false };
                  
                  return (
                  
                  <tr key={store.id} style={{ borderTop: '1px solid #f1f1f1' }}>
                    <td style={{ padding: '8px 6px' }}>{store.name}</td>
                    <td style={{ padding: '8px 6px' }}>{store.address || <span style={{ color: '#aaa' }}>No address</span>}</td>
                    <td style={{ padding: '8px 6px', fontWeight: 600, color: '#304777' }}>{overall}</td>
                    <td style={{ padding: '8px 6px', fontWeight: 600, color: '#304777', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {userRatingValue}
                      {userRatingValue !== 'N/A' && <span style={{ color: '#FFD700', fontSize: 18 }}>★</span>}
                   
                    </td>
                   
                    <td style={{ padding: '8px 6px' }}>
                      <form style={{ display: 'flex', alignItems: 'center', gap: 4 }} onSubmit={async e => {
                        e.preventDefault();
                       
                        const stars = Number(ui.selectedStars);
                        
                        if (!stars || stars < 1 || stars > 5) {
                          setRatingUI(prev => ({ ...prev, [store.id]: { ...ui, error: 'Please select a rating (1-5 stars)' } }));
                          return;
                        }
                        
                        
                        setRatingUI(prev => ({ ...prev, [store.id]: { ...ui, submitting: true, error: undefined } }));
                       
                        const existing = userRatings[store.id];
                        const method = existing ? 'PUT' : 'POST';
                        const url = existing ? `http://localhost:3000/ratings/${existing.id}` : 'http://localhost:3000/ratings';
                        
                        try {
                          const res = await fetch(url, {
                        
                            method,
                           
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              stars,
                              userId: Number(userId),
                              storeId: Number(store.id),
                        
                            }),

                          });


                          if (!res.ok) throw new Error('Failed to submit rating');

                          
                          
                          const ratingsRes = await fetch('http://localhost:3000/ratings');
                          
                          let ratingsData = await ratingsRes.json();
                          
                          ratingsData = ratingsData.map((r: any) => ({
                            ...r,
                            userId: r.userId !== undefined ? r.userId : (r.user && r.user.id),
                            storeId: r.storeId !== undefined ? r.storeId : (r.store && r.store.id),
                          }));

                          setRatings(ratingsData);

                          
                          const userRatingsMap: { [storeId: number]: Rating } = {};
                          
                          ratingsData.forEach((r: Rating) => {
                            if (userId && r.userId === userId) userRatingsMap[r.storeId] = r;
                          });

                          setUserRatings(userRatingsMap);

                          setRatingUI(prev => ({ ...prev, [store.id]: { selectedStars: null, hoverStars: null, submitting: false, error: undefined } }));
                        } catch (err) {

                          setRatingUI(prev => ({ ...prev, [store.id]: { ...ui, submitting: false, error: 'Failed to submit rating' } }));
                       
                        }
                      }}>


                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            
                            {[1,2,3,4,5].map(n => (
                              
                              <span
                                key={n}
                               
                                style={{
                                  cursor: ui.submitting ? 'not-allowed' : 'pointer',
                                  color: (ui.hoverStars || ui.selectedStars || userRatings[store.id]?.stars || 0) >= n ? '#FFD700' : '#d1d5db',
                                  fontSize: 22,
                                  transition: 'color 0.18s',
                                  userSelect: 'none',
                               
                                }}
                                
                                onMouseEnter={() => !ui.submitting && setRatingUI(prev => ({ ...prev, [store.id]: { ...ui, hoverStars: n } }))}
                                onMouseLeave={() => !ui.submitting && setRatingUI(prev => ({ ...prev, [store.id]: { ...ui, hoverStars: null } }))}
                               
                                onClick={() => !ui.submitting && setRatingUI(prev => ({ ...prev, [store.id]: { ...ui, selectedStars: n, error: undefined } }))}
                              >
                                ★
                              </span>

                            ))}

                          </div>

                          
                          {ui.error && <div style={{ color: 'red', fontSize: 13, marginLeft: 8 }}>{ui.error}</div>}
                          
                          <div style={{
                            opacity: ui.selectedStars ? 1 : 0,
                            transform: ui.selectedStars ? 'translateY(0)' : 'translateY(10px)',
                            pointerEvents: ui.selectedStars ? 'auto' : 'none',
                            marginLeft: 8,
                            position: 'static',
                            display: 'inline-block',
                            transition: 'opacity 0.25s cubic-bezier(.4,1.3,.5,1), transform 0.25s cubic-bezier(.4,1.3,.5,1)',
                          
                          }}>
                           
                           
                            <button type="submit" disabled={ui.submitting} style={{

                              padding: '2px 10px',
                              borderRadius: 6,
                              border: 'none',
                              background: '#304777',
                              color: '#fff',
                              fontWeight: 500,
                              cursor: ui.submitting ? 'not-allowed' : 'pointer',
                              transition: 'background 0.18s, opacity 0.25s cubic-bezier(.4,1.3,.5,1), transform 0.25s cubic-bezier(.4,1.3,.5,1)',
                              opacity: ui.selectedStars ? 1 : 0,
                              transform: ui.selectedStars ? 'translateY(0)' : 'translateY(10px)',
                              pointerEvents: ui.selectedStars ? 'auto' : 'none',
                            
                            }}>

                              {ui.submitting ? 'Submitting...' : (userRatings[store.id] ? 'Update' : 'Submit')}
                            </button>

                          </div>

                        </div>
                      </form>

                    </td>

                  </tr>
                );

              })}
            </tbody>

          </table>
        </div>

      </div>
    </div>

  );
};



export default UserDashboard;
