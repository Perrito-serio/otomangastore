import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    // 1. Validación básica de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    console.log('Intentando registrar admin:', formData);

    try {
      // 2. Preparamos los datos para el backend (quitamos confirmPassword)
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      // 3. Llamada a la API
      await authService.registerAdmin(dataToSend);
      
      // 4. Éxito
      alert("¡Cuenta de Administrador creada con éxito! Ahora puedes iniciar sesión.");
      navigate('/login');

    } catch (err) {
      console.error("Error en registro:", err);
      // Muestra el mensaje de error que venga del backend o uno genérico
      setError(err.message || "Error al registrar. Verifica los datos o intenta más tarde.");
    }
  };

  return (
    <div className="auth-container register-mode">
      
      {/* Lado Imagen */}
      <div className="auth-image-side">
        <img 
          src="https://images.unsplash.com/photo-1620336655052-b579708bb60d?q=80&w=1000&auto=format&fit=crop" 
          alt="Register Background" 
        />
        <div className="auth-overlay">
          <h2>ÚNETE A LA LEGIÓN</h2>
          <p>Registra una cuenta de Administrador para gestionar la tienda.</p>
        </div>
      </div>

      {/* Lado Formulario */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">CREAR ADMIN</h1>
          <p className="auth-subtitle">Datos para el panel de control</p>

          {/* Mensaje de error visual */}
          {error && <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                name="password"
                className="form-input" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input 
                type="password" 
                name="confirmPassword"
                className="form-input" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem'}}>
                <input type="checkbox" required /> 
                Confirmo que soy personal autorizado
              </label>
            </div>

            <button type="submit" className="auth-btn">REGISTRAR ADMIN</button>
          </form>

          <div className="auth-footer">
            ¿Ya tienes una cuenta? 
            <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;