import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../authContext";
import homework from "../assets/Homwork.png"

export default function Assignment() {
  const [courses, setCourses] = useState([]);
  const auth = useContext(AuthContext);

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
    if (auth.token) {
      // console.log("invoked");
      // auth.getToken();
      getAssignments()
    } 
  }, [auth.token, auth.userID]);

  return <div className="border border-black col-span-2 rounded-tl-lg rounded-tr-lg bg-white">
    <h3 className="border-b border-black bg-custom-gray2 px-5 py-2 rounded-tl-lg rounded-tr-lg">Assignment</h3>
    <div className="bg-white flex flex-col gap-[29px] px-[23px] pt-3 pb-6">
      {courses.map((course: any, index) => {
        if (course.event.split(' ')[0] === "CS132") {
          return (
            <div key={index} className="flex items-center">
              <img src={homework} alt="homework logo"/>
              <div className="pl-4">
                <div className="text-black text-base font-normal font-quicksand leading-normal tracking-tight">{course.event.split(' ')[1]}</div>
                <div className="text-black text-sm font-normal font-quicksand leading-tight tracking-tight">Due: {course.date.toDateString()}</div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  </div>
}