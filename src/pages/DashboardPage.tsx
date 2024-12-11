import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../contexts/authContext";

import Calendar from "../components/dashboard/Calendar";
import ToDoList from "../components/ToDoList";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import { collection, getDocs, getDoc } from "firebase/firestore";
import NewStickynotes from "../components/NewStickynotes";
import { getData } from "../components/DataStore";
import { parse } from "date-fns";
export default function DashboardPage() {
  // ACCESS AUTH CONTEXT
  const auth = useContext(AuthContext);


  // SET INITIAL STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [classNameList, setClassNameList] = useState<string[]>([]);
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
    setClassNameList(className);

    let arr: any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det: any) => {

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
    //setCourses(prevCourses => [...prevCourses, ...arr]);

    // puts assignments into database
    await saveAssignmentsToFirestore(userId, classes);
  };


  

  // CHECKS FOR TOKEN AND RETRIEVES BB ASSIGNMENT DATA
  useEffect(() => {
    const auth = getAuth(app);
    
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const userRef = doc(db, "users", user.uid);


        if (userDoc.exists() && userDoc.data().gradescopeConnected) {
          // if user pressed connect to Blackboard and connect to gradescope

          // GET ASSIGNMENTS IS ONLY FOR BLACKBOARD 
          //await getAssignments(user.uid);
          await setDoc(userRef, { blackboardConnected: false }, { merge: true });
          await setDoc(userRef, { gradescopeConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }

        else if (userDoc.exists() && userDoc.data().gradescopeConnected) {
          // if user pressed connect to Blackboard, fetch and update assignments
          //await getAssignments(user.uid);
          await setDoc(userRef, { gradescopeConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }
        else {
          //await getAssignments(user.uid);
          await fetchAssignmentsFromFirestore(user.uid);
        }
      } else {
        setLoading(false);
      }
    });
  }, [auth.token, auth.userID]);

  const fetchLoggedIn = async () => {
    fetch('http://127.0.0.1:5000/dueDates')

    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    
      // Make sure to read the response body as JSON
      return response.json();  // If the response is JSON
    })
    .then(data => {// This is where your data will be
      addToCourses(data)
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  };


 
  useEffect(() => {
    fetchLoggedIn();
  }, [auth.token, auth.userID]);


  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchedData = getData();  // Call getData() to fetch the data
    
    // Only update state if getData() returns something
    if (fetchedData) {
      setData(fetchedData);  // Update state with the fetched data
    }
  }, []); 

  const [dummy, setDummy] = useState(false);

const forceRerender = () => {
  setDummy((prev) => !prev);
};

  useEffect(() => {
    const rawData = getData();  // Get the data once
    console.log("laksjdfkajoiefwef")
    console.log(rawData)
    
    if (rawData) {
      console.log(rawData)
      const rawDataString = JSON.stringify(rawData);
      try {
        // Assuming getData() returns an array of assignments or a valid JSON string.
        //const parsedAssignments = Array.isArray(rawData) ? rawData : JSON.parse(rawData);
        const parsedAssignments = rawDataString.replace(/.*\[/, '[')  // Remove everything before the first '['
        .replace(/\].*/, ']')
        .replace(/`/g, '')         // Remove backticks if any (replace them with an empty string)
        .replace(/\\n/g, '')       // Remove newline characters (optional based on your data)
        .replace(/\\t/g, '') 
        .replace(/new Date\("(.*?)"\)/g, '"$1"')
        .replace(/\s*([{}[\],:])\s*/g, '$1') // Remove spaces around braces, brackets, colons, and commas
        .replace(/\s*"\s*([^"]*?)\s*"\s*:/g, '"$1":').replace(/'/g, '"')
        .replace(/new Date\((.*?)\)/g, '$1').replace(/([{,])\s*(\w+):/g, '$1"$2":').replace(/\\\"/g, '"')
        console.log(parsedAssignments) 

        const parsedAssignments2 = JSON.parse(parsedAssignments);
        console.log(parsedAssignments2)
        // Format assignments
        const formattedAssignments = parsedAssignments2.map((assignment: any) => ({
          ...assignment,completed: false, 
          date: new Date(assignment.date) // Convert the date to a Date object
        }));

        console.log("hello we are here")

        console.log(formattedAssignments) 
  
        setCourses([...formattedAssignments]); 
        forceRerender();
  
      } catch (error) { 
        console.error("Error parsing assignments data:", error);
        setCourses([]); // In case parsing fails, set courses to an empty array
      }
    } else {
      setCourses([]); // If there's no data, set courses to an empty array
    }
  }, [data, courses]);

  const addToCourses = (newDates:any) => {
    const newCourses = newDates.map((dateString:any, index:any) => {
      const dateParts = dateString.split('/');
      const month = parseInt(dateParts[0], 10) - 1; // Month is 0-based in JavaScript Date
      const day = parseInt(dateParts[1], 10);
      const year = month < 8 ? 2024 : 2024; // Assuming dates are all in 2024

      const date = new Date(year, month, day, 23, 59); // Set time to 23:59 for all events

      return {
        date: date,
        event: `CAS CS 350 F2024 Homework ${index + 1}`, // Example event name
        source: 'Gradescope',
        completed: false,
        id: `CAS CS 330 F2024Homework ${index + 1}`
      };
    });

    

    // Use the state setter function to update the state
    //setCourses(prevCourses => [...prevCourses, ...newCourses]);
  };


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
    //setCourses(prevCourses => [...prevCourses, ...assignments]);
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
  const [chatBotQuestion, setChatBotQuestion] = useState('');
  const [chatBotResponse, setChatBotResponse] = useState('');

  const handleChatBotSubmit = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: chatBotQuestion }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.response.choices[0].message.content)
      setChatBotResponse(data.response.choices[0].message.content); 
    } catch (error) {
      console.error('Error connecting to backend:', error);
    }
  };

  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (event:any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Create a local URL for the file
    const url = URL.createObjectURL(selectedFile);
    setFileURL(url);
  };


  console.log(courses)

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

            <input
        type="text"
        value={chatBotQuestion}
        onChange={(e) => setChatBotQuestion(e.target.value)}
        placeholder="Enter something"
      />
      <button onClick={handleChatBotSubmit}>Submit</button>
      <p>Response: {chatBotResponse}</p>
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
