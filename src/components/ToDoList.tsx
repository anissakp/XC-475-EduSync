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
        <div id="toDoList" className=''>
            <div id="header">
                <p className='text'>Tasks</p>

                <button className='add' onClick={toggleInputVisibility}>+</button>
            </div>
            <hr className="horizontalLine" />
            {showInput && (
                <div id="addNewAssignment">
                    <input id="addTaskTitle" type="text" value={newTask} onChange={handleInputChange} />
                    <input id="addDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    <button id="addTaskButton" onClick={addTaskAndHideInput}>Add</button>
                </div>
            )}
            <ul id="list" className={showInput ? "shorter-list" : ""}>
                {tasks.map((task, index) => (
                    <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        <div className="task">
                            <input className="checkbox"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => setTaskCompleted(index)}
                            />
                            <div className={`assignmentDetails ${task.dueDate ? 'with-due-date' : 'without-due-date'}`}>
                                <p className='taskTitle'>{task.text}</p>
                                {task.dueDate && <p className={`dueDate ${task.dueDate ? '' : 'no-date'}`}>{task.dueDate}</p>}
                            </div>

                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDoList