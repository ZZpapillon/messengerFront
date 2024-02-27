import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { getAllFriends, getUserProfile, getAllMessagesBetweenUsers } from '../apiService';
import '../Conversations.css';

function ConversationLayout({ onSelectFriend }) {
  const [friends, setFriends] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const sender = await getUserProfile();
        const loggedInUserId = sender._id;
        const friendsData = await getAllFriends();

        const friendsWithMessages = await Promise.all(
          friendsData.map(async (friend) => {
            const messages = await getAllMessagesBetweenUsers(loggedInUserId, friend._id);
            const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
            const lastMessageTime = messages.length > 0 ? messages[messages.length - 1].createdAt : '';
            return {
              ...friend,
              lastMessage,
              lastMessageTime
            };
          })
        );

        // Sort the friends based on lastMessageTime
        const sortedFriends = friendsWithMessages.sort((a, b) => {
          if (a.lastMessageTime && b.lastMessageTime) {
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
          } else if (a.lastMessageTime && !b.lastMessageTime) {
            return -1;
          } else if (!a.lastMessageTime && b.lastMessageTime) {
            return 1;
          } else {
            return 0;
          }
        });

        setFriends(sortedFriends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUserInfo(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleItemClick = (index) => {
    setSelectedMessage(index);
  };

  useEffect(() => {
    if (selectedMessage !== null) {
      onSelectFriend(friends[selectedMessage]);
    }
  }, [selectedMessage, onSelectFriend, friends]);

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

  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Row className="usernameHeader">
        <Col xs={1}>
          <Image src={userInfo ? "https://messengernode.onrender.com/" + userInfo.avatar : "/placeholderImage.png"} roundedCircle style={{ width: '40px', height: '40px' }} />
        </Col>
        <Col className='ms-3 mt-1'>
          <h4>{userInfo && userInfo.firstName}'s Messages</h4>
        </Col>
      </Row>

      <Row className="conversations">
        {friends.map((friend, index) => (
          <Container key={index} className={"message-item text-white" + (selectedMessage === index ? " selected" : "")} onClick={() => handleItemClick(index)}>
            <Row>
              <Col xs={1}>
                <Image src={"https://messengernode.onrender.com/" + friend.avatar} roundedCircle style={{ width: '60px', height: '60px' }} />
              </Col>
              <Col>
                <h3 className='ms-5'>{friend.firstName} {friend.lastName}</h3>
                <Row className='ms-5 text-truncate'>{friend.lastMessage ? friend.lastMessage : `Chat with ${friend.firstName}`}</Row>
              </Col>
              <Col xs={2} className="text-right">
                {friend.lastMessageTime && formatTimestamp(friend.lastMessageTime)}
              </Col>
            </Row>
          </Container>
        ))}
      </Row>
    </Container>
  );
}

export default ConversationLayout;
