import { useState, useEffect } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import { getAllUserProfiles, addFriend , getUserProfile, getAllFriends} from '../apiService';

function AddFriendsModal({ show, handleClose }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
   const [forceUpdate, setForceUpdate] = useState(false); 

  useEffect(() => {

   



    // Fetch all users when the modal is shown
    const fetchUsers = async () => {
      try {
         const loggedInUser = await getUserProfile();
            const loggedInUserId = loggedInUser._id;
            
            // Fetch IDs of existing friends
            const existingFriends = await getAllFriends();
            const existingFriendsIds = existingFriends.map(friend => friend._id);
            
            const usersData = await getAllUserProfiles();
            
            // Filter out logged-in user and existing friends
            const filteredData = usersData.filter(user => user._id !== loggedInUserId && !existingFriendsIds.includes(user._id));
            
            setUsers(filteredData);
            setFilteredUsers(filteredData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (show) {
      fetchUsers();
    }
  }, [show, forceUpdate]);

  useEffect(() => {
    // Filter users based on the search term
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleAddFriend = async (friendId) => {
  try {
    await addFriend(friendId); // Add the friend
    console.log('Friend added successfully');
    handleClose(); // Close the modal after adding friend
    setForceUpdate(prevState => !prevState); // Toggle forceUpdate state
    console.log('Force update toggled');
  } catch (error) {
    console.error('Error adding friend:', error);
  }
};


  return (
    <Modal show={show} onHide={handleClose} className="custom-modal custom-modal-friends">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="custom-modal-title">Add Friends</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body custom-modal-content custom-body-friends">
        <FormControl
          type="text"
          placeholder="Search for friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{  border: '1px solid red' }}
        />
        <ul className="list-unstyled">
          {filteredUsers.map(user => (
            <li key={user._id} className="m-3 custom-list-item">
             <h5> {user.firstName} {user.lastName} </h5>
              <Button  variant="danger" onClick={() => handleAddFriend(user._id)}>
                Add
              </Button>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button variant="secondary" onClick={handleClose} className="custom-close-button">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddFriendsModal;
