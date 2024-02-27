import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import './App.css'
import  VertNavbar from './assets/navbarLayout'
import { jwtDecode } from "jwt-decode";
import ConversationLayout from './assets/convLayout';
import MessageLayout from './assets/messageLayout';
import { useNavigate, } from 'react-router-dom';
import { getUserProfile } from './apiService';

function App() {

  const navigate = useNavigate();
const [username, setUsername] = useState('');
 const [selectedFriend, setSelectedFriend] = useState(null);
  


  

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    console.log('Selected Friend:', friend);
    // Perform any other actions you need with the selected friend object
  };

 
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if token is not found
    navigate('/');
  } else {
    try {
      // Decode token to access user information
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      setUsername(decodedToken.username);
      console.log(decodedToken.username);
    } catch (error) {
      // Handle invalid token (e.g., redirect to login)
      console.error('Invalid token:', error);
      navigate('/');
    }
  }
}, [navigate]);




  return (
    <Container fluid className="app-container">
      <Row className="row-height">
        <Col xs={1} className="p-0">
          <VertNavbar  />
        </Col>
        <Col xs={3} className="p-0" style={{ backgroundColor: '#09090b'}}>
        <ConversationLayout onSelectFriend={handleSelectFriend}   />
        </Col>
          <Col xs={8} className="p-0" >
           {selectedFriend && <MessageLayout selectedFriend={selectedFriend}  />}
        </Col>
      </Row>
    </Container>
  )
}

export default App
