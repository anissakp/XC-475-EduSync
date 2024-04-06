import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./authContext";

import DashboardPage from "./pages/DashboardPage";
import ConnectPage from "./pages/ConnectPage";
import AuthorizedPage from "./pages/AuthorizedPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import PiazzaPage from "./pages/PiazzaPage";
import CoursesPage from "./pages/CoursesPage";
import TasksPage from "./pages/TasksPage"

function App() {
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");

  // FUNCTION TO SET VALUES IN LOCAL STORAGE
  const setStorageValue = (userID:string, aToken:string, rToken:string) =>{
     //Sets New Access Token Onto Local Storage
    localStorage.setItem(
      "data",
      JSON.stringify({
        userID: userID,
        token: aToken,
        expiresAt: new Date(new Date().getTime() + 7200000).toISOString(),
      })
    );

    // Set New Refresh Token On Local Storage
    localStorage.setItem(
      "refresh",
      JSON.stringify({
        refreshToken: rToken,
      })
    );
  }

  // 3L0: GETS TOKEN FOR USER BASED ON AUTHORIZATION CODE
  const getToken = async () => {
    try {
      //Retrive Refresh Data From Local Storage
      const refresh = localStorage.getItem("refresh")!;
      const refreshData = JSON.parse(refresh);

      //Get New Access Token Based On Refresh token
      if (refreshData && refreshData.refreshToken){
        const bbRefreshTokenURL = import.meta.env.VITE_BB_REFRESH_TOKEN_URL;

        const response = await fetch(
          `${bbRefreshTokenURL}?refreshToken=${refreshData.refreshToken}`
        );

        const data = await response.json();

        setToken(data.access_token);
        setUserID(data.user_id);

        setStorageValue(data.user_id, data.access_token, data.refresh_token)

      }else{
        //Initial Access Token Retrieval When BB Connection Established
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const bbTokenURL = import.meta.env.VITE_BB_TOKEN_URL;

        const response = await fetch(
          `${bbTokenURL}?code=${code}`
        );

        const data = await response.json();

        setToken(data.access_token);
        setUserID(data.user_id);

        setStorageValue(data.user_id, data.access_token, data.refresh_token)
      }

    } catch (error) {
      console.log("Inside GET TOKEN ERROR: ", error);
    }
  };

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
      setToken(localStorageData.token);
      setUserID(localStorageData.userID);
    }else{
      // Invokes Get Token Function Since Access Token 
      // Not Available In Local Storage Or Token Expired
      getToken()
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
          <Route path="/piazza" element={<PiazzaPage/>}/>
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
