import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState([
        { date: new Date(2024, 1, 10), event: "Meeting" },
        { date: new Date(2024, 1, 15), event: "Exam" },
        { date: new Date(2024, 1, 15), event: "Homework" },
    ]);

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
    
                const eventsForDay = events.filter(event =>
                    isSameDay(event.date, cloneDay)
                );
    
                days.push(
                    <div
                        className={`column cell ${
                            !isSameMonth(day, monthStart)
                                ? "disabled"
                                : isSameDay(day, new Date()) ? "selected" : ""
                        }`}
                        key={day.toString()}
                    >
                        <span className="number">{formattedDate}</span>
                        <div className="events">
                        {eventsForDay.map((event, index) => (
                            <div className="event" key={index}>{event.event}</div>
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
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (
        <div className="calendar">
            <div className="header">
                <div className="label">{format(currentMonth, dateFormat)}</div>
                <button onClick={prevMonth}>&lt;</button>
                <button onClick={nextMonth}>&gt;</button>
            </div>

            <div className="days row">
                {days.map((day) => (
                    <div className="column" key={day}>
                        {day}
                    </div>
                ))}
            </div>
            {renderCells()}
        </div>
    );
};

export default Calendar;
