import React from "react";
import Dropdown from "./DropDown";


export default function SideMenu() {
    const calendarViews = ["Daily View", "Weekly View", "Monthly View", "Yearly View"];
    const listOfClasses = ["option 1", "option 2", "option 3"];

    const handleSelect = () => {
        console.log("this has been selected")
    };
    return (
        <div style ={{height:"1024px" , width:"256px", padding: '12px', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img style = {{marginBottom: '16px'}}src="mainLogo.png"></img>
            <input style = {{width: '224px', height: '24px', borderColor: '#d9d9d9',borderStyle: 'solid',  outline:'none', paddingLeft:'12px', paddingRight: '12px' ,paddingTop:'8px', paddingBottom: '8px', borderRadius: '4px', fontFamily: 'quicksand'}} placeholder="Placeholder"></input>
            <Dropdown name= "Classes" options = {listOfClasses} onSelect={handleSelect}
                containerStyle={{ width: "240px", marginTop: '24px'}}
                buttonStyle={{backgroundColor: 'white',  fontSize: '16px' , padding: "8px 16px", border:'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left'}}
                listStyle={{listStyle: 'none' }}
                listItemStyle={{ padding: "10px", cursor: "pointer" , paddingLeft: '35px'}} />
            <Dropdown name="Calendar" options={calendarViews} onSelect={handleSelect}
                containerStyle={{ width: "240px"}}
                buttonStyle={{backgroundColor: 'white', fontSize: '16px' , padding: "8px 16px", border:'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left'}}
                listStyle={{listStyle: 'none' }}
                listItemStyle={{padding: '10px' ,cursor: "pointer", paddingLeft: '35px'}} />
            
            
           
            <button style={{ backgroundColor: 'white', fontSize: '16px' , padding: "8px 16px", border:'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "240px", textAlign: 'left', fontFamily: 'quicksand'}}>
                <img style = {{marginRight: '32px', width: '24px' , height: '24px'}}src = "StarSharp.svg"></img>
                <span style = {{flex: '1'}}>
                    Tasks
                </span>
            </button>
            
           
        </div>
    )
}


