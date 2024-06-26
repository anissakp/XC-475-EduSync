import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type DropdownProps = {
    name: React.ReactNode;
    options: string[];
    onSelect: (option: string) => void;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    listStyle?: React.CSSProperties;
    listItemStyle?: React.CSSProperties;
};

function DropDownCourses({
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
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const navigate = useNavigate();
    const handleOptionClick = (option: string) => {
        setIsOpen(false);
        onSelect(option);
        console.log("it reached here") 
        navigate(`/coursespage?id=${option[1]}&courseName=${option[0]}`);
        
        // navigate(`/coursespage/${option[1]}/${option[0]}`)
    };

    return (
        <div style={containerStyle}>
            <button onClick={toggleDropdown} style={buttonStyle}>
                <span style={{ flex: '1', fontFamily: 'quicksand' }}>
                    {name}
                </span>
                <img 
                    style={{ 
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', // Rotate the arrow based on isOpen
                        marginLeft: '32px', 
                        width: '24px', 
                        height: '24px' 
                    }}
                    src="arrow.svg"
                    alt="Arrow"
                />
            </button>
            {isOpen && (
                <ul style={listStyle}>
                    {options.map((option, index) => (
                        <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            style={{
                                ...listItemStyle, 
                                backgroundColor: hoveredIndex === index ? '#f1ddb0' : 'initial'
                            }}
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

export default DropDownCourses;
