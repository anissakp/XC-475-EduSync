import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/authContext";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { app, db } from "./firebase";

import DashboardPage from "./pages/DashboardPage";
import ConnectPage from "./pages/ConnectPage";
import AuthorizedPage from "./pages/AuthorizedPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import PiazzaPage from "./pages/PiazzaPage";
import CoursesPage from "./pages/CoursesPage";
import SyllabusUploadPage from "./pages/SyllabusUploadPage"
import TasksPage from "./pages/TasksPage";

import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";
import NotesPage from "./pages/NotesPage";
import AboutUs from "./pages/AboutUs"

import { debounce } from 'lodash';


function App() {
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");
  const auth = getAuth(app);

  // FUNCTION TO SET VALUES IN LOCAL STORAGE
  const setStorageValue = (userID: string, aToken: string) => {
    //Sets New Access Token Onto Local Storage
    localStorage.setItem(
      "data",
      JSON.stringify({
        userID: userID,
        token: aToken,
        // expiresAt: new Date(new Date().getTime() + 60000).toISOString(), // 1min
        expiresAt: new Date(new Date().getTime() + 7200000).toISOString(), // 2hours
      })
    );
  };

  // FUNCTION TO UPDATE REFRESH TOKEN IN DATABASE
  const updateRefreshToken = async (rToken: string) => {
    const firebaseAuth = getAuth();
    const firebaseAuthUser = firebaseAuth.currentUser;
    if (firebaseAuthUser) {
      //refresh token stored in DB [ only happens when no token in local storage ] 
      const userDocRef = doc(db, 'users', firebaseAuthUser.uid);
      // assignment document saved in user's assignments subcollection
      await setDoc(userDocRef, { refreshToken: rToken }, { merge: true });
    }
  }

  const getToken = async () => {
    try {
      // Retrieve refresh token from database
      onAuthStateChanged(auth, async (user: any) => {
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        // If refresh token exists 
        if (data && data.refreshToken) {
          // Get new access token based on refresh token
          const bbRefreshTokenURL = import.meta.env.VITE_BB_REFRESH_TOKEN_URL;

          const response = await fetch(
            `${bbRefreshTokenURL}?refreshToken=${data.refreshToken}`
          );

          const data2 = await response.json();

          setToken(data2.access_token);
          setUserID(data2.user_id);

          setStorageValue(data2.user_id, data2.access_token)

          // store refresh token in the database
          updateRefreshToken(data2.refresh_token)
        }
        else {
          // Else initial access token retrieval when BB connection established
          console.log("GETTING INITIAL TOKEN")

          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");
          const bbTokenURL = import.meta.env.VITE_BB_TOKEN_URL;

          const response = await fetch(`${bbTokenURL}?code=${code}`);

          const data = await response.json();

          setToken(data.access_token);
          setUserID(data.user_id);

          setStorageValue(data.user_id, data.access_token);

          // store refresh token in the database
          updateRefreshToken(data.refresh_token)
        }
      });
    } catch (error) {
      console.log("Inside GET TOKEN ERROR: ", error);
    }
  }

  // TO PREVENT GETTOKEN FROM BEING CALLED BACK TO BACK IMMEDIATELY
  const debouncedGetToken = debounce(getToken, 500);

  // CHECK IF USERS HAS TOKEN ON INITIAL RENDER
  useEffect(() => {
    const data = localStorage.getItem("data")!;
    const localStorageData = JSON.parse(data);
    //Check If Access Token Exist On Local Storage
    if (
      localStorageData &&
      localStorageData.token &&
      new Date(localStorageData.expiresAt) > new Date()
    ) {
      //using current access token
      setToken(localStorageData.token);
      setUserID(localStorageData.userID);
    } else {
      // Invokes Get Token Function Since Access Token
      // Not Available In Local Storage Or Token Expired
      debouncedGetToken()

    }
  }, []);

  return (
    <AuthContext.Provider value={{ getToken, token, userID }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/authorized" element={<AuthorizedPage />} />
          <Route path="/coursespage" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/piazza" element={<PiazzaPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/notesPage" element={<NotesPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/syllabusUpload" element={<SyllabusUploadPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
