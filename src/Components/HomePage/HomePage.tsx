import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { useAuth } from '../../Hooks/useAuth'; // Uvoz hooka useAuth

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/welcome'); // Preusmjeri prijavljenog korisnika na Welcome stranicu
    }
  }, [user, loading, navigate]);

  const handleNavigateToLogin = () => {
    navigate('/login'); // Putanja do stranice za prijavu
  };

  const handleNavigateToRegistration = () => {
    navigate('/register'); // Putanja do stranice za registraciju
  };

  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="left-section">
          <h1>Aplikacija zadataka</h1>
        </div>
        <div className="right-section">
          <button className="button" onClick={handleNavigateToLogin}>
            Prijava
          </button>
          <button className="button" onClick={handleNavigateToRegistration}>
            Registracija
          </button>
        </div>
      </nav>
      <div className="content">
        <hr />
        <div className="features">
          <h2>Zašto koristiti našu aplikaciju?</h2>
          <ul>
            <li>Jednostavno dodavanje, uređivanje i upravljanje zadacima</li>
            <li>Kategorizacija zadataka radi boljeg pregleda</li>
            <li>Pristup zadacima s bilo kojeg uređaja</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Aplikacija zadataka. Sva prava pridržana. Kreirao Frano ⚙️</p>
      </footer>
    </div>
  );
};

export default HomePage;