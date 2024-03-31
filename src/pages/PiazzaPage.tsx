// import { useState, useEffect } from "react"

// export default function PiazzaPage(){
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     // Load the Google API client library
//     const loadGapi = () => {
//       const script = document.createElement('script');
//       script.src = 'https://apis.google.com/js/api.js';
//       script.onload = () => {
//         window.gapi.load('client', () => {
//           initializeGapiClient();
//         });
//       };
//       document.body.appendChild(script);
//     };

//     // Load the Google Identity Services library
//     const loadGis = () => {
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.onload = gisLoaded;
//       document.body.appendChild(script);
//     };

//     loadGapi();
//     loadGis();
//   }, []);

//   const initializeGapiClient = async () => {
//     await window.gapi.client.init({
//       apiKey: 'AIzaSyDDeEBb4pmbeXWu7BKkfzsrKj7xlpD-Jno',
//       discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
//     });
//     maybeEnableButtons();
//   };

//   const gisLoaded = () => {
//     // Initialize your Google Identity Services client here
//     maybeEnableButtons();
//   };

//   const maybeEnableButtons = () => {
//     // Logic to enable buttons if both gapi and GIS are loaded
//     console.log("Token", window.gapi.client.getToken())
//     setIsAuthorized(window.gapi.client.getToken() !== null);
//   };

//   const handleAuthClick = () => {
//     // Initialize the token client if it hasn't been already initialized in gisLoaded
//     if (!window.tokenClient) {
//       window.tokenClient = window.google.accounts.oauth2.initTokenClient({
//         client_id: '642660880490-eofmqqgspbhulqckmbbplt9q97j69af6.apps.googleusercontent.com',
//         scope: 'https://www.googleapis.com/auth/gmail.readonly',
//         callback: '', // The callback will be set dynamically
//       });
//     }
  
//     window.tokenClient.callback = async (response) => {
//       if (response.error !== undefined) {
//         // Handle the error. For example, show an error message
//         console.error(response.error);
//         return;
//       }
//       // The user is successfully authorized; you can make API calls here.
//       setIsAuthorized(true);
//       listLabels(); // Assuming you have a function to list labels or perform other API calls
//     };
  
//     // Request an access token. The first time you call this, it will prompt the user for consent.
//     window.tokenClient.requestAccessToken({prompt: ''});
//   };

//   const handleSignoutClick = () => {
//     window.google.accounts.oauth2.revoke(window.gapi.client.getToken().access_token, () => {
//       window.gapi.client.setToken(null);
//       setIsAuthorized(false);
//       setContent('');
//     });
//   };

//   const listMessages = async () => {
//     let response;
//     try {
//       // response = await gapi.client.gmail.users.labels.list({
//       //   'userId': 'me',
//       // });
//       response = await window.gapi.client.gmail.users.messages.list({
//         'userId': 'me',
//       });
//     } catch (err) {
//       setContent(err.message)
//       return;
//     }

//     // const labels = response.result.labels;
//     const messages = response.result.messages;

//     const searchString = 'no-reply@piazza.com'
//     const filteredMessagePromises = messages.map(async (elem) => {
//       const indMessages = await window.gapi.client.gmail.users.messages.get({
//         'userId': 'me',
//         'id': elem.id, // This might need to be elem.id instead of messages[10].id
//       });
//       // console.log("INDMESSAGES", indMessages)
//       for (let header of indMessages.result.payload.headers) {
//         if (header.name === "From" && header.value.includes(searchString)) {
//           return indMessages.result; // Ensure you're returning the correct part of the response
//         }
//       }
//       return null; // Return null or similar if the condition is not met
//     });

//     // Wait for all promises to resolve
//     Promise.all(filteredMessagePromises).then((messages) => {
//       // Filter out nulls if some messages didn't match the criteria
//       const filteredMessages = messages.filter(msg => msg !== null);
//       console.log(filteredMessages);
//     });
//   };

//   // When authorization state changes, list labels if authorized
//   useEffect(() => {
//     if (isAuthorized) {
//       console.log("isAuhthorized", isAuthorized)
//       listMessages();
//     }
//   }, [isAuthorized]);

//   return (
//     <div>
//       <p>Gmail API Quickstart</p>
//       <button onClick={handleAuthClick} style={{ visibility: isAuthorized ? 'hidden' : 'visible' }}>
//         Authorize
//       </button>
//       <button onClick={handleSignoutClick} style={{ visibility: isAuthorized ? 'visible' : 'hidden' }}>
//         Sign Out
//       </button>
//       <pre style={{ whiteSpace: 'pre-wrap' }}>Hello</pre>
//     </div>
//   );
// };

export default function PiazzaPage(){
  const YOUR_FIREBASE_FUNCTION_URL = "http://127.0.0.1:5001/edusync-e6e17/us-central1/exchangeToken"
  const YOUR_CLIENT_ID = "642660880490-eofmqqgspbhulqckmbbplt9q97j69af6.apps.googleusercontent.com"
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUR_CLIENT_ID}&redirect_uri=${encodeURIComponent(YOUR_FIREBASE_FUNCTION_URL)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')}&access_type=offline&prompt=consent`;

  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return <button onClick={handleLogin}>Authorize</button>
}

