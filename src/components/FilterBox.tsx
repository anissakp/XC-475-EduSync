import React from 'react';


interface FilterBoxProps {
    isOpen: boolean;
    onClose: () => void;
    onChange:(options: string[]) => void; 
    labels: string[] 
}


const FilterBox: React.FC<FilterBoxProps> = ({ isOpen, onClose,labels,  onChange}) => {
    const setFilterLabels = (label:string): void => {
        const updatedLabels = labels.includes(label)
        ? labels.filter((l) => l !== label)
        : [...labels, label];
    onChange(updatedLabels);

    console.log(updatedLabels)
    };
    return (
        <div className={` mt-16 fixed z-10 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="absolute">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className='flex'>
                        <input className="mr-4"type="checkbox"
                        onChange={() => setFilterLabels("Classwork")}></input>
                        <p>Classwork</p>
                        
                    </div>
                    <div className='flex'>
                        <input className="mr-4" type="checkbox"
                        onChange={() => setFilterLabels("Homework")}></input>
                        <p>Homework</p>
                    </div>
                    <div className='flex'>
                        <input className="mr-4"type="checkbox"
                        onChange={() => setFilterLabels("Exam/Quiz")}></input>
                        <p>Exam/Quiz</p>
                    </div>
                    <div className='flex'>
                        <input className="mr-4"type="checkbox"
                        onChange={() => setFilterLabels("Personal")}></input>
                        <p>Personal</p>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    );
};


export default FilterBox

