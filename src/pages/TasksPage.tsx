import DashBoardHeader from "../components/DashboardHeader"
import SideMenu from "../components/SideMenu";
import React, { useState, useEffect } from 'react';

import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';

import SideMenuButton from "../components/SideMenuButton";

import Switch from '@mui/joy/Switch';

import { useNavigate } from "react-router-dom";


type Task = {
    text: string ; 
    completed: boolean; 
    dueDate: any ; 
}
export default function TasksPage() {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
 
    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const[newTask, setnewTask] = useState<string>('')
    const[dueDate, setDueDate] = useState<string>('')
    const [showInput, setShowInput] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksDueToday, setTasksDueToday] = useState<Task[]>([]);
    const setTaskCompleted = (index: number): void => {
        const tempTasks = [...tasks]
        tempTasks[index].completed = !tempTasks[index].completed
        setTasks(tempTasks)
    }

    const addTask = (): void => {
        const newTaskTemp = {text: newTask, completed: false, dueDate: dueDate }
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
            
            
        <div className="bg-[#EBEDEC] h-[90px] flex items-center pl-[23px]">
            <SideMenuButton onClick={toggleSideMenu} />
            <button className="bg-black text-white ml-14 " onClick={goToCalendar}>{'< CALENDAR'}</button>
            <p className="ml-[52px] font-bold text-[32px] ">Tasks</p>
        </div>
    
            <div className="flex mt-[25px] h-full">
                {isSideMenuOpen && <SideMenu classNameList={[]} />}
            </div>
            <div className="flex ">
                <div className="w-[417px] ">
                    <div className="bg-[#F7E2B3] w-[417px] h-[77px] flex items-center">

                        <input className="p-[12px] ml-[23px] rounded-md bg-[#EEEEEE] h-[48px] w-[250px] " type='text' placeholder="search "></input>
                        
                        <img className="bg-[#EBEDEC] p-[10px] cursor-pointer w-[48px] h-[48px] ml-4 rounded-md" src="tune.svg"/>
                        <button className="w-[48px] h-[48px] ml-[11px] bg-[#EBEDEC]" onClick={toggleInputVisibility}>+</button>
                        
                    </div>
                   
                    <ul id = "list" className = {showInput ? "shorter-list": ""}>
                    {tasks.map((task, index) => (
                        <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            <div className = "task">
                                {/*<input className = "checkbox"
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => setTaskCompleted(index)}
                                />*/}
                                <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                    <p className=' text-center w-[417px] h-[40px] bg-gradient-to-r from-[#A2D9D1] to-[#F7E2B3]'>{task.text}</p>
                                </div>
                                
                            </div>
                            
                        </li>
                    ))}
                </ul>
                </div>
                <div className="w-[551px] mr-[30px] ml-[28px] mt-[32px] p-[23px]">
                    {showInput && (
                    <div id = "addNewAssignment">
                        <input placeholder="title" className="rounded-md w-full h-[56px] p-[12px] border" type="text" value={newTask} onChange={handleInputChange} />
                        <textarea  placeholder="description" className="mt-[20px] resize-y w-full h-32 p-2 border rounded-md"></textarea>
                        <p className="mt-4">Due date</p>
                        <input className="p-4 mt-2 rounded-md" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        <div className="flex flex-col gap-2 items-start">
                            <p className="mt-4">Labels</p>
                            <label>
                                <input className="mr-2" type="checkbox"/>
                                Classwork
                            </label>
                            <label>
                                <input className="mr-2" type="checkbox"/>
                                Homework
                            </label>
                            <label>
                                <input className="mr-2" type="checkbox"/>
                                Exam/Quiz
                            </label>
                            <label>
                                <input className="mr-2" type="checkbox"/>
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
                <div className="mx-auto h-screen ">
                    <AccordionGroup>
                        <Accordion className="w-[360px] ">
                            <AccordionSummary className="rounded-md bg-white">Due Today</AccordionSummary>
                            <AccordionDetails className="bg-[#F7E2B3]">
                            {tasksDueToday.map((task, index) => (
                                <li className="list-none"key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                <div className = "task">
                                <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                    <p className=' text-center w-[335px] h-[40px] bg-[#FFF7E4] rounded-md'>{task.text}</p>
                                   
                                </div>
                                
                            </div>
                            
                        </li>
                    ))}
                                
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className="w-[360px]">
                            <AccordionSummary className="rounded-md bg-white">Due Soon</AccordionSummary>
                            <AccordionDetails className="bg-[#E1AB91] ">
                            {tasks.map((task, index) => (
                                <li className="list-none"key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                <div className = "task">
                                <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                    <p className=' text-center w-[335px] h-[40px] bg-[#FFD6C2] rounded-md'>{task.text}</p>
                                   
                                </div>
                                
                            </div>
                            
                        </li>
                    ))}
                            
                            </AccordionDetails>
                        </Accordion>
                    </AccordionGroup>
                   
                </div>
            </div>
        </div>
    )
}