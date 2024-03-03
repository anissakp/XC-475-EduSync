import Calendar from "../components/Calendar";
import { AuthContext } from "../authContext" ;
import { useContext, useState, useEffect } from "react";
import ToDoList from "../components/ToDoList";

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
    const result = await fetch("https://getcourses-oh57fnnf2q-uc.a.run.app", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        userid: auth.userID,
      },
    });

    const classes = await result.json();
    console.log("courses", classes);

    let arr:any = [];
    for (let i = 0; i < classes.length; i++) {
      const newArr = classes[i].assignments.map((det:any) => {
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
    <>
      <h1>Dashboard Page</h1>
      <button onClick={handleClick}>Test</button>
      <div className="container">
        <Calendar courses={courses} />
        <ToDoList />
      </div>
      
    </>
  );
}
