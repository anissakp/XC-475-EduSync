import Calendar from "../components/Calendar";
import { AuthContext } from "../authContext";
import { useContext, useState, useEffect } from "react";
import ToDoList from "../components/toDoList";

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);
  const auth = useContext(AuthContext);

  const testEndpoint = async () => {
    const result = await fetch("http://localhost:8000/api/users/testendpoint", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        userid: auth.userID,
      },
    });
  };

  const handleClick = () => {
    testEndpoint();
  };

  // RETRIEVE ASSIGNMENT FROM BB API
  const getAssignments = async () => {
    const result = await fetch("http://127.0.0.1:5001/edusync-e6e17/us-central1/getCourses", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        userid: auth.userID,
      },
    });

    const classes = await result.json();
    console.log("courses", classes);

    let arr = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det) => {
        return {
          date: new Date(det.grading.due),
          event: `${classes[i].courseName} ${det.name}`,
        };
      });
      arr = [...arr, ...newArr];
    }
    setCourses(arr);
  };

  // INVOKE GETASSIGNMENT WHEN TOKEN AND ID UPDATES
  // useEffect(() => {
  //   console.log(auth.token);
  //   if (!auth.token) {
  //     console.log("invoked");
  //     auth.getToken();
  //   }
  // }, []);

  // useEffect(() => {
  //   getAssignments();
  // }, [auth.token, auth.userID]);

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
    <>
      <h1>Dashboard Page</h1>
      <button onClick={handleClick}>Test</button>
      <Calendar courses={courses} />
      <ToDoList/> 
    </>
  );
}
