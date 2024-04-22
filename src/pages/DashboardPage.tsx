import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../authContext";

import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";

import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import { collection, getDocs, getDoc } from "firebase/firestore";
import StickyNote from "../components/StickyNotes";
import NewStickynotes from "../components/NewStickynotes";



export default function DashboardPage() {
  // ACCESS AUTH CONTEXT
  const auth = useContext(AuthContext);

  // SET INITIAL STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [classNameList, setClassNameList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // RETRIEVE ASSIGNMENT FROM BB API
  const getAssignments = async (userId: string) => {
    console.log("BB getAssignments called")
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
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const userRef = doc(db, "users", user.uid);


        if (userDoc.exists() && userDoc.data().blackboardConnected && userDoc.data().gradescopeConnected) {
          // if user pressed connect to Blackboard and connect to gradescope
          console.log("if 1");
          await getAssignments(user.uid);
          await setDoc(userRef, { blackboardConnected: false }, { merge: true });
          await setDoc(userRef, { gradescopeConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }

        else if (userDoc.exists() && userDoc.data().gradescopeConnected) {
          console.log("if 2 no get assignments ");
          // if user pressed connect to Blackboard, fetch and update assignments
          await getAssignments(user.uid);
          await setDoc(userRef, { gradescopeConnected: false }, { merge: true });
          await fetchAssignmentsFromFirestore(user.uid);
        }
        else {
          console.log("if 3");
          await getAssignments(user.uid);
          await fetchAssignmentsFromFirestore(user.uid);
        }
      } else {
        console.log("User is not signed in");
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
        const assignmentDocRef = doc(
          db,
          `users/${userID}/assignments`,
          assignmentId
        );
        const assignmentData = {
          name: assignment.name,
          dueDate: new Date(assignment.grading.due),
          courseName: classInfo.courseName,
        };
        // assignment document saved in user's assignments subcollection
        await setDoc(assignmentDocRef, assignmentData);
      }
    }
  };

  // THIS PULLS ALL THE EVENTS FROM THE DATABASE
  // THE DATABASE GROUPS ALL THE ASSIGNMENTS TOGETHER (SOURCE OF ASSIGNMENT IS A SEPARATE FIELD)
  // **************NEW *************************
  const fetchAssignmentsFromFirestore = async (userId: string) => {
    console.log("fetchAssignmentsFromFirestore called", userId);
    const userAssignmentsRef = collection(db, `users/${userId}/assignments`);
    const querySnapshot = await getDocs(userAssignmentsRef);
    const assignments: any = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      assignments.push({
        date: data.dueDate.toDate(),
        event: `${data.courseName} ${data.name}`,
        source: data.source, // IMPLEMENT THIS
      });
    });
    console.log(assignments);
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
    <div className="bg-gradient-to-bl from-[#4aadba] to-[#fbe5b4] min-h-screen">
      {stickyNotes.map((id) => (
        <StickyNote key={id} onClone={() => onClone(id)} />
      ))}
      {<DashBoardHeader onClick={toggleSideMenu} />}
      <div className="flex min-h-screen ">
        <div className="flex p-[0.5em] sm:p-[2em] font-['Quicksand']">
          {isSideMenuOpen && <SideMenu classNameList={classNameList} />}
        </div>
        <div className="flex justify-between w-full h-full  pr-10 mt-10 min-h-screen">
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
