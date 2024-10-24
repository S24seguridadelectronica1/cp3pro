import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import supabase from './supabase/supabaseClient';
import './Register.css'; // Importa el archivo CSS

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    "ciudad y barrio": '', // Ajustado para reflejar el nombre exacto
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    const { nombre, telefono, direccion, "ciudad y barrio": ciudadYbarrio } = formData;

    // Validación de campos
    if (!nombre || !telefono || !direccion || !ciudadYbarrio) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (telefono.length < 10) {
      setError('El teléfono debe tener al menos 10 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Insertar datos en la tabla "cp3pro"
      const { error: dbError } = await supabase
        .from('cp3pro')
        .insert([{ nombre, telefono, direccion, "ciudad y barrio": ciudadYbarrio }]);

      if (dbError) {
        console.error('Error al guardar los datos:', dbError);
        setError(`Error al guardar los datos: ${dbError.message}`);
        return;
      }

      setSuccessMessage('¡Compra exitosa! Haremos llegar la cámara a la puerta de tu casa.');
      setFormData({ nombre: '', telefono: '', direccion: '', "ciudad y barrio": '' });

      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate('/login'); // Cambia esto a donde desees redirigir
      }, 2000);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setError('Ha ocurrido un error, por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="my-5" style={{ maxWidth: '90vw' }}>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4 display-4">Registrarse</h2>
          <p className="text-center mb-4 fs-5">Completa el formulario para crear una cuenta.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit} className="bg-light p-5 rounded shadow-sm">
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label className="fs-5">Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ingresa tu nombre"
                className="fs-5"
              />
            </Form.Group>
            <Form.Group controlId="telefono" className="mb-3">
              <Form.Label className="fs-5">Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="Ingresa tu número de teléfono"
                className="fs-5"
              />
            </Form.Group>
            <Form.Group controlId="direccion" className="mb-3">
              <Form.Label className="fs-5">Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                placeholder="Ingresa tu dirección"
                className="fs-5"
              />
            </Form.Group>
            <Form.Group controlId="ciudadYbarrio" className="mb-3">
              <Form.Label className="fs-5">Ciudad y Barrio</Form.Label>
              <Form.Control
                type="text"
                name="ciudad y barrio" // Ajustado para reflejar el nombre exacto
                value={formData["ciudad y barrio"]} // Ajustado
                onChange={handleChange}
                required
                placeholder="Ingresa tu ciudad y barrio"
                className="fs-5"
              />
            </Form.Group>
            <Button
              type="submit"
              disabled={loading}
              className="w-100 btn-lg fs-5"
              variant="primary"
            >
              {loading ? 'Registrando...' : 'comprar'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
