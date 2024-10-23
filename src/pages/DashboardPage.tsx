import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../contexts/authContext";

import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import { collection, getDocs, getDoc } from "firebase/firestore";
import NewStickynotes from "../components/NewStickynotes";

export default function DashboardPage() {
  // ACCESS AUTH CONTEXT

  const auth = useContext(AuthContext);

  // SET INITIAL STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [classNameList, setClassNameList] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  interface AssignmentData {
    name: string;
    dueDate: Date;
    courseName: string;
    // optional field
    completed?: boolean;
  }


  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // RETRIEVE DATA FROM FLASK (FOR SYLLABUS)
  // Updated to accept syllabus data instead of a File object
  const fetchFlaskData = async (syllabus) => {
    console.log('Called the method to fetch flask data');
    
    try {
        // Fetch the PDF from the URL
        const pdfResponse = await fetch(syllabus.url);
        
        if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
        }
        
        // Convert the response into a Blob
        const pdfBlob = await pdfResponse.blob();
        
        // Create a FormData object to hold the file
        const formData = new FormData();
        formData.append('syllabus', pdfBlob, syllabus.fileName); // Use the appropriate field name expected by your Flask backend
        
        // Send the FormData to Flask
        const response = await fetch('http://127.0.0.1:5000/data', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data from Flask:", data); // Handle the response data as needed
        // Call a function to add the data to Firebase
    } catch (error) {
        console.error('Error:', error);
    }
  };

  // Function to retrieve all syllabi for a user
  const fetchAllSyllabi = async (userID: string) => {
    console.log('fetching all sylabi')
    try {
        const syllabiCollectionRef = collection(db, `users/${userID}/syllabi`);
        const querySnapshot = await getDocs(syllabiCollectionRef);
        
        const syllabi: any = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            syllabi.push(data); // Push the syllabus data into the array
        });
        console.log('number of syllabi:', syllabi.length, syllabi[0])
        // Get the course details for each syllabus
        for (let i = 0; i < syllabi.length; i++) {
            await fetchFlaskData(syllabi[i]);
        }
        return syllabi; // Return the array of syllabus data
    } catch (error) {
        console.error('Error fetching syllabi:', error);
        return [];
    }
  };

  // RETRIEVE ASSIGNMENT FROM SYLLABI
// RETRIEVE ASSIGNMENT FROM SYLLABI
const getSyllabusAssignments = async (userId: string) => {
    console.log("getSyllabus assignment")
    const syllabi = await fetchAllSyllabi(userId); // Fetch all syllabi
    let syllabusAssignments: any[] = [];

    // Loop through each syllabus, extract assignments, and format them
    for (let i = 0; i < syllabi.length; i++) {
        const syllabus = syllabi[i];

        // Assuming that the Flask API returns an array of assignments from the syllabus
        const assignmentsFromFlask = await fetchFlaskData(syllabus);
        const formattedAssignments = assignmentsFromFlask.map((assignment: any) => ({
            date: new Date(assignment.dueDate), // Assuming Flask returns a dueDate
            event: `${syllabus.courseName} ${assignment.name}`, // Combine course name and assignment name
            source: "Syllabus", // Mark the source as "Syllabus"
            completed: false, // Set completed to false by default
            id: assignment.id // Assuming each assignment has a unique ID
        }));
        syllabusAssignments = [...syllabusAssignments, ...formattedAssignments];
    }
    // Update the state with the syllabus assignments
    setCourses((prevCourses) => [...prevCourses, ...syllabusAssignments]);
    // Save these assignments to Firestore
    await saveAssignmentsToFirestore(userId, syllabusAssignments);
  };


  // RETRIEVE ASSIGNMENT FROM BB API
  const getAssignments = async (userId: string) => {
    const bbCoursesUrl = import.meta.env.VITE_BB_COURSES_URL;
    const result = await fetch(bbCoursesUrl, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        userid: auth.userID,
      },
    });

    const classes = await result.json();
    const className = classes.map((elem: any) => [
      elem.courseName,
      elem.courseID,
    ]);
    console.log("classname", className);
    setClassNameList(className);

    let arr: any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det: any) => {
        console.log(det.grading.due);
        return {
          date: new Date(det.grading.due),
          event: `${classes[i].courseName} ${det.name}`,
          source: "Blackboard",
          completed: false,
          id: det.id,
        };
      });

      arr = [...arr, ...newArr];
    }
    setCourses(arr);

    // puts assignments into database
    await saveAssignmentsToFirestore(userId, classes);
  };

  // CHECKS FOR TOKEN AND RETRIEVES BB ASSIGNMENT DATA
  useEffect(() => {
    const auth = getAuth(app);
    console.log('useEffect triggered')

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('user is valid')
        // await fetchAllSyllabi(user.uid); // this calls twice but only want it once
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const userRef = doc(db, "users", user.uid);


        if (userDoc.exists() && userDoc.data().blackboardConnected && userDoc.data().gradescopeConnected) {
          // if user pressed connect to Blackboard and connect to gradescope
          await getAssignments(user.uid);
          await setDoc(userRef, { blackboardConnected: false }, { merge: true });
          await setDoc(userRef, { gradescopeConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }

        else if (userDoc.exists() && userDoc.data().gradescopeConnected) {
          // if user pressed connect to Blackboard, fetch and update assignments
          await getAssignments(user.uid);
          await setDoc(userRef, { gradescopeConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }
        else if (userDoc.exists() && userDoc.data().otherConnected) {
          // if user connected to syllabus fetch and update assigments
          console.log('calling getSyllabus assignment')
          await getSyllabusAssignments(user.uid);
          await setDoc(userRef, { otherConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }
        else {
          await getAssignments(user.uid);
          await fetchAssignmentsFromFirestore(user.uid);
        }
      } else {
        setLoading(false);
      }
    });
  }, [auth.token, auth.userID]);


  // function to save assignments to database, userID is from Firebase Auth
  const saveAssignmentsToFirestore = async (userID: string, classes: any) => {
    const userDocRef = doc(db, "users", userID);
    for (const classInfo of classes) {
      for (const assignment of classInfo.assignments) {
        const assignmentId = assignment.id;
        const assignmentDocRef = doc(db, `users/${userID}/assignments`, assignmentId);

        const docSnapshot = await getDoc(assignmentDocRef);

        let assignmentData : AssignmentData = {
          name: assignment.name,
          dueDate: new Date(assignment.grading.due),
          courseName: classInfo.courseName,
        };

        //~~~~~ check if the document already exists ~~~~~~~
        // if the doc doesn't already exist, we can just set completed to false
        if (!docSnapshot.exists()) {
          assignmentData['completed'] = false;
        } else {
          // if doc exists already, merge and don't overwrite completed
          assignmentData = {
            ...docSnapshot.data(),
            ...assignmentData
          };
        }
        await setDoc(assignmentDocRef, assignmentData, { merge: true });
      }
    }
  };

  // THIS PULLS ALL THE EVENTS FROM THE DATABASE
  // THE DATABASE GROUPS ALL THE ASSIGNMENTS TOGETHER (SOURCE OF ASSIGNMENT IS A SEPARATE FIELD)
  const fetchAssignmentsFromFirestore = async (userId: string) => {
    const userAssignmentsRef = collection(db, `users/${userId}/assignments`);
    const querySnapshot = await getDocs(userAssignmentsRef);
    const assignments: any = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      assignments.push({
        date: data.dueDate.toDate(),
        event: `${data.courseName} ${data.name}`,
        source: data.source, 
        completed: data.completed,
        id: doc.id,
      });
    });
    console.log(assignments);
    setCourses(assignments);
  };

  // Function to retrieve all syllabi for a user
  // const fetchAllSyllabi = async (userID: string) => {
  //     try {
  //         const syllabiCollectionRef = collection(db, `users/${userID}/syllabi`);
  //         const querySnapshot = await getDocs(syllabiCollectionRef);
          
  //         const syllabi: any = [];
  //         querySnapshot.forEach((doc) => {
  //             const data = doc.data();
  //             syllabi.push(data); // Push the syllabus data into the array
  //         });

  //         // get the course details for each syllabus
  //         for(let i = 0; i < syllabi.length; i++) {
  //           await fetchFlaskData(syllabi[i]);
  //         }

  //         return syllabi; // Return the array of syllabus data
  //     } catch (error) {
  //         console.error('Error fetching syllabi:', error);
  //         return [];
  //     }
  // };

  // const handleFetchAllSyllabi = async () => {
  //   const userID = 'user-id'; // Replace with the actual user ID
  //   const syllabi = await fetchAllSyllabi(userID);
    
  //   if (syllabi.length > 0) {
  //       // Assuming you have a way to let users choose a syllabus
  //       const syllabusURL = syllabi[0].url; // For example, just taking the first one
        
  //       // Create a link to download the PDF
  //       const link = document.createElement('a');
  //       link.href = syllabusURL;
  //       link.target = '_blank'; // Open in a new tab
  //       link.download = syllabi[0].fileName; // Suggest a filename for download
  //       document.body.appendChild(link);
  //       link.click(); // Simulate a click to trigger download
  //       document.body.removeChild(link); // Clean up
  //   } else {
  //       console.error('No syllabi found for this user.');
  //   }
  // };


  const [stickyNotes, setStickyNotes] = useState<number[]>([]);
  const onClone = (id: number) => {
    console.log(id)
    const newId = Date.now(); // Generate a new ID for the cloned sticky note
    setStickyNotes((prevStickyNotes) => [...prevStickyNotes, newId]); // Add the new ID to the stickyNotes state
  };

  // for the new tasks' list button for when the screen is minimized
  const [isToDoListVisible, setIsToDoListVisible] = useState<boolean>(false);

  const toggleToDoListVisibility = (): void => {
    setIsToDoListVisible(!isToDoListVisible);
  };

  const ToDoListComponent = <ToDoList courses={courses} />;

  return (
    <div className="bg-gradient-to-bl from-[#4aadba] to-[#fbe5b4] w-full h-full">
      <DashBoardHeader onClick={toggleSideMenu} />


      <div className="grid justify-center">
        <div className="flex p-[0.5em] sm:p-[2em] font-['Quicksand']">
          {isSideMenuOpen && <SideMenu classNameList={classNameList} />}
          <Calendar courses={courses} />
          <div className=" justify-items-center ml-4">
            <div className="hidden justify-self-center lg:block">{ToDoListComponent}</div>


            <div className="justify-self-center mt-4">
              <NewStickynotes />
            </div>
          </div>

        </div>


      </div>

      {/* Task button when a screen is minimized */}
      <div className="fixed bottom-5 right-5 lg:hidden flex flex-wrap font-['Quicksand']" >
        {isToDoListVisible && ToDoListComponent} {/* Pass courses as props */}
        <button className="bg-gradient-to-r from-[#E1AB91]-500 to-[#F7E2B3]-500 ] w-[316px] text-gray-700 fixed bottom-5 right-5 order-first bg-blue-500 text-white rounded-[15px]" onClick={toggleToDoListVisibility}>Tasks</button>
      </div>


    </div>
  );
}
