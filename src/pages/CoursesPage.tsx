import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { app, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  format,
  addDays,
  isWithinInterval
} from "date-fns";

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

  const getWeeklyPercentDone = async () => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
        if (user) {

          const userId = user.uid;
          const userAssignmentsRef = collection(db, `users/${userId}/assignments`);
          const querySnapshot = await getDocs(userAssignmentsRef);

          const start_day : Date = new Date();
          const end_day : Date = addDays(start_day, 7);

          let total = 0;
          let numCompleted = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            // look at assignments for this specific course for this week and calc percent done 
            if (data.courseName == courseName) {
              const dueThisWeekBoolean = isWithinInterval(data.dueDate.toDate(), {
                start: start_day,
                end: end_day
              })

              if (dueThisWeekBoolean) {
                if (data.completed==true) {
                  numCompleted = numCompleted + 1;
                }
                total = total + 1;
              }
            }
          });

          let percent: number;
          if (total == 0) {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ display that there's no assignments due in upcoming week ~~~~~~~~~~~~~~~~~~~~
            percent = 100;
          }
          else {
            // maybe we should round
            console.log("done " + numCompleted)
            console.log("total " + numCompleted)
            percent = Math.floor((numCompleted/total) * 100);
          }

          setWeeklyPercentDone(percent);
        }
      else {
        console.log("User is not signed in");
      }
    });
  };

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
        <ProgressBar 
        weeklyPercent = {weeklyPercentDone}
        />
        <Assignment/>
        <StudentForum/>     
      </div> 
    </div>
  </div>
  )
}