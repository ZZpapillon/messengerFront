import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Modal, Button, Image } from 'react-bootstrap';
import { AiOutlineLogout } from 'react-icons/ai'; // Import logout icon
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../apiService';
import AddFriendsModal from './addFriendsModal';

function VertNavbar() {
  const navigate = useNavigate();
 const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddFriendsModal, setShowAddFriendsModal] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '', // Example avatar URL
  });

  


  

const updateAvatarURL = async () => {
    try {
      const profileData = await getUserProfile();
      setUserInfo(profileData);
     
     
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };



















  const handleProfileUpdate = async (avatarFile) => {
    try {
      console.log('avatar file', avatarFile)
      const response = await updateUserProfile(avatarFile, userInfo.bio);

      // Fetch updated user profile data
      await updateAvatarURL();
      
      // Close the modal
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

 const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return; // If no file is selected, return early
  try {
    // Call handleProfileUpdate asynchronously and wait for it to complete
    await handleProfileUpdate(file);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

  
  const handleChangeBio = () => {
    setEditingBio(true);
  };

  const handleBioInputChange = (event) => {
    // Update the bio directly in the userInfo state
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      bio: event.target.value,
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleBioInputBlur();
    }
  };

  const handleBioInputBlur = async () => {
    setEditingBio(false);
    try {
      await handleProfileUpdate();
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  // Function to open the modal
  const handleOpenProfileModal = async () => {
    try {
      // Fetch user profile by passing the userId
      const profileData = await getUserProfile();
      setUserInfo(profileData); // Update state with fetched profile data
      setShowProfileModal(true); // Open the modal
      console.log(profileData,userInfo)
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to close the profile modal
  const handleCloseProfileModal = () => setShowProfileModal(false);

  // Function to open the add friends modal
  const handleOpenAddFriendsModal = () => setShowAddFriendsModal(true);

  // Function to close the add friends modal
  const handleCloseAddFriendsModal = () => setShowAddFriendsModal(false);


  const handleLogout = () => {
    // Clear the token from local storage (or cookies)
    localStorage.removeItem('token');
    // Redirect the user to the login page
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md" className="flex-column row-height">
        <Navbar.Brand className='mt-3 brand' ><Image src='/logo.png'  className='rotating-image' roundedCircle style={{height: '6vh', width: '3vw', background: 'transparent'}} /></Navbar.Brand>
        <Navbar.Brand className='brand'>Messenger</Navbar.Brand>
        
        
          <Nav className="flex-column mb-auto  ">
          
            <Nav.Link className='text-white nav-link' onClick={handleOpenProfileModal}>Profile</Nav.Link>
            <Nav.Link className='text-white nav-link' onClick={handleOpenAddFriendsModal}>Add Friends</Nav.Link>
            
            
            {/* Log Out link */}
            <Nav.Link className="logout text-white" onClick={handleLogout}>
              <AiOutlineLogout /> Log Out
            </Nav.Link>
             <Nav.Link className='text-white zdes' >@Zdeslav Zaksek</Nav.Link>
          </Nav>
       
      </Navbar>

      <Modal show={showProfileModal} onHide={handleCloseProfileModal}>
        <Modal.Header className="custom-modal-header">
          <Modal.Title className="custom-modal-title">Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body custom-modal-content">
          <div className="custom-user-info">
            {/* Image button to change user avatar */}
            <label htmlFor="avatar-upload" className="custom-avatar-label">
              
  <Image
    src={"https://messengernode.onrender.com/" + userInfo.avatar}
    alt="User Avatar"
    className="custom-user-image"
    roundedCircle
  />

              <input
                id="avatar-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </label>
            <h5>
              {userInfo.firstName} {userInfo.lastName}
            </h5>
            {/* Button to change user bio */}
            <p>About me:</p>
            {editingBio ? (
              <input
                type="text"
                value={userInfo.bio}
                onChange={handleBioInputChange}
                onBlur={handleBioInputBlur}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              <p onClick={handleChangeBio}>{userInfo.bio}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="secondary" onClick={handleCloseProfileModal} className="custom-close-button">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

           <AddFriendsModal show={showAddFriendsModal} handleClose={handleCloseAddFriendsModal} />



    </>
  );
}

export default VertNavbar;
