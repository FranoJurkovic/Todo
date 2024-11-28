import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.scss';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseconfing';
import { useAuth } from '../../Hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Čekaj da se proces odjave završi
      navigate('/'); // Preusmjeri na početnu stranicu
    } catch (error) {
      console.error("Greška prilikom prijave:", error);
    }
  };

  if (loading) return null; // Dok je stanje učitavanja true

  return (
    <nav>
      {user ? ( // Ako je korisnik prijavljen, prikaži pozdrav i gumb za odjavu
        <>
          <h2>Pozdrav, {user.email}!</h2>
          <button onClick={handleLogout}>Odjavi se</button>
        </>
      ) : (
        <></> // Ako korisnik nije prijavljen, ne prikazuj ništa
      )}
    </nav>
  );
};