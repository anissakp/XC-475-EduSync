import { AuthContext } from "../authContext";
import { useContext, useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const auth = useContext(AuthContext);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
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
      <h1> Course Page - CS 132 </h1>
      
      <h3> Assignments </h3>
      <table style={{ borderCollapse: 'separate', borderSpacing: '10px' }}>
        <thead>
          <tr>
            <th>Course</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => {
            if (course.event.split(' ')[0] === "CS132") {
              return (
                <tr key={index}>
                  <td>{course.event.split(' ')[0]}</td> 
                  <td>{course.event.split(' ')[1]}</td>
                  <td>{course.date.toDateString()}</td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>

      <h3> Syllabus </h3>

      <div>
        <label>
          Upload PDF:
          <input type="file" onChange={handleFileUpload} accept=".pdf" />
        </label>
        {uploadedFile && (
          <embed
            src={URL.createObjectURL(uploadedFile)}
            width="350"
            height="350"
            type="application/pdf"
          />
        )}
      </div>
      
    </>
  );

}

