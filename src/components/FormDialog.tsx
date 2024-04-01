import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

interface Props{
  courses: any[];
  setCourses: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormDialog: React.FC<Props> = ({courses, setCourses, setLoading}) => {
  
  const [open, setOpen] = React.useState(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Connect With Gradescope
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log("formJSON", formJson)
            const email = formJson.email;
            const password = formJson.password
            handleClose();
            setLoading(true)
            const gsConnectionUrl = import.meta.env.VITE_GS_CONNECTION_URL;
            const result = await fetch(gsConnectionUrl, {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: email,
                password: password,
              }),
            });
            const data = await result.json()
            console.log("DATAAA", data)
            if (data.error){
              setLoading(false)
              console.log("incorrect password")
            }
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
            
            // add gradescope assignments to database
            const auth = getAuth();
            const user = auth.currentUser;
            const saveGradescopeAssignmentsToFirestore = async (userID: string, classes: any[]) => {
              console.log("gradescope assign saved to db")
              const userDocRef = doc(db, 'users', userID);
              for (const classInfo of classes) {
                const assignmentId = `${classInfo.id}-${Date.now()}`;
                const assignmentDocRef = doc(db, `users/${userID}/assignments`, assignmentId);
                const assignmentData = {
                  name: classInfo.title,
                  dueDate: new Date(convertDateString(classInfo.due_date)),
                  courseName: classInfo.course_name,
                  source: "Gradescope",
                };
                await setDoc(assignmentDocRef, assignmentData);
              }
            };
            if (user) {
              const userRef = doc(db, "users", user.uid); 
              await setDoc(userRef, { gradescopeConnected: true }, { merge: true });
              saveGradescopeAssignmentsToFirestore(user.uid, classes);
            }

            setCourses(arr)
            setLoading(false)
          },
        }}
      >
        <DialogTitle>Connect Gradescope</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email and password to allow access to your gradescope data.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default FormDialog
