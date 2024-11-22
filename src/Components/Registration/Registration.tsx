import React, { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import { useAuth } from "../../Hooks/useAuth";

const Registration: FC = () => {
  const [name, setName] = useState<string>(""); // Korisničko ime
  const [email, setEmail] = useState<string>(""); // Email korisnika
  const [password, setPassword] = useState<string>(""); // Lozinka korisnika
  const [errorMessage, setErrorMessage] = useState<string>(""); // Poruka o grešci
  const navigate = useNavigate();

  const { register, error } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  // Funkcija za registraciju
  const handleRegister = async () => {
    if (name.trim() === "") {
      setErrorMessage("Unesite ime.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Email nije pravilno unešen.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Lozinka mora sadržavati bar 1 veliko slovo, 1 znak i biti dugačka minimalno 8 znakova.");
      return;
    }

    try {
      await register(email, password, name);
      navigate("/login");
    } catch {
      setErrorMessage(error || "Došlo je do greške prilikom registracije.");
    }
  };

  return (
    <div className="Registration">
      <h2>Registracija</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ime"
      /><br />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      /><br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Lozinka"
      /><br />
      <button onClick={handleRegister}>Spremi podatke</button>
      <br />
      <button className="button" onClick={() => navigate('/login')}>
        Već imate račun? Prijavite se
      </button>
    </div>
  );
};

export default Registration;