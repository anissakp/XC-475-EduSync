import { useContext, useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';
import { AuthContext } from "../authContext" ;
import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";
import CircularIndeterminate from "../components/CircularIndeterminate";
import FormDialog from "../components/FormDialog";


import SideMenu from "../components/SideMenu";

export default function DashboardPage() {
  // ACCESS AUTH CONTEXT
  const auth = useContext(AuthContext);

  // SET INITIAL STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)

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

    let arr:any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det:any) => {
        console.log(det.grading.due)
        return {
          date: new Date(det.grading.due),
          event: `${classes[i].courseName} ${det.name}`,
        };
      });
      arr = [...courses, ...newArr];
    }
    setCourses(arr);
  };

  // CHECKS FOR TOKEN AND RETRIEVES BB ASSIGNMENT DATA
  useEffect(() => {
    if (auth.token) {
      getAssignments();
    } 
  }, [auth.token, auth.userID]);


  return (
    <>
      <h1>Dashboard Page</h1>
      <button>
          <NavLink to="/coursepage" className="App-link">
              Course Page
          </NavLink>
      </button>
      {loading ? <CircularIndeterminate/> : <FormDialog courses={courses} setCourses={setCourses} setLoading={setLoading}/> }
      {/* {loading ? <CircularIndeterminate/> : <div></div>} */}
      <div className="container">
        <SideMenu />
        <Calendar courses={courses} />
        <ToDoList courses={courses}/>
      </div>
    </>
  );
}
