import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { app, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SideMenu from "../components/SideMenu";
import ToDoList from "../components/ToDoList";

export default function HomePage() {
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
    const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
      console.log(user);
      // redirect to login page if not already logged in
      if (!user) {
        navigate("/login");
      }
      else {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(userRef);
          // if userID isn't in database already, we add a new user document
          if (!docSnapshot.exists()) {
            await setDoc(userRef, {
              email: user.email, 
              name: user.displayName || "-",
            });
            setUser(!!user);
          }
        } catch (error) {
          console.error("Error adding user to Firestore", error);
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [navigate, user, setUser]);

  function handleClickSignOut() {
    const auth = getAuth(app);
    auth.signOut();
  }
  console.log(user);
    return (
    <>
      <div>
        {(htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )) || (
          <>
            <h1>Home</h1>
            <button onClick={handleConnectCLK}>Connect with Blackboard</button>
  
          </>
        )}
      </div>
      <button onClick={handleClickSignOut}>Sign out</button>
    </>
  );
}
