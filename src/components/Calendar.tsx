import { useState, useEffect } from "react";
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

interface Course {
  date: Date;
  event: string;
}

interface Props {
  courses: Course[];
}

const Calendar: React.FC<Props> = ({ courses }:Props) => {
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

        const eventsForDay = courses.filter((event:any) =>
          isSameDay(event.date, cloneDay)
        );

        days.push(
          <div
            className={`column cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, new Date())
                ? "selected"
                : ""
            }`}
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
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const dateFormat = "MMMM yyyy";
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <div className="calendar">
      <div className="calendar_header">
        
        <button className="chevronButton" onClick={prevMonth}>
          <svg width="29" height="22" viewBox="0 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5007 3.96925L10.1339 11.0136L19.5007 18.058" fill="#6EB0B6"/>
          </svg>
        </button>
        <div className="month_name">{format(currentMonth, dateFormat).toUpperCase()}</div>
        <button className="chevronButton" onClick={nextMonth}>
          <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.822021 0.969246L10.1889 8.01361L0.822021 15.058" fill="#6EB0B6"/>
          </svg>
        </button>
      </div>

    <div className="inner_calendar_container">
      <div className="wrapper">
        <div className="days row day_of_week_name" >
        {days.map((day) => (
          <div className="column" key={day}>
            {day}
          </div>
        ))}
      </div>
      {renderCells()}
      </div>
    </div>
    </div>
  );
};

export default Calendar;
