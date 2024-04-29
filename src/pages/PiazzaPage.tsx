import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import CircularIndeterminate from "../components/CircularIndeterminate";
import { useNavigate } from "react-router-dom";
import SideMenuButton from "../components/SideMenuButton";
import SideMenu from "../components/SideMenu";

export default function PiazzaPage() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<{title: string, content: string} | null>(null);

  const handleAnnouncementClick = (content: string, title: string) => {
    setSelectedAnnouncement({title, content});
  };

  const toggleSideMenu = () => {
      setIsSideMenuOpen(!isSideMenuOpen);
  };

  const navigate = useNavigate() 
  
  const goToCalendar = (): void => {
    navigate('/dashboard')
  }

  // Set initial states
  const [userID, setUserID] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [piazzaData, setPiazzaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate()

  // Necessary to get user info later on
  const auth = getAuth(app);

  // Navigate back to dashboard page
  const handleClick = () => {
    nav("/dashboard")
  }

  // On initial load, retrieves announcements
  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user: any) => {
        setUserID(user.uid);
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        // If access token doesn't exist, display authorize button
        if (!data || !data.gmailApiAccessToken) setAuthorized(true);
        else {
          const date = new Date(
            data.gmailApiAccessTokenExpiration.seconds * 1000 +
              data.gmailApiAccessTokenExpiration.nanoseconds / 1000000
          );
          if (date > new Date()) {
            // Access token not expired so get announcement
            console.log("Using Stored Access Token");
            connectPiazza(user.uid);
          } else {
            // Access token expired, thus get new token and then get announcements
            console.log("Refresh Logic Invoked");
            await getPiazzaNewToken(user.uid);
            connectPiazza(user.uid);
          }
        }
      });
    };
    fetchData();
  }, []);

  // Generate googleauth url
  const state = JSON.stringify({ userID: userID });
  const encodedState = encodeURIComponent(state);
  const YOUR_FIREBASE_FUNCTION_URL = import.meta.env.VITE_PIAZZA_TOKEN_URL;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    YOUR_FIREBASE_FUNCTION_URL
  )}&response_type=code&scope=${encodeURIComponent(
    "https://www.googleapis.com/auth/gmail.readonly"
  )}&access_type=offline&prompt=consent&state=${encodedState}`;

  // Invoke when user clicks authorize button
  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  const connectPiazza = async (userId: any) => {
    setLoading(true);
    const result = await fetch(
      `${import.meta.env.VITE_PIAZZA_ANNOUNCEMENT_URL}?userID=${userId}`
    );
    const data = await result.json();
    setPiazzaData(data);
    setLoading(false);
  };

  const getPiazzaNewToken = async (userId: any) => {
    const result = await fetch(
      `${import.meta.env.VITE_PIAZZA_REFRESH_TOKEN_URL}?userID=${userId}`
    );
    const data = await result.json();
  };

  const display = piazzaData.map((elem: any) => {
    let encoded_text_plain = elem.payload.parts[0].parts[0].body.data;
    encoded_text_plain = encoded_text_plain
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    encoded_text_plain += "=".repeat((4 - (encoded_text_plain.length % 4)) % 4);
    let decoded_text_plain = atob(encoded_text_plain);

    const title = elem.payload.headers[33].value.split("on Piazza")[0]; // Get the title

    decoded_text_plain = decoded_text_plain.replace(/Go to https:\/\/piazza[\s\S]*$/, '');

    const arr = decoded_text_plain.split(" ");
    if (arr[0] === "Instructor") {
      return (
          <div onClick={() => handleAnnouncementClick(title, decoded_text_plain)} 
               className="w-[430px] h-[112px] bg-white rounded-[15px] p-3 mb-[-15px] overflow-hidden cursor-pointer">
          <div className="text-black text-sm font-bold font-['Quicksand'] leading-tight tracking-tight">
              {title}
          </div>
          <div className="text-black text-sm font-normal font-['Quicksand'] leading-tight leading-snug tracking-tight line-clamp-4">
            {decoded_text_plain.split("Go to https://piazza")[0]}
          </div>
        </div>
      );
    }
  });

  console.log("display", display);

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #E1AB91, #DE8C73)'}}>

      <div className="bg-[#EBEDEC] h-[90px] flex items-center pl-[23px] overflow-y mb-2">
          <SideMenuButton  onClick={toggleSideMenu} />
          <button className="bg-black text-white ml-6 " onClick={goToCalendar}>{'< DASHBOARD'}</button>
          <p className="ml-[30px] font-bold text-[32px] ">Piazza Announcements</p>
      </div>

      <div className="flex mt-[25px] h-full">
          {isSideMenuOpen && <SideMenu classNameList={[]} />}
      </div>
      <div className="flex justify-center gap-6 mb-4">
        {authorized && <button className="bg-[#DE8C73]" onClick={handleLogin}>Authorize</button>}
      </div>
      {loading ? (
        <CircularIndeterminate />
      ) : (
        <div className="flex flex-col items-center px-4"> 
          <div className = "flex pt-0">
            <div className="w-[465px] h-[580px] pt-5 pb-8 bg-[#DE8C73] rounded-[20px] flex flex-col items-center overflow-auto py-3">
              <div className="flex flex-col gap-9">
                {display}
              </div>
            </div>
            {selectedAnnouncement && (
                <div className="w-[501px] h-[580px] bg-white rounded-[20px] ml-4 p-3 overflow-auto">
                  <h3 className="text-black text-xl font-bold font-['Quicksand']">
                    {selectedAnnouncement.content}
                  </h3>
                  <p className="text-sm font-normal">{selectedAnnouncement.title}</p>
                </div>
            )}
        </div>
      </div>
      )}
    </div>
  );
}