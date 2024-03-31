import { useContext, useState, useEffect } from "react";

import { NavLink } from 'react-router-dom';
import { AuthContext } from "../authContext";

import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";

import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";


export default function DashboardPage() {
  // ACCESS AUTH CONTEXT
  const auth = useContext(AuthContext);

  // SET INITIAL STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [classNameList, setClassNameList] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
    const className = classes.map((elem: any) => elem.courseName)
    setClassNameList(className)

    let arr: any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det: any) => {
        console.log(det.grading.due)
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
    if (auth.token) {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        // check if user signed in through auth already
        if (user) {
          getAssignments(user.uid);
        }
      });
    }
  }, [auth.token, auth.userID]);


  // function to save assignments to database, userID is from Firebase Auth
  const saveAssignmentsToFirestore = async (userID: string, classes: any) => {
    const userDocRef = doc(db, 'users', userID); // Reference to the user's document in Firestore

    for (const classInfo of classes) {
      for (const assignment of classInfo.assignments) {
        // index is assignment ID from blackboard
        const assignmentId = assignment.id;
        const assignmentDocRef = doc(db, `users/${userID}/assignments`, assignmentId);
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

  // for the new tasks' list button for when the screen is minimized
  const [isToDoListVisible, setIsToDoListVisible] = useState<boolean>(false);

  const toggleToDoListVisibility = (): void => {
    setIsToDoListVisible(!isToDoListVisible);
  };

  const ToDoListComponent = <ToDoList courses={courses} />


  return (
    <div className="bg-gradient-to-bl from-[#4aadba] to-[#fbe5b4] w-full h-full">
      <DashBoardHeader onClick={toggleSideMenu} />
      {/*
      {loading ? <CircularIndeterminate/> : <FormDialog courses={courses} setCourses={setCourses} setLoading={setLoading}/> } 
      {/* {loading ? <CircularIndeterminate/> : <div></div>} }
      */}
      <div className="flex p-[0.5em] lg:p-[2em] ">
        {isSideMenuOpen && <SideMenu classNameList={[]} />}
        <Calendar courses={courses} />

        <div className=" hidden lg:block">{ToDoListComponent}</div>

        {/* Task button when a screen is minimized */}
        <div className="fixed bottom-5 right-5 block lg:hidden flex flex-wrap " >
          {isToDoListVisible && ToDoListComponent} {/* Pass courses as props */}
          <button className="bg-gradient-to-r from-[#E1AB91]-500 to-[#F7E2B3]-500 ] w-[316px] text-gray-700 fixed bottom-5 right-5 order-first bg-blue-500 text-white rounded-[15px]" onClick={toggleToDoListVisibility}>Tasks</button>

        </div>

      </div>
    </div>
  );
}