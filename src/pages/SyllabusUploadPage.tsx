import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, app, storage } from "../firebase";
import Header from '../components/Header';
import connectBlob from "../assets/connectBlob.png"
import blackboardLogo from "../assets/blackboardLogo.png"
import piazzaLogo from "../assets/piazzaLogo.png"
import connectBlueBlob from "../assets/connectBlueBlob.png"
import connectOrangeBlob from "../assets/connectOrangeBlob.png"
import FormDialog from "../components/FormDialog";
import CircularIndeterminate from "../components/CircularIndeterminate";
import Checkbox from '@mui/material/Checkbox';

import UploadSyllabusButton from '../components/UploadSyllabusButton.tsx';


export default function ConnectPage() {
  const [htmlContent, setHtmlContent] = useState("");
  const[user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [piazzaStatus, setPiazzaStatus] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // set up firestore:


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

        // if (data && data.statusBB) setBlackboardStatus(true)
        // if (data && data.statusGS) setGradeScopeStatus(true)
        if (data && data.gmailApiRefreshToken) setPiazzaStatus(true)
      });
    };
    checkStatus();
  }, []);

  useEffect(() => {
    // Trigger file upload when selectedFile is updated
    const user = getAuth().currentUser;
        if (user && selectedFile) {
            handleUpload(user.uid); // Pass user ID to handleUpload
        }
  }, [selectedFile]); // Dependency is selectedFile

  // function to upload syllabus to Firebase Storage and save the URL to Firestore
  const handleUpload = async (userID: string) => {
      console.log('handle upload called');
      if (!selectedFile) {
          setError('Please select a file');
          return;
      }
      setSyllabusLoading(true);
      setError(null);
      setResult(null);
      try {
          // Create a reference to the file in Firebase Storage
          const storageRef = ref(storage, `syllabi/${selectedFile.name}`);
          // Upload the file to Firebase Storage
          const snapshot = await uploadBytes(storageRef, selectedFile);
          // Get the download URL of the uploaded file
          const downloadURL = await getDownloadURL(snapshot.ref);
          console.log('File uploaded successfully. URL:', downloadURL);
          setResult(downloadURL);
          // Save the download URL to Firestore under the user's document
          const userDocRef = doc(db, "users", userID); // Reference to the user's document
          const syllabusDocRef = doc(db, `users/${userID}/syllabi`, selectedFile.name); // Reference for the syllabus document

          // Create the data to store
          const syllabusData = {
              fileName: selectedFile.name,
              url: downloadURL,
              uploadedAt: new Date(),
              status: 'new', // or any other property you want
          };
          // Store the syllabus data in Firestore
          await setDoc(syllabusDocRef, syllabusData, { merge: true });
          // TODO: decide if necessary
          if (userID) {
            const userRef = doc(db, "users", userID); 
            await setDoc(userRef, { otherConnected: true, statusOther:true }, { merge: true });
          }
      } catch (error) {
          setError('Failed to upload file');
          console.error(error);
      } finally {
          setSyllabusLoading(false);
      }
  };



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('handle file change. file here:', file);
    if (file) {
        setSelectedFile(file);
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
