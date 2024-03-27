import Announcement from "../components/Announcement"
import StudentForum from "../components/StudentForum"
import Assignment from "../components/Assignment"
import ProgressBar from "../components/ProgressBar"
import Document from "../components/Document"
import { useParams } from 'react-router-dom';
import { useState } from "react"

export default function CoursesPage() {
  
  let { id, courseName } = useParams();
  const [courseID, setCourseID]= useState(id)

  return (
    <div className="grid grid-cols-8 gap-4 p-4 bg-gradient-custom h-screen ">
      <Announcement courseID={courseID}/>
      <Document/>
      <ProgressBar/>
      <StudentForum/>
      <Assignment/>
    </div> 
  )
}