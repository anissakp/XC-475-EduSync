import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { app, db } from "../firebase";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Announcement from "../components/Announcement"
import StudentForum from "../components/StudentForum"
import Assignment from "../components/Assignment"
import ProgressBar from "../components/ProgressBar"
import Document from "../components/Document"
import CoursePageHeader from "../components/CoursePageHeader"


export default function CoursesPage() {
  // RETRIVE COURSENAME AND COURSEID FROM URL 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const name = searchParams.get('courseName');

  // SET STATE FOR COURSE ID
  const [courseID, setCourseID]= useState<string>(id || "")
  const [courseName, setCourseName] = useState<string>(name || "")

  const [weeklyPercentDone, setWeeklyPercentDone] = useState<number>(0);


  // ~~~~~~~#######################~~~~~~~~~~~~~~~~ NEW NEED TO TEST THIS ~~~~~~~~~~~~~~~#############################~~~~~~~~~~~~~
  // iterate through the user's assignments to calculate percent done for this week in this class
  // future improvement: implementing a react context to get the courses from the dashboard page instead of having to fetch from db
  const getWeeklyPercentDone = async () => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
        if (user) {

          const userId = user.uid;
          const userAssignmentsRef = collection(db, `users/${userId}/assignments`);
          const querySnapshot = await getDocs(userAssignmentsRef);

          let total = 0;
          let numCompleted = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // ~~~~~~~~~~~ ********* NOT SURE IF courseName == courseID *************** ~~~~~~~~~~ 
            // only look at assign for this course
            console.log("courseName: " + data.courseName)
            console.log("courseID: " + courseName)

            if (data.courseName == courseName) {
              if (data.completed) {

                numCompleted = numCompleted + 1;
              }
              total = total + 1;
            }
          });

          let percent: number;
          if (total == 0) {
            percent = 100;
          }
          else {
            // maybe we should round
            console.log("done " + numCompleted)
            console.log("total " + numCompleted)
            percent = (numCompleted/total) * 100;
          }

          
          setWeeklyPercentDone(percent);
          console.log("percent " + percent);
        }
      else {
        console.log("User is not signed in");
      }
    });
  };

  // ~~~~~~~~~~~ NEW ~~~~~~~~~~~~~~
  useEffect(() => {
      getWeeklyPercentDone();
  });


  return (
    <div className="flex flex-col relative">
    <CoursePageHeader/>
    <div className="md:flex-1 md:overflow-auto">
      <div className="grid grid-cols-1 grid-rows-5 gap-4 sm:grid-cols-2 sm:grid-rows-3 md:grid-cols-8 md:grid-rows-2 p-6 bg-gradient-custom md:h-[calc(100vh-5rem)]" >
        <Announcement courseID={courseID}/>
        <Document/>
        <ProgressBar weeklyPercent = {weeklyPercentDone}/>
        <Assignment/>
        <StudentForum/>     
      </div> 
    </div>
  </div>
  )
}