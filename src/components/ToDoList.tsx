import React from 'react'
import { useState, useEffect } from 'react';
import "../ToDoList.css"
interface Course {
    date: Date;
    event: string;
}
interface Props {
    courses: Course[];
}

type Task = {
    text: string;
    completed: boolean;
    dueDate: any;
}

const ToDoList: React.FC<Props> = ({ courses }: Props) => {
    const [newTask, setnewTask] = useState<string>('')
    const [dueDate, setDueDate] = useState<string>('')
    const [showInput, setShowInput] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (courses && courses.length > 0) {
            const initialTasks = courses.map(elem => ({
                text: elem.event,
                completed: false,
                dueDate: elem.date.toString()
            }));
            setTasks(initialTasks);
        }
    }, [courses]);

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
    return (
        <div className='bg-[#a0d7d0] w-[316px] h-[480px] rounded-[20px] pl-[25px] pt-[10px] pr-[25px] '>
            <div className='flex justify-between items-center'>
                <div id="toDoList" className=''>
                    <div id="header">
                        <p className='text'>Tasks</p>

                        <button className='w-[40px] h-[40px] text-[2em] bg-transparent border-0' onClick={toggleInputVisibility}>+</button>

                        {/* <button className='add' onClick={toggleInputVisibility}>+</button> */}
                    </div>
                    <hr className="border-[#6fb0b6] border-[1px] border-b-0 mt-[10px]" />

                    {/* <hr className="horizontalLine" /> */}
                    {showInput && (
                        // <div id="addNewAssignment">
                        //     <input id="addTaskTitle" type="text" value={newTask} onChange={handleInputChange} />
                        //     <input id="addDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        //     <button id="addTaskButton" onClick={addTaskAndHideInput}>Add</button>
                        // </div>
                        <div className='flex flex-col gap-[5px]'>
                            <input className="bg-[#d2efed] rounded-[30px] p-[10px] mt-[5px] " type="text" value={newTask} onChange={handleInputChange} />
                            <input className="bg-[#d2efed] rounded-[30px] p-[10px]" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            <button className="bg-[#d2efed] rounded-[30px] p-[10px]" onClick={addTaskAndHideInput}>Add</button>
                        </div>

                    )}
                    {/* <ul id="list" className={showInput ? "shorter-list" : ""}> */}
                    <ul id="h-[365px] overflow-y-auto p-0 mt-0" className={showInput ? "h-[220px]" : ""}>
                        {tasks.map((task, index) => (
                            <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {/* <div className="task">
                                    <input className="checkbox" */}
                                <div className="flex text-[20px] mt-[10px]">
                                    <input className=" mr-[15px]"

                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => setTaskCompleted(index)}
                                    />
                                    {/* <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                        <p className='taskTitle'>{task.text}</p>
                                        {task.dueDate && <p className={`dueDate ${task.dueDate ? '' : 'no-date'}`}>{task.dueDate}</p>} */}
                                    <div className={`${task.dueDate ? 'flex flex-col' : 'flex items-center'}`}>
                                        <p className='m-0'>{task.text}</p>
                                        {task.dueDate && <p className={`m-0 bg-[#ebedec] rounded-[5px] p-[10px] mt-[10px] text-[14px] text-center ${task.dueDate ? '' : 'hidden'}`}>{task.dueDate}</p>}

                                    </div>

                                </div>

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ToDoList