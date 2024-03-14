import { useContext, useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';
import { AuthContext } from "../authContext" ;
import Calendar from "../components/Calendar";
import ToDoList from "../components/ToDoList";

export default function DashboardPage() {
  // ACCESS AUTH CONTEXT
  const auth = useContext(AuthContext);

  // SET INITIAL STATE
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function convertDateString(dateStr:any) {
    const months:any = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [monthDay, timePart] = dateStr.split(' at ');
    const [month, day] = monthDay.split(' ');
    let [time, ampm] = timePart.split(/(AM|PM)/);
    let [hours, minutes] = time.split(':');
  
    // Adjust hours for AM/PM
    if (ampm === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (ampm === 'AM' && hours === '12') {
      hours = 0;
    }
  
    // Assuming the year 2024, adjust as needed
    const date = new Date(2024, months[month], day, hours, minutes);
  
    return date.toISOString();
  }

  // FUNCTION: RETRIEVES DATA FROM GS
  const handleConnectWithGS = async () => {
    const gsConnectionUrl = import.meta.env.VITE_GS_CONNECTION_URL;
    const result = await fetch(gsConnectionUrl, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await result.json()
    console.log(data)
    const classes:any = Object.values(data).reduce((acc:any, currentValue) => {
      return acc.concat(currentValue);
    }, []);
    console.log(classes)
    let arr:any = [];
    const newArr = classes.map((det:any) => {
      return {
        date: new Date(convertDateString(det.due_date)),
        event: `${det.course_name} ${det.title}`,
      };
    });
    arr = [...courses, ...newArr];
    setCourses(arr)

  }

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
    if (!auth.token) {
      auth.getToken();
    } else {
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
      <div>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button onClick={handleConnectWithGS}>Connect With Gradescope</button>
      </div>
      <div className="container">
        <Calendar courses={courses} />
        <ToDoList courses={courses}/>
      </div>
    </>
  );
}
