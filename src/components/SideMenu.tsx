import React, { useState } from 'react';
import Dropdown from './DropDown';

interface SideMenuProps {
    toggleMenu: () => void;
}

interface Props {
    classNameList: string[];
}

const SideMenu: React.FC<Props> = ({ classNameList }: Props) => {
    const calendarViews = ["Daily View", "Weekly View", "Monthly View", "Yearly View"];
    const listOfClasses = ["option 1", "option 2", "option 3"];

    const handleSelect = () => {
        console.log("this has been selected");
    };

    return (
        <div className="absolute top-[90px] left-0 h-full bg-white z-10" style={{ height: "973px", width: "256px", padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img style={{ marginBottom: '16px' }} src="mainLogo.png" alt="Logo"></img>
            {/* <input style={{ width: '224px', height: '24px', borderColor: '#d9d9d9', borderStyle: 'solid', outline: 'none', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '4px', fontFamily: 'quicksand' }} placeholder="Placeholder"></input> */}

            <div>
                <Dropdown name="Classes" options={classNameList} onSelect={handleSelect}
                    containerStyle={{ width: "240px", marginTop: '24px' }}
                    buttonStyle={{ backgroundColor: 'white', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left' }}
                    listStyle={{ listStyle: 'none' }}
                    listItemStyle={{ padding: "10px", cursor: "pointer", paddingLeft: '35px' }} />
                <Dropdown name="Calendar" options={calendarViews} onSelect={handleSelect}
                    containerStyle={{ width: "240px" }}
                    buttonStyle={{ backgroundColor: 'white', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left' }}
                    listStyle={{ listStyle: 'none' }}
                    listItemStyle={{ padding: '10px', cursor: "pointer", paddingLeft: '35px' }} />
                <button style={{ backgroundColor: 'white', fontSize: '16px', padding: "8px 16px", border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left', fontFamily: 'quicksand' }}>
                    <img style={{ marginRight: '32px', width: '24px', height: '24px' }} src="StarSharp.svg" alt="Star"></img>
                    <span style={{ flex: '1' }}>
                        Tasks
                    </span>
                </button>
            </div>

        </div>
    );
}

export default SideMenu
