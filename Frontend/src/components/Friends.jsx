
import React, { useState, useEffect } from 'react';
import { baseUrl } from '../url';
import {User} from "lucide-react";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState('');
  

  const Profile = async (userid) => {
    try {
      const response = await fetch(`${baseUrl}/profileid?userId=${userid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Profile:', error);
      return null;
    }
  };

  useEffect(() => {
    if (localStorage.getItem('success')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user.email);
    }
  }, []);

  useEffect(() => {
    const Profile = async () => {
      if (!user) return; // If user is not set, return early
      try {
        const response = await fetch(`${baseUrl}/profile?email=${user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }

         const data = await response.json();
        console.log(data);

        setFriends(data.user.following);
        console.log(data.user.following);
  
      } catch (error) {
        //setError(error.message);
       // console.error('Profile:', error);
      } 
    };

    Profile();
  }, [user]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const fetchedProfiles = await Promise.all(friends.map((userid) => Profile(userid)));
      setProfiles(fetchedProfiles.filter((profile) => profile !== null));
    };

    if (friends.length > 0) {
      fetchProfiles();
    }
  }, [friends]);


  //console.log(profiles);
 

  return (
    <div>

    

    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Friends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 bg-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
        {profiles.map((profile, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="mr-4">{<User/>}</div>
            <p className="text-gray-700 font-medium mt-1 text-shadow hover:text-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102">{profile.user.first_name} {profile.user.last_name}</p>
            <p className="text-gray-700 font-medium mt-1 text-shadow hover:text-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102">@{profile.user.userhandle}</p>
            <p className="text-gray-700 font-medium mt-1 text-shadow hover:text-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102">{profile.user.college}</p>
          
          </div>
        ))}
      </div>
    </div>



    </div>

  );
};

export default Friends;