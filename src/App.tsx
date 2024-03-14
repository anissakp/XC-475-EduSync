import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./authContext";

import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import AuthorizedPage from "./pages/AuthorizedPage";
import CoursePage from "./pages/CoursePage";

function App() {
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");

  // 3L0: GETS TOKEN FOR USER BASED ON AUTHORIZATION CODE
  const getToken = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const bbTokenURL = import.meta.env.VITE_BB_TOKEN_URL;

      const response = await fetch(
        `${bbTokenURL}?code=${code}`
      );

      const data = await response.json();

      setToken(data.access_token);
      setUserID(data.user_id);

      localStorage.setItem(
        "data",
        JSON.stringify({
          userID: data.user_id,
          token: data.access_token,
          expiresAt: new Date(new Date().getTime() + 3600000).toISOString(),
        })
      );

      if (data.access_token && data.user_id) return "success";
    } catch (error) {
      console.log("Inside GET TOKEN ERROR: ", error);
    }
  };

  //CHECK IF USERS HAS TOKEN ON INITIAL RENDER
  useEffect(() => {
    console.log("does this useffect get invoked");
    const data = localStorage.getItem("data")!;

    const localStorageData = JSON.parse(data);

    // const localStorageData = JSON.parse(localStorage.getItem("data"));
    if (
      localStorageData &&
      localStorageData.token &&
      new Date(localStorageData.expiresAt) > new Date()
    ) {
      setToken(localStorageData.token);
      setUserID(localStorageData.userID);
    }else{
      getToken()
    }
  }, []);

  return (
    <AuthContext.Provider value={{ getToken, token, userID }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/authorized" element={<AuthorizedPage />} />
          <Route path="/coursepage" element={<CoursePage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
