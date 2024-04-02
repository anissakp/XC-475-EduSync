import { useState } from "react";
import CalendarViewSwitcher from "./CalendarViewSwitcher";
import "../Calendar.css";
import blackboardLogo from "../assets/blackboardLogo.png"
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
  date: Date;
  event: string;
}

interface Props {
  courses: Course[];
}

const Calendar: React.FC<Props> = ({ courses }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Monthly");

  const nextMonth = () => {
    if (selectedView === "Monthly") {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else if (selectedView === "Weekly") {
      setCurrentMonth(addDays(currentMonth, 7));
    }
  };

  const prevMonth = () => {
    if (selectedView === "Monthly") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else if (selectedView === "Weekly") {
      setCurrentMonth(subDays(currentMonth, 7));
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
            <p className="number">{formattedDate}</p>
            <div className="events">
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
          className={`column cell weekly-cell h-full flex flex-col justify-center items-center ${i > 0 ? "border-l-2" : ""}`}
          key={day.toString()}
        >
          <div className="date-container text-center">
            <span className="text-neutral-700 text-3xl font-medium font-['Quicksand']">{formattedDate}</span>
            <br />
            <span className="text-neutral-700 text-xl font-medium font-['Quicksand']">{dayOfWeek}</span>
          </div>
          <div className="w-full h-[645px]">
            <div className="events">
              {eventsForDay.map((event, index) => {
                const [className, ...assignmentTitle] = event.event.split(' ');
                return (
                  <div className="event text-left flex flex-col pl-2 pr-2 pt-2 pb-2 mt-2" key={index}>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold">{className}</span>
                      <img src={blackboardLogo} alt="Blackboard Logo" className="w-6 h-6 ml-2" />
                    </div>
                    {assignmentTitle.join(' ')}
                    <button className="w-[83px] h-[30px] px-2.5 py-1 bg-cyan-800 rounded flex justify-start items-center mt-2 text-white text-[12px] font-medium font-['Quicksand'] uppercase leading-snug tracking-wide"> {/* Button under the assignment */}
                      More
                      <img src={IconRight} alt="Icon" className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      );
      day = addDays(day, 1);
    }

    return <div className="flex justify-between">
      {days}
    </div>;
  };


  const dateFormat = "MMMM yyyy";
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // calendar header code
  return (
    <div className="w-[1042px] h-[875px] bg-[#EBEDEC] rounded-[20px] ">
      <div className="calendar_header flex justify-between items-center">
        <div>
          <button className="chevronButton" onClick={prevMonth}>
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
          <div className="month_name">
            {format(currentMonth, dateFormat).toUpperCase()}
          </div>
          <button className="chevronButton" onClick={nextMonth}>
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
        <div className="bg-white w-full sm:w-[96%] h-[90%] lg:h-[774px] lg:p-[20px] mx-auto rounded-[20px] ">
          <div className="wrapper">
            <div className="days row day_of_week_name">
              {days.map((day) => (
                <div className="column" key={day}>
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
          <div className="wrapper h-full">
            {renderWeeklyCells()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;