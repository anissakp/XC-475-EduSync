import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../contexts/authContext";

import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";
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
  const [hasFetchedSyllabi, setHasFetchedSyllabi] = useState(false);

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
  // should return data about all assignments for a given syllabus/course
  // TODO: are we trying to get one syllabus at a time or all of them?
  const fetchFlaskData = async (syllabus) => {
    console.log('Called the method to fetch flask data for:', syllabus);
    
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
        return data;
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
        console.log("syllabi in FAS:", syllabi)
        console.log('number of syllabi in FAS:', syllabi.length, syllabi[0])


        const flaskData: any[] = [];
        for (const syllabus of syllabi) {
          console.log("in fetchAllSyllabi the syllabus used to call is:", syllabus)
          const parsedData = await fetchFlaskData(syllabus);
          if (parsedData) {
            flaskData.push(parsedData); // Store the parsed data from Flask
          }
        }
        console.log("FlaskData in FAS:", flaskData)
        return flaskData; // Return the array of syllabus data
    } catch (error) {
        console.error('Error fetching syllabi in FAS:', error);
        return [];
    }
  };

// FORMAT ASSIGNMENTS FROM SYLLABUS DATA
const getSyllabusAssignments = async (userId: string) => {
  console.log("getSyllabus assignment");
  const assignments = await fetchAllSyllabi(userId); // Fetch all syllabi
  console.log("length of assignments returned by fetchAllSyllabi:", assignments[0]);
  
  const formattedAssignments = assignments[0].map((assignment: any) => ({
    grading: { due: (new Date(assignment.date)) }, // Wrap dueDate in grading object
      courseName: "CAS CS 101", // Dummy course name
      name: assignment.event || "Unknown name",
      source: "Other",
      completed: assignment.completed || false,
      id: assignment.id || "Unknown ID"
  }));

  const syllabusAssignments = [
      {
          courseName: "CAS CS 101",
          assignments: formattedAssignments
      }
  ];

  console.log("formatted assignments from flask:", formattedAssignments);
  console.log("syllabus assignments:", syllabusAssignments);

  setCourses((prevCourses) => [...prevCourses, ...formattedAssignments]);

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
          if (!hasFetchedSyllabi) {
            console.log('calling getSyllabus assignment')
            await getSyllabusAssignments(user.uid);
            await setDoc(userRef, { otherConnected: false }, { merge: true });
            await fetchAssignmentsFromFirestore(user.uid);
            setHasFetchedSyllabi(true);
          }
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
      const dueDate = data.dueDate && data.dueDate.toDate ? data.dueDate.toDate() : null; // temp fix for weird behavior of one extra assignment leading to invalid dates
      assignments.push({
        date: dueDate,
        event: `${data.courseName} ${data.name}`,
        source: data.source, 
        completed: data.completed,
        id: doc.id,
      });
    });
    console.log("Assignments from firestore:", assignments);
    setCourses(assignments);
  };

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
