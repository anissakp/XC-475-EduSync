import { AuthContext } from "../authContext";
import { useContext, useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const auth = useContext(AuthContext);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  // RETRIEVE ASSIGNMENT FROM BB API
  const getAssignments = async () => {
    const bbCoursesUrl = import.meta.env.VITE_BB_COURSES_URL;
    const result = await fetch(bbCoursesUrl, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        userid: auth.userID,
      },
    });

    const classes = await result.json();
    console.log("courses", classes);

    let arr: any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det: any) => {
        return {
          date: new Date(det.grading.due),
          event: `${classes[i].courseName} ${det.name}`,
        };
      });
      arr = [...arr, ...newArr];
    }
    setCourses(arr);
  };

 useEffect(() => {
    console.log(auth.token);
    if (!auth.token) {
      console.log("invoked");
      auth.getToken();
    } else {
      getAssignments();
    }
  }, [auth.token, auth.userID]);


  return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-200 to-slate-400 pt-5 pl-5">

        <h1>Course Page - CS 132</h1>
        <div className="mt-4 w-[297px] bg-gray-200 text-neutral-700 text-xl font-medium font-quicksand leading-loose tracking-tight text-center py-2 rounded-tl-[10px] rounded-tr-[10px]">
            AVAILABLE ASSIGNMENTS
        </div>
        <div className="w-[297px] bg-white flex flex-col gap-[29px] px-[23px] pt-3 pb-6 rounded-bl-[10px] rounded-br-[10px]">

          {courses.map((course: any, index) => {
            if (course.event.split(' ')[0] === "CS132") {
              return (
                <div key={index} className="h-11 flex items-center">
                  <div className="w-11 h-11 px-[7px] py-2.5 bg-gradient-to-b from-orange-200 to-emerald-200 rounded-[10px] flex-col justify-center items-center gap-2.5 inline-flex">
                    <div className="w-6 h-6 relative">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V5h14v16zm-8-7h5v1.5h-5V14zm-3 4h8v1.5H8V18zm0-8h8v1.5H8v-1.5zm3-4h5v1.5h-5V6z" />
                      </svg>
                    </div>
                  </div>
                  <div className="pl-4">
                    <div className="text-black text-base font-normal font-quicksand leading-normal tracking-tight">{course.event.split(' ')[1]}</div>
                    <div className="text-black text-sm font-normal font-quicksand leading-tight tracking-tight">due: {course.date.toDateString()}</div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
  );
}

