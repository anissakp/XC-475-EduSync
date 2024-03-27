import React, { useState } from "react";
import { ReactComponent as StarIcon } from '../assets/StarSharp.svg'
import { useNavigate } from "react-router-dom";


type DropdownProps = {
    name: string;
    options: string[];
    onSelect: (option: string) => void;
    containerStyle?: React.CSSProperties; // Inline style for the dropdown container
    buttonStyle?: React.CSSProperties; // Inline style for the button
    listStyle?: React.CSSProperties; // Inline style for the list
    listItemStyle?: React.CSSProperties; // Inline style for list items
};

function Dropdown({
    name,
    options,
    onSelect,
    containerStyle,
    buttonStyle,
    listStyle,
    listItemStyle,
}: DropdownProps) {
    console.log("options", options)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const toggleDropdown = () => setIsOpen(!isOpen);
    const navigate = useNavigate() ; 
    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
        console.log("it reached here") 
        
        navigate(`/coursespage/${option[1]}/${option[0]}`)
    };

    let buttonText;
    buttonText = name 

    return (
        <div style={containerStyle}>
            <button onClick={toggleDropdown} style={buttonStyle}>
                <img style = {{marginRight: '32px', width: '24px' , height: '24px'}}src = "StarSharp.svg"></img>
                <span style = {{flex: '1', fontFamily: 'quicksand'}}>
                    {buttonText}
                </span>
                
                <img style = {{transform: 'rotate(180deg)',marginLeft:'32px', width: '24px' , height: '24px'}}src = "arrow.svg"></img>
            </button>
            {isOpen && (
                <ul style={listStyle}>
                    {options.map((option, index) => (
                        <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            style={{...listItemStyle, backgroundColor: hoveredIndex === index ? '#ececec': 'initial'}}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {option[0]}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dropdown;
