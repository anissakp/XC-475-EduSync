import { useContext, useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';
import { AuthContext } from "../authContext" ;
import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";
import CircularIndeterminate from "../components/CircularIndeterminate";
import FormDialog from "../components/FormDialog";


import SideMenu from "../components/SideMenu";
import SideMenuButton from "../components/SideMenuButton";

export default function DashboardPage() {
  // ACCESS AUTH CONTEXT
  const auth = useContext(AuthContext);

  // SET INITIAL STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [classNameList, setClassNameList] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const toggleMenu = () => {
        setShowMenu(!showMenu);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
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
    const className = classes.map((elem:any)=>elem.courseName)
    setClassNameList(className)

    let arr:any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det:any) => {
        console.log(det.grading.due)
        return {
          date: new Date(det.grading.due),
          event: `${classes[i].courseName} ${det.name}`,
        };
      });
      arr = [...arr, ...newArr];
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
      <button style = {{height: "50px"}}onClick={toggleSideMenu}>Toggle side menu</button>
      <div className="container">
        
        {isSideMenuOpen && <SideMenu classNameList={classNameList} />}
        <Calendar courses={courses} />
        <ToDoList courses={courses}/>
      </div>
    </>
  );
}
