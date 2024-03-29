import { useState, useEffect } from "react";
import CalendarViewSwitcher from './CalendarViewSwitcher';

import "../calendar.css";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { AuthContext } from "../authContext";
import { useContext } from "react";
import ToDoList from "./ToDoList";

interface Course {
  date: Date;
  event: string;
}

interface Props {
  courses: Course[];
}

const Calendar: React.FC<Props> = ({ courses }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
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

        const eventsForDay = courses.filter((event) =>
          isSameDay(event.date, cloneDay)
        );

        days.push(
          <div
            className={`column cell ${!isSameMonth(day, monthStart) ? "text-gray-400" : isSameDay(day, new Date()) ? "text-red-400" : ""} ${i > 0 ? 'border-l-2' : ''}`}
            key={day.toString()}
          >
            <p className="number">{formattedDate}</p>
            <div className="events">
              {eventsForDay.map((event: any, index: any) => (
                <div className="event" key={index}>
                  {event.event}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      const isFirstRow = rows.length === 0;
      rows.push(
        <div
          className={`flex justify-between ${day > endDate && rows.length > 4 ? 'hidden' : ''} ${isFirstRow ? '' : 'border-t-2'}`}
          key={day.toString()}
        >
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };


  const dateFormat = "MMMM yyyy";
  // const days = [
  //   "SUNDAY",
  //   "MONDAY",
  //   "TUESDAY",
  //   "WEDNESDAY",
  //   "THURSDAY",
  //   "FRIDAY",
  //   "SATURDAY",
  // ];

  // to fix responsive issues
  const days = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
  ];


  return (
    <div className=" w-full lg:w-[1042px] h-[879px] bg-[#EBEDEC] rounded-[20px] overflow-hidden ">

      <div className="calendar_header flex justify-between items-center">
        <div>
          <button className="chevronButton" onClick={prevMonth}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5007 3.96925L10.1339 11.0136L19.5007 18.058" fill="#6EB0B6" />
            </svg>
          </button>
          <div className="month_name">{format(currentMonth, dateFormat).toUpperCase()}</div>
          <button className="chevronButton" onClick={nextMonth}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.822021 0.969246L10.1889 8.01361L0.822021 15.058" fill="#6EB0B6" />
            </svg>
          </button>
        </div>

        {/* creates a responsiveness problem */}
        <div>
          <CalendarViewSwitcher />
        </div>

      </div>

      {/* the calendar grid */}
      <div className="bg-white w-full lg:w-[96%] h-full lg:h-[774px]  mx-auto rounded-[20px]">
        <div className="wrapper">
          <div className="days row day_of_week_name " >
            {days.map((day) => (
              <div className="column" key={day}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid">
            {renderCells()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
