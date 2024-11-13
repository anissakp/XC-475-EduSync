import { useEffect, useState } from "react";
import CalendarViewSwitcher from "./CalendarViewSwitcher";
import "../css_files/Calendar.css";
import blackboardLogo from "../assets/blackboardLogo.png"
import gradescopeLogo from "../assets/gradescopeLogo.png"
import edusyncLogo from "../assets/edusyncIcon.png"
import IconRight from "../assets/IconRight.png"

import {
  format,
  startOfWeek,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import DropdownCalendarView from "./DropdownCalendarView";

interface Course {
  source: SourceType;
  date: Date;
  event: string;
}

interface Props {
  courses: Course[];
}

type SourceType = 'Blackboard' | 'Gradescope' | 'EduSync' | 'Other'; // Add more as needed


const sourceLogoMap: { [key: string]: string | undefined } = {
  Blackboard: blackboardLogo,
  Gradescope: gradescopeLogo,
  EduSync: edusyncLogo,
  // Add more platforms and their logos as needed
};

const Calendar: React.FC<Props> = ({ courses }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Monthly");
  const [selectedDate, setSelectedDate] = useState(currentMonth); 

  // Update selectedDate when currentMonth changes
  useEffect(() => {
    setSelectedDate(currentMonth);
  }, [currentMonth]);

  const nextMonth = () => {
    if (selectedView === "Monthly") {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else if (selectedView === "Weekly") {
      setCurrentMonth(addDays(currentMonth, 7));
    } else if (selectedView === "Daily") {
      setCurrentMonth(addDays(currentMonth, 1));
    }
  };
  
  const prevMonth = () => {
    if (selectedView === "Monthly") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else if (selectedView === "Weekly") {
      setCurrentMonth(subDays(currentMonth, 7));
    } else if (selectedView === "Daily") {
      setCurrentMonth(subDays(currentMonth, 1));
    }
  };


  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        const eventsForDay = courses.filter((event) => isSameDay(event.date, cloneDay));

        days.push(
          <div
            className={`column cell ${!isSameMonth(day, monthStart)
              ? "text-gray-400"
              : ""
              } ${i > 0 ? "border-l-2" : ""}`}
            key={day.toString()}
          >
            <p className="number text-left m-0 pl-[5px] pb-[2px] font-bold text-[calc(0.5rem+1vw)]">{formattedDate}</p>
            <div className="events w-[90%] mx-auto mt-[6px]">
              {eventsForDay.map((event, index) => {
                // Split the event string into class name and assignment name
                const [className, assignmentName] = event.event.split(' ', 2);
                return (
                  <div className="event" key={index}>
                    {className}: {assignmentName}
                  </div>
                );
              })}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      
      const isFirstRow = rows.length === 0;
      rows.push(
        <div
          className={`flex justify-between ${day > endDate && rows.length > 4 ? "hidden" : ""
            } ${isFirstRow ? "" : "border-t-2"}`}
          key={day.toString()}
        >
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const renderWeeklyCells = () => {
    const weekStart = startOfWeek(currentMonth);
    const weekEnd = endOfWeek(currentMonth);

    const dateFormat = "d";
    const dayOfWeekFormat = "EEE";
    const days = [];

    let day = weekStart;

    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const dayOfWeek = format(day, dayOfWeekFormat).toUpperCase();

      const eventsForDay = courses.filter((event) => isSameDay(event.date, day));

      days.push(
        <div
          className={`column cellTwo h-full flex flex-col justify-center items-center ${i > 0 ? "border-l-2" : ""}`}
          key={day.toString()}
        >
          <div className="date-container text-center">
            <span className="text-neutral-700 text-3xl font-medium font-['Quicksand']">{formattedDate}</span>
            <br />
            <span className="text-neutral-700 text-xl font-medium font-['Quicksand']">{dayOfWeek}</span>
          </div>
          <div className="w-full h-[645px]">
          <div className="events w-[90%] mx-auto mt-[6px]">
            {eventsForDay.map((event, index) => {
              const [className, ...assignmentTitle] = event.event.split(' ');
              const eventLogo = sourceLogoMap[event.source] || blackboardLogo; // Default to Blackboard logo if source not recognized
              return (
                <div className="event text-left flex flex-col pl-2 pr-2 pt-2 pb-2 mt-2" key={index}> 
                <div className="flex justify-between items-center">
                  <span className="font-extrabold">{className}</span> 
                  <img src={eventLogo} alt={`${event.source} Logo`} className="w-6 h-6 ml-2" /> 
                </div>
                {assignmentTitle.join(' ')}
              </div>
              );
            })}
          </div>
          </div>


        </div>
      );
      day = addDays(day, 1);
    }
    return <div className="flex justify-between font-['Quicksand']">

      {days}
    </div>;
  };

const renderDailyCells = () => {
    const currentDayOfWeek = format(selectedDate, 'EEE').toUpperCase();
    const startOfWeekDate = startOfWeek(selectedDate);
  
    // Filter events for the selected date
    const eventsForSelectedDate = courses.filter((course) => isSameDay(course.date, selectedDate));
  
    // Separate events into assignments and quizzes
    const assignments = eventsForSelectedDate.filter((event) => !event.event.toLowerCase().includes("quiz"));
    const quizzes = eventsForSelectedDate.filter((event) => event.event.toLowerCase().includes("quiz"));
  
    return (
      <div>
        <div className="flex justify-between font-['Quicksand']">
          {days.map((day, i) => {
            const date = addDays(startOfWeekDate, i);
            const formattedDate = format(date, 'd');
            const isSelected = isSameDay(date, selectedDate);
            return (
              <div
                key={day}
                className={`column cellTwo h-full flex flex-col justify-center items-center ${i > 0 ? "border-l-2" : ""} ${
                  isSelected ? "bg-gradient-to-bl from-slate-400 to-emerald-200 text-white" : ""
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="date-container text-center">
                  <span className="text-neutral-700 text-3xl font-medium">{formattedDate}</span>
                  <br />
                  <span className="text-neutral-700 text-xl font-medium">{day}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          <div className="w-1/3 p-4 bg-white border-r-2 border-gray-200">
            <h3 className="text-lg font-semibold text-center mb-4">ASSIGNMENTS</h3>
            {assignments.map((event, index) => {
              const [className, assignmentName] = event.event.split(' ', 2);
              const eventLogo = sourceLogoMap[event.source] || blackboardLogo; // Default to Blackboard logo if source not recognized
              return (
                <div className="event text-left flex flex-col pl-2 pr-2 pt-2 pb-2 mt-2 relative" key={index}>
                  <span className="font-extrabold">{className}</span>
                  <span>{assignmentName}</span>
                  <img src={eventLogo} alt={`${event.source} Logo`} className="w-6 h-6 absolute top-0 right-0 mr-2 mt-2" />
                  </div>
              );
            })}
          </div>
          <div className="w-1/3 p-4 bg-white border-r-2 border-gray-200 h-[645px]">
            <h3 className="text-lg font-semibold text-center mb-4">EXAMS/QUIZZES</h3>
            {quizzes.map((event, index) => {
              const [className, quizName] = event.event.split(' ', 2);
              return (
                <div className="event text-left flex flex-col pl-2 pr-2 pt-2 pb-2 mt-2 relative" key={index}>
                  <span className="font-extrabold">{className}</span>
                  <span>{quizName}</span>
                  <img src={blackboardLogo} alt="Blackboard Logo" className="w-6 h-6 absolute top-0 right-0 mr-2 mt-2" />
                  </div>
              );
            })}
          </div>
          <div className="w-1/3 p-4 bg-white">
            <h3 className="text-lg font-semibold text-center mb-4">PERSONAL</h3>
            {/* List personal items here */}
          </div>
        </div>
      </div>
    );
  };
  

  
  const dateFormat = "MMMM yyyy";
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // calendar header code
  return (
    <div className="w-[1042px] h-[875px] bg-[#EBEDEC] ml-[-5px] rounded-[20px] font-['Quicksand']">
      <div className="calendar_header flex justify-between items-center h-auto p-[20px]">
        <div>
          <button className="chevronButton p-[5px] bg-transparent border-none" onClick={prevMonth}>
            <svg
              width="29"
              height="22"
              viewBox="0 0 29 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5007 3.96925L10.1339 11.0136L19.5007 18.058"
                fill="#6EB0B6"
              />
            </svg>
          </button>
          <div className="month_name font-bold text-[calc(1rem+1vw)] p-[10px] inline">
            {format(currentMonth, dateFormat).toUpperCase()}
          </div>
          <button className="chevronButton p-[5px] bg-transparent border-none" onClick={nextMonth}>
            <svg
              width="11"
              height="16"
              viewBox="0 0 11 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.822021 0.969246L10.1889 8.01361L0.822021 15.058"
                fill="#6EB0B6"
              />
            </svg>
          </button>
        </div>

        <div className="block lg:hidden">
          <DropdownCalendarView
            selectedView={selectedView}
            setSelectedView={setSelectedView} />
        </div>

        <div className="hidden lg:block">
          <CalendarViewSwitcher
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
        </div>




      </div>

      {/* MONTHLY CALENDAR VIEW */}
      {selectedView === "Monthly" && (
        <div className="bg-white w-[1004px] h-[774px] mx-auto rounded-[20px] ">
          <div className="wrapper h-auto p-[20px]">
            <div className="day_of_week_name flex justify-between pt-[30px] pb-[20px] font-semibold text-[calc(0.5rem+1vw)] gap-[10px]">
              {days.map((day) => (
                <div className="column column flex-[calc(100%/7)] text-center mr-0" key={day}>
                  {day}
                </div>
              ))}
            </div>
            {renderCells()}
          </div>
        </div>
      )}


      {/* WEEKLY CALENDAR VIEW */}
      {selectedView === "Weekly" && (
        <div className="bg-white w-[1004px] h-[774px] mx-auto rounded-[20px] ">
          <div className="wrapper h-auto p-[20px]">
            {renderWeeklyCells()}
          </div>
        </div>
      )}

      {/* DAILY CALENDAR VIEW */}
      {selectedView === "Daily" && (
        <div className="bg-white w-[1004px] h-[774px] mx-auto rounded-[20px] ">
          <div className="wrapper h-auto p-[20px]">
            {renderDailyCells()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;