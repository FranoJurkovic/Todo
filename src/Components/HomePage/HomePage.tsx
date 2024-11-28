import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';
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
          <h2>O nama</h2>
          <p>
            Dobrodošli u našu aplikaciju za upravljanje zadacima! Naša aplikacija omogućava korisnicima jednostavno i efikasno upravljanje njihovim svakodnevnim obavezama i zadacima. 
            Koristeći našu aplikaciju, korisnici mogu:
          </p>
          <ul>
            <li>Jednostavno dodavati, uređivati i upravljati zadacima.</li>
            <li>Kategorizirati zadatke radi boljeg pregleda i organizacije.</li>
            <li>Pristupati zadacima s bilo kojeg uređaja u bilo koje vrijeme.</li>
            <li>Dodavati nove kategorije za zadatke kako bi ih bolje organizirali.</li>
            <li>Nakon odabira kategorije, dodavati nove zadatke s opisima.</li>
            <li>Uređivati postojeće zadatke, ažurirati njihove opise i detalje.</li>
            <li>Označavati zadatke kao dovršene kada su gotovi.</li>
            <li>Brisati zadatke i kategorije koje više nisu potrebne.</li>
          </ul>
          <p>
            Cilj nam je pružiti vam najbolji alat za održavanje produktivnosti i organizacije vaših obaveza. Nadamo se da će vam aplikacija pomoći da bolje organizirate svoje vrijeme i zadatke.
          </p>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Aplikacija zadataka. Sva prava pridržana. Kreirao Frano 🛠️</p>
      </footer>
    </div>
  );
};

export default HomePage;