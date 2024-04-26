import React, { useState } from 'react';
import NotesPageHeader from '../components/NotesPageHeader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import DeleteIcon from '@mui/icons-material/Delete';

export default function NotesPage() {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [selectedNote, setSelectedNote]: [any, any] = useState(null);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.5),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 1),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const [notes, setNotes] = useState([
        { id: 1, content: "Note 1", color: "#A2D9D1" },
        { id: 2, content: "Note 2", color: "#F7E2B3" },
        { id: 3, content: "Note 3", color: "#E1AB91" },
        { id: 4, content: "Note 4", color: "#DE8C73" },
        { id: 5, content: "Note 5", color: "#6FB0B6" }
    ]);

    const addNote = () => {
        const colors = ["#A2D9D1", "#6FB0B6", "#F7E2B3", "#E1AB91", "#DE8C73", "#EBEDEC", "#353638"];

        const newNote = {
            id: notes.length + 1,
            content: "New Note",
            color: colors[Math.floor(Math.random() * colors.length)] // Function to get random color
        };
        setNotes([...notes, newNote]);
    };

    const deleteNote = (id: number) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
    };

    const openNote = (id: number) => {
        const note:any = notes.find(note => note.id === id);
        setSelectedNote(note);
    };

    const closeNote = () => {
        setSelectedNote(null);
    };

    return (
        <div className="grid gap-6 justify-items-center bg-gradient-to-r from-[#DE8C73] to-[#F7E2B3] w-full h-full">
            <div className="w-full"><NotesPageHeader onClick={toggleSideMenu} /></div>
            <div className="object-center w-full md:w-[50rem] lg:w-[85.9375rem] h-dvh bg-white rounded-[1.25rem] overflow-auto">
                <div className="flex flex-row p-3.5 gap-2 bg-[#EBEDEC] h-[4.25rem] rounded-t-[1.25rem]">
                    <button className="w-[2.5rem] h-[2.5rem] rounded-[0.625rem]" onClick={addNote}><AddIcon /></button>
                    <button className="w-[2.5rem] h-[2.5rem] rounded-[0.625rem]"><FilterAltIcon /></button>
                    <Search className="h-[2.5rem]">
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search..."
                            inputProps={{ 'quicksand-label': 'search' }}
                        />
                    </Search>
                </div>
                {/*  */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center p-8 gap-9">
                    {notes.map(note => (
                        <div key={note.id} className="relative w-[200px] h-[200px] transition ease-in-out hover:scale-110 rounded-[0.9375rem]" style={{ backgroundColor: note.color }} onClick={() => openNote(note.id)}>
                            <p className={`text-center ${isDarkColor(note.color) ? 'text-gray-200' : 'text-black'}`}>{note.content}</p> {/* Center the content at the top */}
                            <button className="absolute bottom-2 left-2 w-8 h-8 bg-red-500 rounded-full text-white" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}><DeleteIcon /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay for selected note */}
            {selectedNote && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <textarea
                            className="w-full h-40 p-2 mb-4 border rounded-md resize-none"
                            value={selectedNote.content}
                            onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                        ></textarea>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={closeNote}>Save</button>
                    </div>
                </div>
            )}

            <div></div>
        </div>
    );
}

function isDarkColor(color: string) {
    // Convert color to RGB
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Calculate luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Return true if color is dark, false otherwise
    return luminance < 128;
}
