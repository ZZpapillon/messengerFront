import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Button, Form, Modal } from 'react-bootstrap';
import { BiSend } from 'react-icons/bi';
import { createMessage, getUserProfile, getAllMessagesBetweenUsers } from '../apiService';
import '../Messages.css'




function MessageLayout({selectedFriend}) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
   const [senderId, setSenderId] = useState(null);
  const containerRef = useRef(null);



 const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);




const fetchMessages = async () => {
    try {
      const sender = await getUserProfile();
      const id = sender._id;
     setSenderId(id)
       const recipientId = selectedFriend._id;
        const messagesData = await getAllMessagesBetweenUsers(id, recipientId);
      setMessages(messagesData);
      console.log('Messeges data;', messages)
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedFriend]);


  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      // Message was created today, display only the hour and minutes
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`; // Format as desired
    } else {
      // Message was not created today, display full date
      return messageDate.toLocaleString(); // Format as desired
    }
};

  const handleSendClick = async () => {
    try {
    const sender = await getUserProfile()
    const senderId = sender._id





      // Call createMessage function with the message content
      const recipientId = selectedFriend._id;
      await createMessage(senderId, recipientId, messageContent);
      // Clear the message input after sending
      setMessageContent('');
        fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error appropriately
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleShowProfileModal = () => {
    setShowProfileModal(true);
  };
  return (
   <Container style={{ maxHeight: '100vh', padding: 0}}>
   
   <Row className="friendHeader text-white p-1 align-items-center" style={{ height: '6vh', padding: 0}}  onClick={handleShowProfileModal} >
      <Col  className="ms-0" xs={1} >
        <Image src={selectedFriend.avatar} roundedCircle style={{ width: '50px', height: '50px', padding: "0" }} />
      </Col>
      <Col>
        <h2>{selectedFriend.firstName} {selectedFriend.lastName} </h2>
      </Col>
    </Row>

    <Modal show={showProfileModal} onHide={handleCloseProfileModal} className="custom-modal friends-modal modal-xl" >
  <Modal.Header closeButton className="custom-modal-header">
    <Modal.Title className="custom-modal-title">{selectedFriend.firstName}'s Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body className="custom-modal-body custom-modal-content">
    <div className="custom-user-info">
      <Image src={selectedFriend.avatar} alt="User Avatar" className="custom-user-image" roundedCircle />
      <h5>
        {selectedFriend.firstName} {selectedFriend.lastName}
      </h5>
      <p>About me:</p>
      <p>{selectedFriend.bio}</p>
    </div>
  </Modal.Body>
  <Modal.Footer className="custom-modal-footer">
    <Button variant="secondary" onClick={handleCloseProfileModal} className="custom-close-button">
      Close
    </Button>
  </Modal.Footer>
</Modal>

        
<Container ref={containerRef} className="messagesContainer p-3" style={{ height: '87vh', padding: 0, overflow: 'auto' }}>
{messages.map((message) => (
   <div key={message._id} className={message.senderId === senderId ? "messageRow" : "receivedMessageRow"}>
      <Row>
         <Col>
            <div className="messageBubble">
               {message.content}
               <small className="timestamp">{formatTimestamp(message.createdAt)}</small>
            </div>
         </Col>
      </Row>
   </div>
))}
</Container>
          
       

     <Row className="inputMessage p-3" style={{ height: '7vh' }}>
        <Form.Control
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
          type="text"
          placeholder="Type your message..."
          className="custom-input bg-dark text-light fs-6 w-85 h-100 ms-2"
          style={{ width: '84%', border: 'none' }}
        />
        <Button
          onClick={handleSendClick}
          variant="primary"
          type="submit"
          className="bg-dark border-0 p-0 ms-3"
          style={{ width: '10%' }}
        >
          <BiSend className="text-light" style={{ fontSize: '1.5rem' }} />
        </Button>
      </Row>
   </Container>
  );
}

export default MessageLayout