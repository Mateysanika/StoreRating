

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



interface User {

  id: number;
  email: string;
  name?: string;
  address?: string;
  role: string;

}

const menuIcon = (

  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#304777" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>


);

interface Store {


  id: number;
  name: string;
  address: string;
  owner?: User;

}

interface Rating {

  id: number;
  stars: number;
  comment?: string;
  user?: User;
  store?: Store;

}


const AdminDashboard: React.FC = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const [showMenuIcon, setShowMenuIcon] = useState(true);
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ email: '', password: '', name: '', address: '', role: 'user' });
  const [addUserError, setAddUserError] = useState('');


  const [stores, setStores] = useState<Store[]>([]);
  const [storeLoading, setStoreLoading] = useState(true);

  const [showAddStore, setShowAddStore] = useState(false);
  const [addStoreForm, setAddStoreForm] = useState({ name: '', address: '', ownerId: '' });
  const [addStoreError, setAddStoreError] = useState('');
 
  
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [filterStore, setFilterStore] = useState('');
  const [filterUser, setFilterUser] = useState('');

  



  useEffect(() => {
    async function fetchRatings() {

      setRatingLoading(true);
      try {

  const res = await fetch('http://localhost:3000/ratings');
        const data = await res.json();
        setRatings(data);

      } catch (e) {

        setRatings([]);

      } finally {

        setRatingLoading(false);

      }
    }



    fetchRatings();

  }, []);


  
  useEffect(() => {

    async function fetchStores() {

      setStoreLoading(true);
      try {


  const res = await fetch('http://localhost:3000/stores');

        const data = await res.json();

        setStores(data);
      } catch (e) {

        setStores([]);

      } finally {

        setStoreLoading(false);

      }
    }
    fetchStores();
  }, []);


  
  async function handleAddStore(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    setAddStoreError('');
    try {

  const res = await fetch('http://localhost:3000/stores/admin-create', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          name: addStoreForm.name,
          address: addStoreForm.address,
          owner: addStoreForm.ownerId ? { id: parseInt(addStoreForm.ownerId, 10) } : undefined,


        }),
      });

      if (!res.ok) throw new Error('Failed to add store');

      setShowAddStore(false);

  setAddStoreForm({ name: '', address: '', ownerId: '' });

  
  
  const storesRes = await fetch('http://localhost:3000/stores');

      setStores(await storesRes.json());

    } catch (err) {
      setAddStoreError('Could not add store.');

    }
  }

  

  useEffect(() => {

    async function fetchUsers() {

      setUserLoading(true);
      try {

  const res = await fetch('http://localhost:3000/users');

        const data = await res.json();
        setUsers(data);

      } catch (e) {

        setUsers([]);
      } finally {

        setUserLoading(false);

      }
    }
    fetchUsers();

  }, []);


  
  async function handleAddUser(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    setAddUserError('');

    try {

  const res = await fetch('http://localhost:3000/users/admin-create', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addUserForm),

      });
      if (!res.ok) throw new Error('Failed to add user');

      setShowAddUser(false);
      setAddUserForm({ email: '', password: '', name: '', address: '', role: 'user' });

      

  const usersRes = await fetch('http://localhost:3000/users');

      setUsers(await usersRes.json());

    } catch (err) {

      setAddUserError('Could not add user.');

    }
  }


  const navigate = useNavigate();


  
  useEffect(() => {

    const token = localStorage.getItem('access_token');

    if (!token) {

      navigate('/login', { replace: true });
    }

  }, [navigate]);

  useEffect(() => {

    async function fetchStats() {
      try {

        const [users, stores, ratings] = await Promise.all([

          fetch('http://localhost:3000/users/count').then(r => r.json()),
          fetch('http://localhost:3000/stores/count').then(r => r.json()),
          fetch('http://localhost:3000/ratings/count').then(r => r.json()),

        ]);

        setStats({ users, stores, ratings });
      } catch (e) {

        
      } finally {

        setLoading(false);

      }

    }
    fetchStats();
  }, []);

  const handleLogout = () => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/login');

  };



  const [storeSort, setStoreSort] = useState<{ field: 'name' | 'owner', direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' });
  const [ratingSort, setRatingSort] = useState<{ field: 'store' | 'user' | 'stars', direction: 'asc' | 'desc' }>({ field: 'store', direction: 'asc' });

  function handleStoreSort(field: 'name' | 'owner') {

    setStoreSort(prev => prev.field === field ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
  }


  function handleRatingSort(field: 'store' | 'user' | 'stars') {

    setRatingSort(prev => prev.field === field ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
  }

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
  transition: 'transform 0.32s cubic-bezier(.77,.2,.05,1.0), box-shadow 0.3s cubic-bezier(.4,1.3,.5,1)',
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

  <div style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 24px' }}>
        
        <h2 style={{ textAlign: 'center' }}>Admin Dashboard</h2>
        
        <p style={{ textAlign: 'center', marginBottom: 32 }}>Welcome, admin! Here you can manage users, stores, and ratings.</p>


        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 40 }}>
         
          <div style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #30477722', padding: '24px 36px', minWidth: 180, textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#304777', fontWeight: 600 }}>Users</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{loading ? '...' : stats.users}</div>
          </div>
         
          <div style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #30477722', padding: '24px 36px', minWidth: 180, textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#304777', fontWeight: 600 }}>Stores</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{loading ? '...' : stats.stores}</div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #30477722', padding: '24px 36px', minWidth: 180, textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#304777', fontWeight: 600 }}>Ratings</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{loading ? '...' : stats.ratings}</div>
          </div>

        </div>





  <div style={{ display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center', width: '100%', maxWidth: 650, margin: '0 auto', padding: '0 8px' }}>
          
          <div style={{ width: '100%', background: '#f7f8fa', borderRadius: 14, boxShadow: '0 1px 6px #30477710', padding: '18px 18px 10px 18px', marginBottom: 0, border: '1px solid #e5e7eb' }}>
            
            <div style={{ fontWeight: 600, fontSize: 18, color: '#304777', marginBottom: 10, letterSpacing: 0.2 }}>User Management</div>
            
            <h3 style={{ color: '#304777', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Users
             
              <button onClick={() => setShowAddUser((v: boolean) => !v)} style={{ background: '#304777', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>{showAddUser ? 'Cancel' : 'Add User'}</button>
           
            </h3>



            {showAddUser && (
              
              
              <form onSubmit={handleAddUser} style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px #30477711' }}>
                
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input required type="email" placeholder="Email" value={addUserForm.email} onChange={e => setAddUserForm((f: typeof addUserForm) => ({ ...f, email: e.target.value }))} style={{ flex: 1, minWidth: 120, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }} />
                  <input required type="password" placeholder="Password" value={addUserForm.password} onChange={e => setAddUserForm((f: typeof addUserForm) => ({ ...f, password: e.target.value }))} style={{ flex: 1, minWidth: 100, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }} />
                
                </div>
               
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Name" value={addUserForm.name} onChange={e => setAddUserForm((f: typeof addUserForm) => ({ ...f, name: e.target.value }))} style={{ flex: 1, minWidth: 100, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }} />
                 
                  <input type="text" placeholder="Address" value={addUserForm.address} onChange={e => setAddUserForm((f: typeof addUserForm) => ({ ...f, address: e.target.value }))} style={{ flex: 2, minWidth: 120, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }} />
                 
                  <select value={addUserForm.role} onChange={e => setAddUserForm((f: typeof addUserForm) => ({ ...f, role: e.target.value }))} style={{ flex: 1, minWidth: 80, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }}>
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                 
                  </select>
              
                </div>
              
                {addUserError && <div style={{ color: 'red', marginTop: 6 }}>{addUserError}</div>}
               
                <button type="submit" style={{ marginTop: 10, background: '#304777', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer', fontSize: 15 }}>Add User</button>
             
             
              </form>
            )}


            <div style={{ background: '#f8fafc', borderRadius: 10, minHeight: 120, maxHeight: 220, boxShadow: '0 1px 4px #30477711', padding: 0, overflowX: 'auto', overflowY: 'auto', border: '1px solid #e5e7eb' }}>
              
              {userLoading ? (
                <div style={{ padding: 16 }}>Loading users...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
 
                     <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Email</th>
                     
                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Name</th>
                     
                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Role</th>
                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Address</th>
                   
                    </tr>
                 
                 
                  </thead>
                  
                  <tbody>


                    {users.length === 0 ? (

                      <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#888' }}>No users found.</td></tr>
                    
                    ) : (

                      users.map((u: User, i: number) => (

                        <tr key={u.id || i} style={{ borderTop: '1px solid #f1f1f1' }}>
                          
                          <td style={{ padding: '8px 6px' }}>{u.email}</td>
                          <td style={{ padding: '8px 6px' }}>{u.name}</td>
                         
                          <td style={{ padding: '8px 6px', textTransform: 'capitalize' }}>{u.role}</td>
                          <td style={{ padding: '8px 6px' }}>{u.address}</td>
                          
                          <td style={{ padding: '8px 6px' }}>
                            <button onClick={async () => {

                              if (window.confirm('Delete this user?')) {
                                await fetch(`http://localhost:3000/users/${u.id}`, { method: 'DELETE' });
                                setUsers(users.filter(user => user.id !== u.id));
                              
                              }
                            }} style={{ background: '#e3342f', color: '#fff', border: 'none', borderRadius: 5, padding: '2px 10px', cursor: 'pointer' }}>Delete</button>
                         
                          </td>
                        
                        
                        </tr>
                      ))
                   
                   )}
                  
                  </tbody>
                
                </table>
              
              )}
            
            </div>
          
          </div>
          
          
          <div style={{ width: '100%', background: '#f7f8fa', borderRadius: 14, boxShadow: '0 1px 6px #30477710', padding: '18px 18px 10px 18px', marginBottom: 0, border: '1px solid #e5e7eb' }}>
           
            <div style={{ fontWeight: 600, fontSize: 18, color: '#304777', marginBottom: 10, letterSpacing: 0.2 }}>Store Management</div>
           
            <h3 style={{ color: '#304777', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Stores
              <button onClick={() => setShowAddStore((v: boolean) => !v)} style={{ background: '#304777', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>{showAddStore ? 'Cancel' : 'Add Store'}</button>
           
            </h3>


            {showAddStore && (
             
             <form onSubmit={handleAddStore} style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px #30477711' }}>
               
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input required type="text" placeholder="Store Name" value={addStoreForm.name} onChange={e => setAddStoreForm(f => ({ ...f, name: e.target.value }))} style={{ flex: 2, minWidth: 120, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }} />
                  <input required type="text" placeholder="Address" value={addStoreForm.address} onChange={e => setAddStoreForm(f => ({ ...f, address: e.target.value }))} style={{ flex: 3, minWidth: 120, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }} />
                
                  <select required value={addStoreForm.ownerId} onChange={e => setAddStoreForm(f => ({ ...f, ownerId: e.target.value }))} style={{ flex: 1, minWidth: 80, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }}>
                    <option value="">Select Owner</option>
                    {users.filter(u => u.role === 'owner' || u.role === 'admin').map(u => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                
                ))}
                  </select>
                
                </div>
                {addStoreError && <div style={{ color: 'red', marginTop: 6 }}>{addStoreError}</div>}
                <button type="submit" style={{ marginTop: 10, background: '#304777', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer', fontSize: 15 }}>Add Store</button>
              </form>
           
           )}




           
            <div style={{ background: '#fff', borderRadius: 10, minHeight: 120, maxHeight: 220, boxShadow: '0 1px 4px #30477711', padding: 0, overflowX: 'auto', overflowY: 'auto', border: '1px solid #e5e7eb' }}>
              
              {storeLoading ? (
                <div style={{ padding: 16 }}>Loading stores...</div>
             
              ) : (

                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                 
                 
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                   
                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleStoreSort('name')}>
                        Name {storeSort.field === 'name' && (storeSort.direction === 'asc' ? '▲' : '▼')}
                    
                      </th>
                     
                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Address</th>
                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleStoreSort('owner')}>
                     
                        Owner {storeSort.field === 'owner' && (storeSort.direction === 'asc' ? '▲' : '▼')}
                   
                      </th>
                  
                    </tr>
                  
                  </thead>
                  
                  
                  <tbody>
                  
                    {stores.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#888' }}>No stores found.</td></tr>
                  
                    ) : (

                      
                      [...stores].sort((a, b) => {
                      
                        if (storeSort.field === 'name') {
                       
                          return storeSort.direction === 'asc'
                          ? a.name.localeCompare(b.name)
                         
                          : b.name.localeCompare(a.name);
                       
                        }

                        
                        if (storeSort.field === 'owner') {

                          const aOwner = a.owner?.name || a.owner?.email || '';
                          const bOwner = b.owner?.name || b.owner?.email || '';
                          return storeSort.direction === 'asc'
                            ? aOwner.localeCompare(bOwner)
                            : bOwner.localeCompare(aOwner);
                        
                          }
                        return 0;
                      }).map((s: Store, i: number) => (

                        <tr key={s.id || i} style={{ borderTop: '1px solid #f1f1f1' }}>
                          <td style={{ padding: '8px 6px' }}>{s.name}</td>

                          <td style={{ padding: '8px 6px' }}>{s.address}</td>

                          <td style={{ padding: '8px 6px' }}>{s.owner?.name || s.owner?.email || 'N/A'}</td>
                          <td style={{ padding: '8px 6px' }}>
                            <button onClick={async () => {

                              if (window.confirm('Delete this store?')) {
                                await fetch(`http://localhost:3000/stores/${s.id}`, { method: 'DELETE' });
                                setStores(stores.filter(store => store.id !== s.id));
                              }
                            
                            }} style={{ background: '#e3342f', color: '#fff', border: 'none', borderRadius: 5, padding: '2px 10px', cursor: 'pointer' }}>Delete</button>
                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              )}

            </div>

          </div>


          <div style={{ width: '100%', background: '#f7f8fa', borderRadius: 14, boxShadow: '0 1px 6px #30477710', padding: '18px 18px 10px 18px', marginBottom: 0, border: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#304777', marginBottom: 10, letterSpacing: 0.2 }}>Ratings Management</div>
            <h3 style={{ color: '#304777', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Ratings</h3>


            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>

              <select value={filterStore} onChange={e => setFilterStore(e.target.value)} style={{ flex: 1, minWidth: 80, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }}>
                <option value="">All Stores</option>

                {stores.map(s => (

                  <option key={s.id} value={s.id}>{s.name}</option>

                ))}

              </select>

              <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ flex: 1, minWidth: 80, padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }}>
                <option value="">All Users</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}

              </select>


            </div>



            <div style={{ background: '#fff', borderRadius: 10, minHeight: 120, maxHeight: 220, boxShadow: '0 1px 4px #30477711', padding: 0, overflowX: 'auto', overflowY: 'auto', border: '1px solid #e5e7eb' }}>
              {ratingLoading ? (
                <div style={{ padding: 16 }}>Loading ratings...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>

                    <tr style={{ background: '#f3f4f6' }}>

                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleRatingSort('store')}>
                        Store {ratingSort.field === 'store' && (ratingSort.direction === 'asc' ? '▲' : '▼')}
                      </th>

                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleRatingSort('user')}>
                        User {ratingSort.field === 'user' && (ratingSort.direction === 'asc' ? '▲' : '▼')}
                      </th>

                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleRatingSort('stars')}>
                        Stars {ratingSort.field === 'stars' && (ratingSort.direction === 'asc' ? '▲' : '▼')}
                      </th>

                      <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600 }}>Comment</th>
                    </tr>


                  </thead>

                  <tbody>


                    {ratings.filter(r =>
                      (!filterStore || r.store?.id === parseInt(filterStore, 10)) &&
                      (!filterUser || r.user?.id === parseInt(filterUser, 10))
                    ).length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#888' }}>No ratings found.</td></tr>
                    ) : (
                      ratings

                        .filter(r =>

                          (!filterStore || r.store?.id === parseInt(filterStore, 10)) &&
                          (!filterUser || r.user?.id === parseInt(filterUser, 10))
                        )


                        .sort((a, b) => {

                          if (ratingSort.field === 'store') {

                            const aStore = a.store?.name || '';
                            const bStore = b.store?.name || '';
                            return ratingSort.direction === 'asc' ? aStore.localeCompare(bStore) : bStore.localeCompare(aStore);
                          }

                          if (ratingSort.field === 'user') {

                            const aUser = a.user?.name || a.user?.email || '';
                            const bUser = b.user?.name || b.user?.email || '';
                            return ratingSort.direction === 'asc' ? aUser.localeCompare(bUser) : bUser.localeCompare(aUser);
                          }

                          if (ratingSort.field === 'stars') {

                            return ratingSort.direction === 'asc' ? a.stars - b.stars : b.stars - a.stars;
                          }

                          

                          return (b.id || 0) - (a.id || 0);

                        })
                        .map((r: Rating, i: number) => (

                        <tr key={r.id || i} style={{ borderTop: '1px solid #f1f1f1' }}>
                          <td style={{ padding: '8px 6px', fontWeight: 500, color: '#304777' }}>
                            {r.store?.name || 'N/A'}

                            <div style={{ fontSize: 12, color: '#888' }}>{r.store?.id ? `Store ID: ${r.store.id}` : ''}</div>
                          </td>

                          <td style={{ padding: '8px 6px', fontWeight: 500, color: '#304777' }}>
                            {r.user?.name || r.user?.email || 'N/A'}
                            <div style={{ fontSize: 12, color: '#888' }}>{r.user?.id ? `User ID: ${r.user.id}` : ''}</div>
                          </td>

                          <td style={{ padding: '8px 6px' }}>
                            <span style={{ color: '#FFD700', fontSize: 18, letterSpacing: 1 }}>
                              {'★'.repeat(r.stars)}

                              <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - r.stars)}</span>
                            </span>

                            <span style={{ marginLeft: 6, color: '#304777', fontWeight: 600 }}>{r.stars}</span>
                          </td>

                          <td style={{ padding: '8px 6px' }}>{r.comment}</td>

                          <td style={{ padding: '8px 6px' }}>

                            <button onClick={async () => {


                              if (window.confirm('Delete this rating?')) {
                                await fetch(`http://localhost:3000/ratings/${r.id}`, { method: 'DELETE' });
                                setRatings(ratings.filter(rating => rating.id !== r.id));
                              }


                            }} style={{ background: '#e3342f', color: '#fff', border: 'none', borderRadius: 5, padding: '2px 10px', cursor: 'pointer' }}>Delete</button>
                          </td>


                        </tr>

                      ))


                    )}
                  </tbody>

                </table>

              )}
            </div>

          </div>

        </div>

      </div>
    </div>

  );
};

export default AdminDashboard;
