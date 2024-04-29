import { useState, useEffect } from "react"
import ClassInputModal from "./ClassInputModal"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


export default function Document() {
  const [toggle, setToggle] = useState(false)
  const [value, setValue] :[any,any]= useState({})
  const [formattedTime, setFormattedTime] = useState("")

  const handleClick= ()=>{
    setToggle(!toggle)
  }


  useEffect(()=>{

    if (value && value.meetingTime){

  const meetingTime = new Date(value.meetingTime.$d);

  // Get hours and minutes from the meeting time
  const hours = meetingTime.getHours();
  const minutes = meetingTime.getMinutes();
  
  // Format the time string
 const val= `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
 setFormattedTime(val)
  
  console.log("Meeting time:", formattedTime);
  
    }

  }, [value])

  const classDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].filter((elem)=>{
    if (value && value.checkedState && value.checkedState[elem]) return <div>{elem}</div>
  })

  const filteredDays = classDays.filter(elem => {
    return value && value.checkedState && value.checkedState[elem];
  });
  
  const daysWithStyle = filteredDays.map(elem => (
    <div key={elem} className="bg-[#EBEDEC] inline mr-2 rounded-md px-2 py-1">{elem}</div>
  ));

  const officeHourDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].filter((elem)=>{
    if (value && value.officeCheckedState && value.officeCheckedState[elem]) return <div>{elem}</div>
  })

  const officefilteredDays = officeHourDays.filter(elem => {
    return value && value.officeCheckedState && value.officeCheckedState[elem];
  });
  
  const officeDaysWithStyle = officefilteredDays.map(elem => (
    <div key={elem} className="bg-[#A2D9D1] inline mr-2 rounded-md px-2 py-1">{elem}</div>
  ));

  return (
  <div className="bg-white h-96 col-span-1 sm:col-span-1 md:h-auto md:col-span-3 rounded-tl-lg rounded-tr-lg relative">
    <h3 className="bg-custom-gray2 px-5 py-2 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
      <div>Class Information</div>
      <div onClick={handleClick}>Edit</div>
    </h3>
    {Object.entries(value).length? ( <div className="p-5 text-md sm:text-l xl:text-xl">
      <div className="mb-5 leading-10">Class meets in <div className="bg-[#EBEDEC] inline rounded-md px-3 py-1">{value && value.room}</div> every <div className="inline">{daysWithStyle}</div> At <div className="bg-[#EBEDEC] inline rounded-md px-3 py-1">{formattedTime}</div></div>
      <div className="mb-5">Office Hours: {officeDaysWithStyle}</div>
      <div className="mb-5 leading-10">Additional Links:  <a href={value && value.courseLink} target="_blank" rel="noopener noreferrer" className="bg-[black] mr-3 rounded-md text-white px-3 py-1">Course Page </a> {value && value.additionalLinkLink && <a className="bg-[black] rounded-md text-white px-3 py-1" href={value && value.additionalLinkLink} target="_blank" rel="noopener noreferrer">{value && value.additionalLinkTitle}</a>} </div>
    </div>) : <div className="text-center text-2xl mt-24">Press Edit to Enter Class Information</div>}
    <div>{toggle && <ClassInputModal toggle={toggle} setToggle={setToggle} setValue={setValue}/>}</div>
  </div>


  )
}