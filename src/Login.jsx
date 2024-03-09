import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Login.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, createUserProfile } from './apiService';
import CustomSpinner from './CustomSpinner';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const toggleForms = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignUpForm(!showSignUpForm);
  };

  const handleDemoLogin = async () => {
  setIsLoading(true); // Set loading state to true
  try {
    // Perform login using demo account credentials
    const token = await loginUser({ email: 'er@gmail.com', password: '1' });
    console.log('Demo login successful! Token:', token);
    navigate('/app');
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false); // Set loading state back to false
  }
};

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const token = await registerUser({ email, password, firstName, lastName });
      console.log('Registration successful! Token:', token);

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const userProfileData = {
        userId,
        firstName,
        lastName,
         avatar: 'https://res.cloudinary.com/duvnbonci/image/upload/messenger/qlvebe3n99mxfrsbyczf',
        bio: 'Change bio clicking on it!',
      };

      await createUserProfile(userProfileData);
      navigate('/app');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const token = await loginUser({ email, password });
      console.log('Login successful! Token:', token);
      navigate('/app');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };












  return (
    <Container fluid className="login-container">
       {isLoading && <CustomSpinner />} {/* Render spinner if loading */}
      {!isLoading && ( // Render form if not loading
      <Row className="justify-content-center align-items-center h-100">
        <Col md={6}>
          <div className="text-center mb-4">
            <h1 className='text-white hjedan'>Welcome to Messenger App</h1>
          </div>
          <div className="form-container">
            {showLoginForm && (
              <div className="form-wrapper">
                <h2>Login</h2>
                <Form className='text-white' onSubmit={handleSubmitSignIn}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                     <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className='mt-2'>Password</Form.Label>
                   <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>

                  <Button className='mt-3' variant="primary" type="submit">
                    Sign In
                  </Button>
                   {error && <div className="error mt-4">{error}</div>}
                </Form>
              </div>
            )}

            {showSignUpForm && (
              <div className="form-wrapper">
                <h2>Sign Up</h2>
                <Form className='text-white' onSubmit={handleSubmitSignUp}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                  </Form.Group>

                  <Form.Group controlId="formBasicFirstName">
                    <Form.Label className='mt-2'>First Name</Form.Label>
                    <Form.Control required type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicLastName">
                    <Form.Label className='mt-2'>Last Name</Form.Label>
                    <Form.Control  required type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className='mt-2'>Password</Form.Label>
                    <Form.Control  required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>

                  <Button className='mt-3' variant="primary" type="submit">
                    Sign Up
                  </Button>
                </Form>
              </div>
            )}
          </div>
        <p className="mt-3 questions">
  {showLoginForm ? (
    <>
      New? Create an account{' '}
      <span onClick={toggleForms} className="link">
         Create an account
      </span>
      <br />
      <Button variant='danger' onClick={handleDemoLogin} className="demoButton mt-2">Try Demo account</Button>
    </>
  ) : (
    <>
      Already have an account?{' '}
      <span onClick={toggleForms} className="link">
        Login here
      </span>
    </>
  )}
</p>
        </Col>
      </Row>
      )}
    </Container>
  );
}

export default App;
