import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoList } from '../Todo';
import { Navbar } from '../Navbar';
import './WelcomePage.css';
import { useAuth } from '../../Hooks/useAuth';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');  // Preusmjeri na login stranicu ako korisnik nije prijavljen
    }
  }, [loading, user, navigate]);

  if (loading) return <p>Loading...</p>;  // Dok se stanje učitava

  return (
    <div className="welcome-container">
      <Navbar />
      <TodoList /> {/* Prikazuje listu zadataka */}
    </div>
  );
};

export default WelcomePage;