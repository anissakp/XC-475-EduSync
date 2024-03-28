import Announcement from "../components/Announcement"
import StudentForum from "../components/StudentForum"
import Assignment from "../components/Assignment"
import ProgressBar from "../components/ProgressBar"
import Document from "../components/Document"
import CoursePageHeader from "../components/CoursePageHeader"
import { useParams } from 'react-router-dom';
import { useState } from "react"

export default function CoursesPage() {
  
  let { id, courseName } = useParams();
  const [courseID, setCourseID]= useState(id)

  return (
    <div className="flex flex-col">
    <CoursePageHeader/>
    <div className="md:flex-1 md:overflow-auto">
      <div className="grid grid-cols-1 grid-rows-5 gap-4 sm:grid-cols-2 sm:grid-rows-3 md:grid-cols-8 md:grid-rows-2 p-6 bg-gradient-custom md:h-[calc(100vh-4rem)]" >
        <Announcement courseID={courseID}/>
        <Document/>
        <ProgressBar/>
        <Assignment/>
        <StudentForum/>     
      </div> 
    </div>
  </div>
  )
}