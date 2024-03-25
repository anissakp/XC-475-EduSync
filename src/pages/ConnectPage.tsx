import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { app } from "../firebase";
import Header from '../components/Header';
import connectBlob from "../assets/connectBlob.png"
import blackboardLogo from "../assets/blackboardLogo.png"

import SideMenu from "../components/SideMenu";
import ToDoList from "../components/ToDoList";

export default function ConnectPage() {
  const [htmlContent, setHtmlContent] = useState("");
  const[user, setUser] = useState(false);

  // ESTABLISHED CONNECTION WITH BB
  const handleConnectCLK = async () => {
    const bbConnectionURL = import.meta.env.VITE_BB_CONNECTION_URL;
    const result = await fetch(bbConnectionURL);
    const htmlContent = await result.text();
    console.log("html", htmlContent);
    setHtmlContent(htmlContent);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      console.log("home is this called");
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
        <img className="animate-wiggle1" src={connectBlob} alt="connectblob"/>
        <div className="absolute flex flex-col justify-center items-center w-full h-full">
          <div className="mt-[-250px] text-black text-[34px] font-normal font-['Quicksand'] tracking-tight pb-6">
            Sync To:
          </div>

          {(htmlContent && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )) || (
            <>
              
              <button className="bg-white flex items-center" onClick={handleConnectCLK}>
                <img src={blackboardLogo} alt="blackboardlogo" className="w-8 h-8 mr-[-4px]"/>
                Blackboard
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
