import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
const baseURL = 'https://messengernode.onrender.com/api'; // Replace with your backend URL


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${baseURL}/register`, userData);
        const { token } = response.data; // Extract the token from the response
        localStorage.setItem('token', token); // Store the token in local storage
        return token; // Return the token

    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${baseURL}/login`, userData);
        const { token } = response.data; 
        localStorage.setItem('token', token); // Store the token in local storage
        return token; // Return the token
    } catch (error) {
        throw error.response.data
    }
}

export const getAllUserProfiles = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.get(`${baseURL}/user-profiles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the list of user profiles
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        
        // Decode the token to extract userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; // Assuming the token contains the userId
        
        const response = await axios.get(`${baseURL}/user-profiles/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data; // Return the user profile data
    } catch (error) {
        throw error.response ? error.response.data : error.message; // Throw error if request fails
    }
};






export const updateUserProfile = async (avatarFile, bio) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    // Decode the token to extract userId
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    
    // Create FormData object and append the avatar file
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    // Append the bio to the FormData
    formData.append('bio', bio);

    // Make the PUT request to update the user profile
    const response = await axios.put(
      `${baseURL}/user-profiles/${userId}`,
      formData, // Pass the FormData object directly
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Ensure correct content type for FormData
        }
      }
    );
    
    return response.data; // Return the user profile data
  } catch (error) {
    throw error.response.data; // Throw error if request fails
  }
};






export const createUserProfile = async (userProfileData) => {
    try {
        
        const response = await axios.post(`${baseURL}/user-profiles/`, userProfileData);
        return response.data; // Return the user profile data
    } catch (error) {
        throw error.response.data; // Throw error if request fails
    }
};




export const addFriend = async (friendId) => {
  try {
     const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        
        // Decode the token to extract userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; // Assuming the token contains the userId

    const response = await axios.post(`${baseURL}/friends/add`,  { userId, friendId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    return response.data; // Assuming the response contains the added friendship data
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};


export const getAllFriends = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
     // Decode the token to extract userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; // Assuming the token contains the userId

    const response = await axios.get(`${baseURL}/friends/${userId}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.friends; // Assuming the response contains the list of friends
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};



export const createMessage = async (senderId, recipientId, content) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
     
    const response = await axios.post(`${baseURL}/messages`, {
      senderId,
      recipientId,
      content
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the newly created message
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};




export const getAllMessagesBetweenUsers = async (userId1, userId2) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
   
    
    const response = await axios.get(`${baseURL}/messages/${userId1}/${userId2}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the list of messages
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};