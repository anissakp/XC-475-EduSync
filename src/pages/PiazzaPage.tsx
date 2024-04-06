import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function PiazzaPage(){
  const [userID, setUserID] = useState("")
  const [authorized, setAuthorized] = useState(false)
  const [piazzaData, setPiazzaData] = useState([])
  const auth = getAuth(app);

  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
          setUserID(user.uid);
          const docRef = doc(db, `users/${user.uid}`);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data()

          // If Access Token Doesn't Exist => Need to Authorize => Display Authorize Button
          if (!data.gmailApiAccessToken) setAuthorized(true)
          else {
            const date = new Date(data.gmailApiAccessTokenExpiration.seconds * 1000 + data.gmailApiAccessTokenExpiration.nanoseconds / 1000000);
            if (data.gmailApiAccessToken && date > new Date()){
              //THIS MEANS ACCESS TOKEN AVAILABLE AND NOT EXPIRED THEN FETCH ANNOUNCEMTNS
              connectPiazza(user.uid)
              
            }else{
              // USE REFRESH TOKEN 
              getPiazzaNewToken(user.uid)
              connectPiazza(user.uid)
            }
          }
      });
    };
    fetchData();
  }, []);


  const state = JSON.stringify({userID: userID});
  const encodedState = encodeURIComponent(state);
  
  const YOUR_FIREBASE_FUNCTION_URL = `http://127.0.0.1:5001/edusync-e6e17/us-central1/exchangeToken`
  const YOUR_CLIENT_ID = "642660880490-eofmqqgspbhulqckmbbplt9q97j69af6.apps.googleusercontent.com"
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUR_CLIENT_ID}&redirect_uri=${encodeURIComponent(YOUR_FIREBASE_FUNCTION_URL)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')}&access_type=offline&prompt=consent&state=${encodedState}`;

  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  const connectPiazza = async (userId) => {
    const result = await fetch(`http://127.0.0.1:5001/edusync-e6e17/us-central1/getPiazzaAnnouncements?userID=${userId}`);
    const data = await result.json()
    setPiazzaData(data)
    console.log("PIZAAPAGE", data)
  }

  const getPiazzaNewToken = async (userId) => {
    const result = await fetch(`http://127.0.0.1:5001/edusync-e6e17/us-central1/getPiazzaNewAccessToken?userID=${userId}`);
    const data = await result.json()
    console.log("getpiazza new", data)
  }

  const display = piazzaData.map((elem)=>{
    let encoded_text_plain = elem.payload.parts[0].parts[0].body.data
    encoded_text_plain = encoded_text_plain.replace(/-/g, '+').replace(/_/g, '/');
    encoded_text_plain += '='.repeat((4 - encoded_text_plain.length % 4) % 4);
    let decoded_text_plain = atob(encoded_text_plain);
  
    const arr = decoded_text_plain.split(" ")
    if (arr[0] === "Instructor"){
      return (
        <div className="border border-black rounded-xl p-5">
          <div>{elem.payload.headers[33].value.split("on Piazza")[0]}</div>
          <div>{decoded_text_plain.split("Go to https://piazza")[0]}</div>
        </div>
      )
    }
  })

  return (
  <div>
    <h2 className="text-5xl text-center mb-10 mt-5">Piazza Instructor Announcements</h2>
    <div className="flex justify-center gap-6 mb-10">
      {authorized && <button onClick={handleLogin}>Authorize</button>}
      {/* <button onClick={connectPiazza}>Connect Piazza</button> */}
    </div>
    <div className="flex flex-col gap-9 px-9">{display}</div>
  </div>)
}




