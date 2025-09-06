
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {

  const navigate = useNavigate();



  return (

    <div style={{

      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      padding: 0,

    }}>



      <div style={{

        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 6px 32px 0 #30477718',
        padding: '56px 44px 44px 44px',
        minWidth: 340,
        maxWidth: 420,
        width: '92vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
        animation: 'fadeInUp 0.7s cubic-bezier(.4,1.3,.5,1)',
        border: '1.5px solid #e5e7eb',

      }}>



        <h1 style={{

          fontFamily: 'Inter, Roboto, Arial, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#304777',
          marginBottom: 8,
          letterSpacing: '0.5px',

        }}>
 
          Store Rating
        </h1>


        <div style={{

          fontSize: '1.12rem',
          color: '#304777',
          fontWeight: 400,
          marginBottom: 32,
          textAlign: 'center',
          lineHeight: 1.6,

        }}>
          Discover and Rate local stores.<br />

          <span style={{ color: '#14213d', fontWeight: 600 }}>Your opinion matters.</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: 0 }}>


          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '11px 32px',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#304777',
              background: '#f3f4f6',
              border: '1.5px solid #304777',
              borderRadius: '8px',
              boxShadow: '0 1px 4px #30477711',
              cursor: 'pointer',
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              letterSpacing: 0.2,

            }}

            onMouseOver={e => {

              e.currentTarget.style.background = '#304777';
              e.currentTarget.style.color = '#fff';

            }}


            onMouseOut={e => {

              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#304777';

            }}



          >
            Sign Up

          </button>

          <button

            onClick={() => navigate('/login')}

            style={{

              padding: '11px 32px',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#304777',
              background: '#f3f4f6',
              border: '1.5px solid #304777',
              borderRadius: '8px',
              boxShadow: '0 1px 4px #30477711',
              cursor: 'pointer',
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              letterSpacing: 0.2,


            }}


            onMouseOver={e => {

              e.currentTarget.style.background = '#304777';
              e.currentTarget.style.color = '#fff';

            }}

            onMouseOut={e => {

              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#304777';

            }}


          >
            Login

          </button>

        </div>

      </div>

      <div style={{ marginTop: 32, color: '#30477766', fontSize: 14, fontFamily: 'Inter, Roboto, Arial, sans-serif', letterSpacing: 0.2, fontWeight: 400, textAlign: 'center' }}>
        Project by <span style={{ fontWeight: 500, color: '#30477799' }}>Sanika Matey</span>
      </div>

      
      <div style={{ marginTop: 24, color: '#30477799', fontSize: 15, fontFamily: 'Inter, Roboto, Arial, sans-serif', letterSpacing: 0.2 }}>
        &copy; {new Date().getFullYear()} Store Rating. All rights reserved.
      </div>

    </div>

  );


};



export default Home;
