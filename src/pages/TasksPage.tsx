import TasksPageHeader from "../components/TasksPageHeader"
import SideMenu from "../components/SideMenu";
import React, { useState, useEffect } from 'react';

import SideMenuButton from "../components/SideMenuButton";

import Switch from '@mui/joy/Switch';

import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    borderTop: '0 solid rgba(0, 0, 0, .125)',
    textAlign: 'center',
    width: '360px',

}));


type Task = {
    text: string;
    completed: boolean;
    dueDate: any;
}

export default function TasksPage() {

    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
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
    const setTaskCompleted = (index: number): void => {
        const tempTasks = [...tasks]
        tempTasks[index].completed = !tempTasks[index].completed
        setTasks(tempTasks)
    }

    const addTask = (): void => {
        const newTaskTemp = { text: newTask, completed: false, dueDate: dueDate }
        setnewTask("")
        setTasks([...tasks, newTaskTemp])
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setnewTask(event.target.value)
    }
    const toggleInputVisibility = (): void => {
        setShowInput(!showInput);
    };
    const addTaskAndHideInput = (): void => {
        addTask();
        setShowInput(false);



    };

    useEffect(() => {
        console.log(tasks)
        console.log(tasksDueToday)
        const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tasksDueTodayTemp = tasks.filter(task => {
            const taskDueDate = new Date(task.dueDate);
            const taskDueDateEST = new Date(taskDueDate.toLocaleString('en-US', { timeZone: 'America/New_York' }));
            console.log(taskDueDateEST)
            console.log("this is today")
            console.log(yesterday)
            return (
                taskDueDate.getFullYear() === yesterday.getFullYear() &&
                taskDueDate.getMonth() === yesterday.getMonth() &&
                taskDueDate.getDate() === yesterday.getDate()
            );
        });
        setTasksDueToday(tasksDueTodayTemp);
    }, [tasks]);

    const navigate = useNavigate()
    const goToCalendar = (): void => {
        navigate('/dashboard')
    }

    return (
        <div >

            <TasksPageHeader onClick={toggleSideMenu} />

            <div className="flex bg-white">
                {isSideMenuOpen && <SideMenu classNameList={[]} />}
                <div className="w-[417px] h-[1024px] bg-[#EBEDEC]">
                    <div className="bg-[#F7E2B3] w-[417px] h-[77px] flex justify-center items-center gap-2">

                        <input className="p-[12px]  rounded-md bg-[#EEEEEE] h-[48px] w-[250px] " type='text' placeholder="search "></input>

                        <img className="bg-[#EBEDEC] p-[10px] cursor-pointer w-[48px] h-[48px]  rounded-md" src="tune.svg" />
                        <button className="w-[48px] h-[48px]  bg-[#EBEDEC] rounded-md" onClick={toggleInputVisibility}>+</button>

                    </div>

                    <ul id="list" className={showInput ? "shorter-list" : ""}>
                        {tasks.map((task, index) => (
                            <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                <div className="task">
                                    {/* checkbox element */}
                                    {/* <input className="checkbox"
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => setTaskCompleted(index)}
                                    /> */}
                                    <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                        <p className=' text-center w-[417px] p-1 bg-gradient-to-r from-[#A2D9D1] to-[#F7E2B3] hover:from-[#E1AB91] hover:from-5% hover:to-[#F7E2B3] hover:to-90%'>{task.text}</p>
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
                            <input placeholder="title" className="rounded-md w-full h-[56px] p-[12px] border" type="text" value={newTask} onChange={handleInputChange} />
                            <textarea placeholder="description" className="mt-[20px] resize-y w-full h-32 p-2 border rounded-md"></textarea>
                            <p className="mt-4">Due date</p>
                            <input className="p-4 mt-2 rounded-md bg-[#E1AB91]" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            <div className="flex flex-col gap-2 items-start">
                                <p className="mt-4">Labels</p>
                                <label>
                                    <input className="mr-2" type="checkbox" />
                                    Classwork
                                </label>
                                <label>
                                    <input className="mr-2" type="checkbox" />
                                    Homework
                                </label>
                                <label>
                                    <input className="mr-2" type="checkbox" />
                                    Exam/Quiz
                                </label>
                                <label>
                                    <input className="mr-2" type="checkbox" />
                                    Personal
                                </label>


                            </div>
                            <div className="flex items-center mt-4">
                                <Switch />
                                <span className="ml-2 ">Notifications</span>
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
                                            <p className='text-center w-[330px] p-[5px] bg-[#FFF7E4] rounded-md'>{task.text}</p>
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
                                                <p className='text-center w-[330px] p-[5px] bg-[#FFD6C2] rounded-md'>{task.text}</p>
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