"use client";  // This tells Next.js that this is a client component

import { useState, useEffect } from 'react';

function OuraRingOAuth() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Get the authorization code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // If we have a code, make the API request
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${code}`);

      fetch("https://api.ouraring.com/v2/usercollection/personal_info", {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      })
        .then((response) => response.json())
        .then((result) => {
          console.log('Personal Info:', result);
          // TODO: Handle the personal info data here
        })
        .catch((error) => {
          console.error('Error fetching personal info:', error);
        });
    }
  }, []); // Empty dependency array means this runs once when component mounts

  const handleSubmit = () => {
    const clientId = 'EXN4DFJR4C2IG74E';
    const redirectUri = encodeURIComponent('http://localhost:3000');
    const scope = 'email personal daily';
    const state = 'unique_state_value'; 

    const authUrl = `https://cloud.ouraring.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Oura Data Auto Upload (suggested method)</h2>
      <p className="mb-4 text-gray-600">To connect your Oura Ring account and auto upload your data, click the button below to authorize access to just the items you want to share.</p>
      <button 
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Connect Oura Ring
      </button>
    </div>
  );
}

export default OuraRingOAuth;
