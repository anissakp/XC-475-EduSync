import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { app } from "../firebase";
import Header from '../components/Header';
import connectBlob from "../assets/connectBlob.png"
import blackboardLogo from "../assets/blackboardLogo.png"
import piazzaLogo from "../assets/piazzaLogo.png"
import gradescopeLogo from "../assets/gradescopeLogo.png"
import connectBlueBlob from "../assets/connectBlueBlob.png"
import connectOrangeBlob from "../assets/connectOrangeBlob.png"


import SideMenu from "../components/SideMenu";
import ToDoList from "../components/ToDoList";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


export default function ConnectPage() {
  const [htmlContent, setHtmlContent] = useState("");
  const[user, setUser] = useState(false);

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
        await setDoc(userRef, { blackboardConnected: true }, { merge: true });
      }
    }
  } catch (error) {
    console.error("Error connecting to Blackboard:", error);
  }
};

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      console.log(user);
      // redirect to login page if not already logged in
      if (!user) {
        navigate("/login");
      }
      setUser(!!user);
    });
    
    return () => {
      unsubscribe();
    };
  }, [user, setUser, navigate]);

  function handleClickSignOut() {
    const auth = getAuth(app);
    auth.signOut();
  }
  console.log(user);

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
                {/* connect to Gradescope button -- NEED TO ADD ONCLICK */}
                <button className="bg-white flex items-center text-[20px]">
                  <img src={gradescopeLogo} alt="GradescopeLogo" className="w-8 h-8 mr-[1px]"/>
                  Gradescope
                </button>
  
                {/* connect to BlackBoard button */}
                <button className="mt-5 bg-white flex items-center text-[20px]" onClick={handleConnectCLK}>
                  <img src={blackboardLogo} alt="blackboardlogo" className="w-8 h-8 mr-[-4px]"/>
                  Blackboard
                </button>
  
                {/* connect to Piazza button -- NEED TO ADD ONCLICK */}
                <button className="mt-5 bg-white flex items-center text-[20px]">
                  <img src={piazzaLogo} alt="PiazzaLogo" className="w-6 h-6 mr-[1px]"/>
                  Piazza
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
