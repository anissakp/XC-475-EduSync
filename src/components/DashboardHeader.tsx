// DashboardHeader.tsx
import React, { useState, useEffect } from "react";
import SideMenuButton from "./SideMenuButton";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { app } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


interface DashboardHeaderProps {
    onClick: () => void;
}

export default function DashBoardHeader({ onClick }: DashboardHeaderProps) {
    const [connected, setConnected] = useState(false)
    const [tutorial, setTutorial] = useState(true)
    const firebaseAuth = getAuth();
    const [user] = useAuthState(firebaseAuth);

    const navigate = useNavigate()

    const goToProfile = () => {
        navigate('/profile')
    }

    const handleLogout =()=>{
        if (user) {
            signOut(firebaseAuth)
              .then(() => {
                localStorage.removeItem("data");
                navigate('/')
                // Logout successful
                console.log("Logged out successfully");
              })
              .catch((error) => {
                // An error happened
                console.error("Error logging out:", error);

              });
          } else {
            console.log("No user signed in");
          }
    }

    useEffect(()=>{
        const checkStatus = async () => {
            console.log("CALLED STATUS")
            const auth = getAuth(app);
            onAuthStateChanged(auth, async (user: any) => {
              const docRef = doc(db, `users/${user.uid}`);
              const docSnap = await getDoc(docRef);
              const data = docSnap.data();
              console.log("DAT", data)
              if (!data || !data.statusGS && !data.statusBB && !data.gmailApiRefreshToken) setConnected(true)
            });
          };
          checkStatus();
    },[])

    useEffect(() => {
        const timer = setTimeout(() => {
            setTutorial(false);
          }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-[#EBEDEC] h-[45px] lg:h-[90px] flex pl-[23px] justify-between items-center relative">

            <div className="flex">
                <div><SideMenuButton onClick={onClick} /></div>
                <div><p className="ml-4 text-2xl lg:text-4xl font-bold text-[32px]">Calendar</p></div>
            </div>
            <div className="flex items-center gap-4">
                <div onClick={handleLogout}>Logout</div>
                {connected && tutorial ? <button onClick={()=>navigate("/connect")} className="animate-blink bg-[#F7E2B3]">Connect</button> :
                <button className="bg-[#F7E2B3]" onClick={()=>navigate("/connect")} >Connect</button>}
                {/* <div onClick={goToProfile} className="mr-10 bg-gray-300 h-[40px] w-[40px] rounded-full hover:cursor-pointer" ></div> */}
                <div onClick={goToProfile} className="mr-10 h-[40px] w-[40px] rounded-full hover:cursor-pointer" >
                  <img src="profile pic.svg" className='w-[40px] h-[40px] bg-gray-300 rounded-full'></img>
                </div>
            </div>
            {connected && tutorial && <div className="absolute bottom-[-9rem] right-[10rem]">
                <div className="border max-w-sm p-8 bg-[#F7E2B3] rounded-3xl">No data right now! Click here to connect with different learning platforms</div>
                <CallMadeIcon  sx={{ fontSize: 60 }} className="absolute top-[-3.5rem] right-[-1rem]"/>
            </div>}
        </div>
    );
}
