import TasksPageHeader from "../components/TasksPageHeader"
import SideMenu from "../components/SideMenu";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { app, db } from "../firebase";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, addDoc } from "firebase/firestore";

import FilterBox from "../components/FilterBox";
import { filter } from "lodash";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },

}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
    borderTop: '0 solid rgba(0, 0, 0, .125)',
    textAlign: 'center',
    width: '360px',

}));

// NEW
type Task = {
    title: string;
    courseName: string;
    assignmentName: string;
    completed: boolean;
    dueDate: any;
    labels: string[]
    description: string; 
    id?: string;
}

interface AssignmentData {
    name: string;
    dueDate: Date;
    courseName: string;
    description: string;
    // optional field
    completed?: boolean;
    source: string;
}


export default function TasksPage() {

    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
            console.log(event);
        };


    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const [newTask, setnewTask] = useState<string>('')
    const [dueDate, setDueDate] = useState<string>('')
    const [showInput, setShowInput] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksDueToday, setTasksDueToday] = useState<Task[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const [editTask, setEditTask] = useState<Task | null>(null);
    const [editTaskIndex, setEditTaskIndex] =useState<number>(0) ; 

    const [filterOptions, setfilterOptions] = useState<string[]>([])


    const handleEditTask = (index: number): void => {
        setEditTask(tasks[index]);
    };

    const handleNewTask = (index: number): void => {
        setEditTaskIndex(index);
        setShowInput(!showInput);
        const newTask = {
            title: '',
            assignmentName: '',
            courseName: '',
            description: '',
            completed: false,
            dueDate: '',
            labels: [],
        };
        setEditTask(newTask);
        const updatedTasks = [...tasks];
        updatedTasks[index] = newTask ; 
        setTasks(updatedTasks) 
        
    };
    
    const showAndEdit = (index:number): void => {
        setEditTaskIndex(index) 
        setShowInput(true);
        handleEditTask(index) ; 
    };
    const setTaskCompleted = (index: number): void => {
        const tempTasks = [...tasks]
        tempTasks[index].completed = !tempTasks[index].completed
        setTasks(tempTasks)
    }

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchValue(event.target.value);
    }


    const handleFilterInputChange = (option: string ): void => {
        if (!filterOptions.includes(option)) {
            setfilterOptions([...filterOptions, option]);
        }
    }

    
    

    const addTask = (index: number): void => {
        if (index !== null) {
            const updatedTasks = [...tasks];
            updatedTasks[index] = editTask || { title: newTask, description: "", completed: false, dueDate: dueDate, labels: [], courseName: '', assignmentName: newTask };
            setTasks(updatedTasks);
            setEditTask(updatedTasks[index]);
        }
        setnewTask("");
    };
    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
        console.log(isFilterModalOpen)
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setnewTask(event.target.value)
        const tempTask = editTask 
        if (tempTask !== null) {
            tempTask.title = event.target.value;
            tempTask.assignmentName = event.target.value;
        } 

        setEditTask(tempTask)
    }
    const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setnewTask(event.target.value)
        const tempTask = editTask 
        if (tempTask !== null) {
            tempTask.description = event.target.value;
        } 

        setEditTask(tempTask)
    }
    
    const addTaskAndHideInput = (): void => {
        if (editTask && editTask.assignmentName) {
            addTask(editTaskIndex);
            saveTaskToFirestore(editTask);
            setShowInput(false);
        }
    };

    const setTaskDueDate = (dueDate: any): void => {
        
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex].dueDate = dueDate;
        setDueDate(dueDate) 
        setTasks(updatedTasks);
    };
    const addLabel = (label: string): void => {
        const updatedTasks = [...tasks];
        if (editTaskIndex >= 0 && editTaskIndex < updatedTasks.length) {
            const task = updatedTasks[editTaskIndex];
            const labels = task.labels.includes(label)
                ? task.labels.filter((l) => l !== label)
                : [...task.labels, label];
            task.labels = labels;
            setTasks(updatedTasks);
            setEditTask(task);
    
            const updatedLabels = selectedLabels.includes(label)
                ? selectedLabels.filter((l) => l !== label)
                : [...selectedLabels, label];
            setSelectedLabels(updatedLabels);
        }
    };
    

   

    const saveTaskToFirestore = async (editTask : Task) => {
        try {
            if (editTask) {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const userID = user.uid;
                    const userDocRef = doc(db, "users", userID);

                    const taskCollectionRef = collection(db, `users/${userID}/assignments`);
                    let assignmentData : AssignmentData = {
                            name: editTask.assignmentName,
                            dueDate: new Date(editTask.dueDate),
                            courseName: 'Task',
                            description: editTask.description,
                            source: 'EduSync',
                            completed: false,
                        };

                    // check if task has an id already => if it does then its an existing task
                    // we will just update it 
                    if (editTask.id) {
                        const taskDocRef = doc(db, `users/${userID}/assignments`, editTask.id);
                        try {
                            await setDoc(taskDocRef, assignmentData, { merge: true });
                        } catch (e) {
                            console.error("Error updating document: ", e);
                        }
                    }

                    else {
                        const docRef = await addDoc(taskCollectionRef, assignmentData);
                    }
                }
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };
    
    const fetchTasksFromFirestore = async (userId: string) => {
        const userAssignmentsRef = collection(db, `users/${userId}/assignments`);
        const querySnapshot = await getDocs(userAssignmentsRef);
        const tasks: any = [];
            querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasks.push({
                title: `${data.courseName} ${data.name}`,
                courseName: data.courseName,
                assignmentName: data.name, 
                description: data.description,
                completed:  data.completed,
                dueDate: data.dueDate.toDate(),
                labels: [],
                id: doc.id,
            });
            });
            setTasks(() => {
                setEditTaskIndex(tasks.length - 1);
                return tasks;
            });
        };

    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchTasksFromFirestore(user.uid)
                const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const tasksDueTodayTemp = tasks.filter(task => {
                    const taskDueDate = new Date(task.dueDate);
                    const taskDueDateEST = new Date(taskDueDate.toLocaleString('en-US', { timeZone: 'America/New_York' }));
                    return (
                        taskDueDate.getFullYear() === yesterday.getFullYear() &&
                        taskDueDate.getMonth() === yesterday.getMonth() &&
                        taskDueDate.getDate() === yesterday.getDate()
                    );
                });
                setTasksDueToday(tasksDueTodayTemp);
            }
        });
    }, []);

    const navigate = useNavigate()

    const goToCalendar = (): void => {
        navigate('/dashboard')
    }
    const buttonRef = useRef<HTMLButtonElement>(null);
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase());
        const matchesLabels = filterOptions.length === 0 || filterOptions.some((label) => task.labels.includes(label));
        return matchesSearch && matchesLabels;
    });
    return (
        <div >

            <TasksPageHeader onClick={toggleSideMenu} />

            <div className="flex bg-white">
                {isSideMenuOpen && <SideMenu classNameList={[]} />}
                <div className="w-[417px] h-[1024px] bg-[#EBEDEC]">
                    <div className="bg-[#F7E2B3] w-[417px] h-[77px] flex justify-center items-center gap-2">

                        <input onChange={handleSearchInputChange} className="p-[12px]  rounded-md bg-[#EEEEEE] h-[48px] w-[250px] " type='text' placeholder="search "></input>

                        
                        <button ref={buttonRef} onClick={toggleFilterModal} className="bg-[#EBEDEC] p-[10px] cursor-pointer w-[48px] h-[48px]  rounded-md">
                            <img className="bg-[#EBEDEC] cursor-pointer w-[48px] h-[48px]  rounded-md" src="tune.svg" />
                        </button>
                        <FilterBox isOpen={isFilterModalOpen} onClose={toggleFilterModal} labels={filterOptions} onChange={setfilterOptions}/>
                        
                        <button className="w-[48px] h-[48px]  bg-[#EBEDEC] rounded-md" onClick={() => handleNewTask(tasks.length)}>+</button>

                    </div>

                    <ul className={showInput ? "shorter-list" : ""}>
                        {filteredTasks.map((task, index) => (
                            <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                <div onClick={() => showAndEdit(index)} className="task">
                                    <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                    <p className={`text-center w-[417px] p-1 bg-gradient-to-r from-[#A2D9D1] to-[#F7E2B3] hover:from-[#E1AB91] hover:from-5% hover:to-[#F7E2B3] hover:to-90% ${task.title ? 'block' : 'hidden'}`}>{task.title}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* The Tasks details window */}
                <div className="w-[551px] mr-[30px] ml-[28px] mt-[32px] p-[23px]">
                    {showInput && (
                        <div id="addNewAssignment">
                            <input placeholder="title" className="rounded-md w-full h-[56px] p-[12px] border" type="text" value={editTask?.assignmentName ?? newTask} onChange={handleInputChange} />
                            <textarea placeholder="description" className="mt-[20px] resize-y w-full h-32 p-2 border rounded-md" value={editTask?.description ?? newTask} onChange={handleDescriptionInputChange} ></textarea>
                            <p className="mt-4">Due date</p>
                            <input className="p-4 mt-2 rounded-md bg-[#E1AB91]" type="date" value={editTask?.dueDate ?? newTask} onChange={(e) => setTaskDueDate(e.target.value)} />
                            <div className="flex flex-col gap-2 items-start">
                                <p className="mt-4">Labels</p>
                                <label>
                                    <input 
                                    className="mr-2" 
                                    type="checkbox" 
                                    onChange={() => addLabel('Classwork')}
                                    checked={editTask?.labels.includes('Classwork')}
                                    />
                                    Classwork
                                </label>
                                <label>
                                    <input 
                                    className="mr-2" 
                                    type="checkbox" 
                                    onChange={() => addLabel('Homework')}
                                    checked={editTask?.labels.includes('Homework')}
                                    />
                                    Homework
                                </label>
                                <label>
                                    <input 
                                    className="mr-2" 
                                    type="checkbox" 
                                    onChange={() => addLabel('Exam/Quiz')}
                                    checked={editTask?.labels.includes('Exam/Quiz')}
                                    />
                                    Exam/Quiz
                                </label>
                                <label>
                                    <input 
                                    className="mr-2" 
                                    type="checkbox" 
                                    onChange={() => addLabel('Personal')}
                                    checked={editTask?.labels.includes('Personal')}
                                    />
                                    Personal
                                </label>


                            </div>


                            <button className="bg-[#6FB0B6] text-white w-[70px] mt-4" onClick={addTaskAndHideInput}>SAVE</button>
                        </div>
                    )}
                </div>

                {/* the Due Today and Due Soon floating accordian elements. */}
                <div className="mx-auto h-screen absolute hidden lg:block top-[20%] right-12 ">
                    <Accordion className="" expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
                        <AccordionSummary className="" aria-controls="panel1d-content" id="panel1d-header">
                            Due Today
                        </AccordionSummary>
                        <AccordionDetails className="bg-[#F7E2B3]">
                            {tasksDueToday.map((task, index) => (
                                <li className="list-none" key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                    <div className="task">
                                        <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                            <p className='text-center w-[330px] p-[5px] bg-[#FFF7E4] rounded-md'>{`${task.courseName} ${task.assignmentName}`}</p>
                                        </div>

                                    </div>

                                </li>
                            ))}

                        </AccordionDetails>
                    </Accordion>
                    <Accordion className="" expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary className="" aria-controls="panel2d-content" id="panel2d-header">Due Soon</AccordionSummary>
                        <AccordionDetails className="bg-[#E1AB91] ">
                            {tasks.map((task, index) => (
                                <li className="list-none" key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                    <div className="task">
                                        <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                            <div className="">
                                                <p className='text-center w-[330px] p-[5px] bg-[#FFD6C2] rounded-md'>{`${task.courseName} ${task.assignmentName}`}</p>
                                            </div>

                                        </div>

                                    </div>

                                </li>
                            ))}

                        </AccordionDetails>
                    </Accordion>

                </div>
            </div>
        </div>
    )
}