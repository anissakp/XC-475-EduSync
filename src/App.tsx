import React from 'react';
import Calendar from './components/Calendar';
import UploadSyllabusButton from './components/UploadSyllabusButton';
import './Calendar.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <Calendar />
            {/* <UploadSyllabusButton /> */}
        </div>
    );
};
export default App;
