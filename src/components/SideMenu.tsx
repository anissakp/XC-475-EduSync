import React, { useState } from 'react';
import Dropdown from './DropDown';

import classesIcon from "../assets/classesIcon.png"
import calendarIcon from "../assets/calendarIcon.png"
import tasksIcon from "../assets/tasksIcon.png";

interface SideMenuProps {
    toggleMenu: () => void;
}
  
interface Props {
    classNameList: string[];
}

const SideMenu: React.FC<Props> = ({ classNameList }:Props) => {
    const calendarViews = ["Daily View", "Weekly View", "Monthly View", "Yearly View"];
    const listOfClasses = ["option 1", "option 2", "option 3"];

    const handleSelect = () => {
        console.log("this has been selected");
    };

    return (

            <div className="absolute top-[90px] left-0 min-h-screen bg-custom-yellow z-10" style={{ width: "256px", padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>
                    <Dropdown 
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
                    <Dropdown 
                        name={
                            <div style={{ display: 'flex', marginLeft: "-2px" }}>
                                <img src={calendarIcon} alt="Calendar" style={{ marginRight: "20px" }} />
                                Calendar
                            </div>
                        }
                        options={calendarViews} onSelect={handleSelect}
                        containerStyle={{ width: "240px" }}
                        buttonStyle={{ backgroundColor: '#FBE6B7', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left' }}
                        listStyle={{ listStyle: 'none' }}
                        listItemStyle={{ padding: '10px', cursor: "pointer", paddingLeft: '58px' }} />
                        
                    <button style={{ backgroundColor: '#FBE6B7', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left', fontFamily: 'quicksand' }}>
                        <img src={tasksIcon} alt="Tasks" style={{ marginRight: "9px" }} />
                        <span style={{ flex: '1' }}>
                            Tasks
                        </span>
                    </button>
                </div>
            
        </div>

    );
}

export default SideMenu
