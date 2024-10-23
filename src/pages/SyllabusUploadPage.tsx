import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { app } from "../firebase";
import {  getDoc } from "firebase/firestore";
import Header from '../components/Header';
import connectBlob from "../assets/connectBlob.png"
import blackboardLogo from "../assets/blackboardLogo.png"
import piazzaLogo from "../assets/piazzaLogo.png"
import connectBlueBlob from "../assets/connectBlueBlob.png"
import connectOrangeBlob from "../assets/connectOrangeBlob.png"
import FormDialog from "../components/FormDialog";
import CircularIndeterminate from "../components/CircularIndeterminate";
import Checkbox from '@mui/material/Checkbox';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import UploadSyllabusButton from '../components/UploadSyllabusButton.tsx';


export default function ConnectPage() {
  const [htmlContent, setHtmlContent] = useState("");
  const[user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [piazzaStatus, setPiazzaStatus] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);

  // just added ********
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
        console.log(user.uid) 
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setSelectedFile(file);
      }
  };

  const handleUpload = async () => {
      if (!selectedFile) {
          setError('Please select a file');
          return;
      }

      setSyllabusLoading(true);
      setError(null);
      setResult(null);

      try {
          const formData = new FormData();
          formData.append('file', selectedFile);

          // the endpoint of our cloud function
          const response = await fetch('YOUR_FIREBASE_CLOUD_FUNCTION_ENDPOINT', {
              method: 'POST',
              body: formData,
          });

          if (!response.ok) {
              throw new Error('Failed to upload file');
          }

          // File successfully uploaded
          console.log('File uploaded successfully');
          const resultData = await response.text();
          setResult(resultData);


          } catch (error) {
              setError('Failed to upload file');
              console.error(error);
          } finally {
              setSyllabusLoading(false);
      }
  };

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
                {/* TODO: add onclick function for uploading file */}
                <div>
                  {/* Hidden file input */}
                  {/* Hidden file input */}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}  // Hides the file input
                  id="file-upload"
                />

                {/* Custom styled button to match the previous button */}
                <label
                  htmlFor="file-upload"
                  style={{
                    marginTop: '20px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '20px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: 'black',
                    borderRadius: '20px',
                    // border: '1px solid black',
                    transition: 'background-color 0.3s ease',
                  }}
                  // onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                  // onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  Syllabus {selectedFile && <Checkbox {...label} defaultChecked color="success" />}
                </label>


                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                <button className="mt-5 bg-white flex items-center text-[20px]" onClick={()=>navigate("/connect")}>
                  {/* <img src={piazzaLogo} alt="PiazzaLogo" className="w-6 h-6 mr-[1px]"/> */}
                  Learning Modules
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
