import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { app } from "../firebase";
import {  getDoc } from "firebase/firestore";

import Header from '../components/Header';
import connectBlob from "../assets/connectBlob.png"
import blackboardLogo from "../assets/blackboardLogo.png"
import piazzaLogo from "../assets/piazzaLogo.png"
import gradescopeLogo from "../assets/gradescopeLogo.png"
import connectBlueBlob from "../assets/connectBlueBlob.png"
import connectOrangeBlob from "../assets/connectOrangeBlob.png"

import FormDialog from "../components/FormDialog";
import CircularIndeterminate from "../components/CircularIndeterminate";
import Checkbox from '@mui/material/Checkbox';


import SideMenu from "../components/SideMenu";
import ToDoList from "../components/ToDoList";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


export default function ConnectPage() {
  const [htmlContent, setHtmlContent] = useState("");
  const[user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blackboardStatus, setBlackboardStatus] = useState(false)
  const [gradeScopeStatus, setGradeScopeStatus] = useState(false)
  const [piazzaStatus, setPiazzaStatus] = useState(false)


  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


  // ESTABLISHED CONNECTION WITH BB
const handleConnectCLK = async () => {
  const bbConnectionURL = import.meta.env.VITE_BB_CONNECTION_URL;
  try {
    const result = await fetch(bbConnectionURL);
    const htmlContent = await result.text();
    if (htmlContent) { 
      console.log("html", htmlContent);
      setHtmlContent(htmlContent);
      // set a flag in our database that the user should recieve updated api call blackboard assignments
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid); 
        await setDoc(userRef, { blackboardConnected: true, statusBB:true }, { merge: true });
      }
    }
  } catch (error) {
    console.error("Error connecting to Blackboard:", error);
  }
};

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      // redirect to login page if not already logged in
      if (!user) {
        setLoading(false);
        navigate("/login");
      }
      setUser(!!user);
    });
    
    return () => {
      unsubscribe();
    };
  }, [user, setUser, navigate]);

  useEffect(() => {
    const checkStatus = async () => {
      console.log("CALLED STATUS")
      const auth = getAuth(app);
      onAuthStateChanged(auth, async (user: any) => {
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log("DAT", data)

        if (data && data.statusBB) setBlackboardStatus(true)
        if (data && data.statusGS) setGradeScopeStatus(true)
        if (data && data.gmailApiRefreshToken) setPiazzaStatus(true)
      });
    };
    checkStatus();
  }, []);

  function handleClickSignOut() {
    const auth = getAuth(app);
    auth.signOut();
  }

  return (
    <>
      <div>
        {/* header component */}
        <Header buttonText="HOME" buttonLink="/"/>
  
        <div className="relative mx-auto flex justify-center">
          
          {/* Background blobs */}
          <img src={connectBlueBlob} alt="connectBlueBlob" className="absolute -z-10 top-[-125px] left-[225px]"/>
          <img src={connectOrangeBlob} alt="connectOrangeBlob" className="absolute -z-10 bottom-[-200px] right-10"/>
  
          {/* Main blob with animation */}
          <img className="animate-wiggle1 z-0" src={connectBlob} alt="connectblob"/>
  
          <div className="absolute flex flex-col justify-center items-center w-full h-full">
            <div className="mt-[-125px] text-black text-[34px] font-normal font-['Quicksand'] tracking-tight pb-6">
              Sync To:
            </div>
  
            {(htmlContent && (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )) || (
              <>
                {/* connect to Gradescope button */}
                {loading ? <CircularIndeterminate/> : <FormDialog setLoading={setLoading} gradeScopeStatus={gradeScopeStatus}/> }
  
                {/* connect to BlackBoard button */}
                <button className="mt-5 bg-white flex items-center text-[20px]" onClick={handleConnectCLK}>
                  <img src={blackboardLogo} alt="blackboardlogo" className="w-8 h-8 mr-[-4px]"/>
                  Blackboard
                  {blackboardStatus && <Checkbox {...label} defaultChecked color="success" />}
                </button>
  
                {/* connect to Piazza button -- NEED TO ADD ONCLICK */}
                <button className="mt-5 bg-white flex items-center text-[20px]">
                  <img src={piazzaLogo} alt="PiazzaLogo" className="w-6 h-6 mr-[1px]"/>
                  Piazza
                  {piazzaStatus && <Checkbox {...label} defaultChecked color="success" />}
                </button>

                <button className="mt-5 bg-white text-[15px]" onClick={()=>navigate("/dashboard")}>
                  Connect Later
                </button>
              </>
            )}
          </div>
        </div>
  
        {/* <button onClick={handleClickSignOut}>Sign out</button> */}
      </div>
    </>
  );
}
