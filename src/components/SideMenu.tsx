import React, { useState } from 'react';
import Dropdown from './DropDown';
import DropDownCourses from './DropDownCourses';

import classesIcon from "../assets/classesIcon.png"
import calendarIcon from "../assets/calendarIcon.png"
import tasksIcon from "../assets/tasksIcon.png";

import { useNavigate } from 'react-router-dom';

interface SideMenuProps {
    toggleMenu: () => void;
}

interface Props {
    classNameList: string[];
}

const SideMenu: React.FC<Props> = ({ classNameList }: Props) => {
    const handleSelect = () => {
        console.log("this has been selected");
    };

    const navigate = useNavigate() 
    const goToTasks = ():void => {
        navigate('/tasks')
    }

    const goToPiazza = ():void => {
        navigate('/piazza')
    }

    return (

            <div className="absolute top-[90px] left-0 min-h-screen bg-custom-yellow z-10" style={{ width: "256px", padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>
                    <DropDownCourses
                        name={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={classesIcon} alt="Classes" style={{ marginRight: "22px" }} />
                                Classes
                            </div>
                        }
                        options={classNameList} 
                        onSelect={handleSelect}
                        containerStyle={{ width: "240px", marginTop: '24px' }}
                        buttonStyle={{ backgroundColor: '#FBE6B7', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left' }}
                        listStyle={{ listStyle: 'none' }}
                        listItemStyle={{ padding: "10px", cursor: "pointer", paddingLeft: '35px' }} />
  
                    <button onClick={goToTasks} style={{ backgroundColor: '#FBE6B7', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left', fontFamily: 'quicksand' }}>
                        <img src={tasksIcon} alt="Tasks" style={{ marginRight: "9px" }} />
                        <span style={{ flex: '1' }}>
                            Tasks
                        </span>
                    </button>

                    <button onClick={goToPiazza} style={{ backgroundColor: '#FBE6B7', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left', fontFamily: 'quicksand' }}>
                        <img src={tasksIcon} alt="Tasks" style={{ marginRight: "9px" }} />
                        <span style={{ flex: '1' }}>
                            Piazza 
                        </span>
                    </button>
                </div>
        </div>
    );
}

export default SideMenu