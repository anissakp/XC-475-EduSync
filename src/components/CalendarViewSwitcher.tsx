import React, { useState } from 'react';

const CalendarSwitcher = () => {
  const [selectedView, setSelectedView] = useState('Monthly');

  const handleViewChange = (view: React.SetStateAction<string>) => {
    console.log(`Switching to ${view} view`);
    setSelectedView(view);
  };

  const views = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  return (
    <div className="w-[496.87px] h-11 px-[42px] bg-custom-yellow rounded-2xl justify-center items-center gap-[26px] inline-flex">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => handleViewChange(view)}
          className={`p-2.5 justify-center items-center gap-2.5 flex rounded-2xl ${
            selectedView === view
              ? 'h-11 px-8 py-2.5 bg-white rounded-2xl shadow justify-center items-center font-semibold' // when the view is selected
              : 'bg-custom-yellow' // when the view is not selected
          } hover:bg-white`}
        >
          <div className={`text-center text-neutral-700 text-base ${
            selectedView === view ? 'font-bold' : 'font-normal'
          } font-['Quicksand']`}>
            {view}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CalendarSwitcher;
