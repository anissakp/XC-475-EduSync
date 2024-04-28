import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';

// Define an interface for the props
interface ClassInputModalProps {
  toggle: boolean; 
  setToggle: any
  setValue: any
}


export default function ClassInputModal({toggle, setToggle, setValue}: ClassInputModalProps){
  const [meetingWeekDays, setMeetingWeekDays] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [room, setRoom] = useState("")
  const [courseLink, setCourseLink] = useState("")
  const [additionalLinkTitle, setAdditionalLinkTitle] = useState("")
  const [additionalLinkLink, setAdditionalLinkLink] = useState("")
  const [instructor, setInstructor] = useState("")
  const [officeHourRoom, setOfficeHourRoom] = useState("")
  const [officeHourTime, setOfficeHourTime] = useState("")

  const [checkedState, setCheckedState] :[any,any] = useState({
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false
  });

  const [officeCheckedState, setOfficeCheckedState]:[any,any] = useState({
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false
  });

  const handleCheckboxChange = (day:any) => {
    setCheckedState({ ...checkedState, [day]: !checkedState[day] });
  };

  const handleOfficeCheckboxChange = (day:any) => {
    setOfficeCheckedState({ ...officeCheckedState, [day]: !officeCheckedState[day] });
  };


  const handleSaveClick= () => {
    setValue({meetingTime, room, courseLink, additionalLinkTitle, additionalLinkLink, instructor, officeHourRoom, officeHourTime, checkedState, officeCheckedState})
    setToggle(!toggle)
  }



  return <div className="grid grid-cols-3 grid-rows-6 gap-4 border border-black absolute left-[-300px] w-[800px] h-[600px] top-0 z-50 bg-[#EBEDEC] p-7 rounded-2xl">
    <div className="border border-black row-span-2 bg-[#94D6DC] rounded-2xl flex flex-col justify-center items-center">
      <div className="">Class Meeting Days</div>
      <div className="grid grid-cols-2">
      <div>
        <Checkbox
          checked={checkedState.MON}
          onChange={() => handleCheckboxChange('MON')}
        />
        MON
      </div>
      <div>
        <Checkbox
          checked={checkedState.TUE}
          onChange={() => handleCheckboxChange('TUE')}
        />
        TUE
      </div>
      <div>
        <Checkbox
          checked={checkedState.WED}
          onChange={() => handleCheckboxChange('WED')}
        />
        WED
      </div>
      <div>
        <Checkbox
          checked={checkedState.THU}
          onChange={() => handleCheckboxChange('THU')}
        />
        THU
      </div>
      <div>
        <Checkbox
          checked={checkedState.FRI}
          onChange={() => handleCheckboxChange('FRI')}
        />
        FRI
      </div>
    </div>
    </div>
    <div className="border border-black row-span-2 bg-[#F7E2B3] flex flex-col rounded-2xl px-6 flex flex-col justify-center items-center">
      <div>Class Meeting Time</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label="Basic time picker" onChange={(newValue:any) => setMeetingTime(newValue)}/>
      </DemoContainer>
    </LocalizationProvider>
    </div>
    <div className="border border-black bg-[#6FB0B6] row-span-2 rounded-2xl px-6 flex flex-col justify-center items-center gap-2">
      <div>Class Meeting Room</div>
      <TextField
          id="outlined-read-only-input"
          label="Bldg/Room"
          defaultValue="Bldg/Room"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRoom(event.target.value);
          }}
        />
  
      </div>
    <div className="border border-black row-span-2 col-span-1 bg-[#E1AB91] flex items-center justify-around rounded-2xl flex flex-col justify-center items-center">
      <div>Course Page</div>
      <TextField
          id="outlined-read-only-input"
          label="Link To Course Page"
          defaultValue="Course Link"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCourseLink(event.target.value);
          }}
        />

    </div>
    <div className="border border-black col-span-2 row-span-2 bg-[#A2D9D1] rounded-2xl flex flex-col justify-center items-center">
      <div>Additional Link</div>
      <div>
      <TextField
          id="outlined-read-only-input"
          label="Title"
          defaultValue="Title"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAdditionalLinkTitle(event.target.value);
          }}

        />
             <TextField
          id="outlined-read-only-input"
          label="Link"
          defaultValue="Link"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAdditionalLinkLink(event.target.value);
          }}
        />
      </div>

    </div>

    <div className="border border-black row-span-2 bg-[white] rounded-2xl flex flex-col justify-center items-center">
      <div className="">Office Hour</div>
      <div className="grid grid-cols-2">
      <div>
        <Checkbox
          checked={officeCheckedState.MON}
          onChange={() => handleOfficeCheckboxChange('MON')}
        />
        MON
      </div>
      <div>
        <Checkbox
          checked={officeCheckedState.TUE}
          onChange={() => handleOfficeCheckboxChange('TUE')}
        />
        TUE
      </div>
      <div>
        <Checkbox
          checked={officeCheckedState.WED}
          onChange={() => handleOfficeCheckboxChange('WED')}
        />
        WED
      </div>
      <div>
        <Checkbox
          checked={officeCheckedState.THU}
          onChange={() => handleOfficeCheckboxChange('THU')}
        />
        THU
      </div>
      <div>
        <Checkbox
          checked={officeCheckedState.FRI}
          onChange={() => handleOfficeCheckboxChange('FRI')}
        />
        FRI
      </div>
    </div>
    </div>
    <div className="border border-black row-span-2 bg-[white] flex flex-col rounded-2xl px-6 flex flex-col justify-center items-center">
      <div>Meeting Time</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label="Basic time picker" onChange={(newValue:any) => setMeetingTime(newValue)}/>
      </DemoContainer>
    </LocalizationProvider>
    </div>
    <div className="border border-black bg-[white] row-span-2 rounded-2xl px-6 flex flex-col justify-center items-center gap-2">
      <div>Room</div>
      <TextField
          id="outlined-read-only-input"
          label="Bldg/Room"
          defaultValue="Bldg/Room"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRoom(event.target.value);
          }}
        />
  
      </div>

    <button className="bg-[#1E1E26] text-white" onClick={handleSaveClick}>Save</button>
    <button className="bg-[#1E1E26] text-white" onClick={()=>setToggle(!toggle)}>Exit</button>
  </div>

}

