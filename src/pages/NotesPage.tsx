import React, { useState } from 'react';
import NotesPageHeader from '../components/NotesPageHeader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
<<<<<<< HEAD
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import DeleteIcon from '@mui/icons-material/Delete';

export default function NotesPage() {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
=======
import DeleteIcon from '@mui/icons-material/Delete';
import SideMenu from '../components/SideMenu';

export default function NotesPage() {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [selectedNote, setSelectedNote]: [any, any] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [classNameList, setClassNameList] = useState<string[]>([]);

    const [notes, setNotes] = useState([
        { id: 1, title: "Title 1", content: "Note 1", color: "#A2D9D1" },
        { id: 2, title: "Title 2", content: "Note 2", color: "#F7E2B3" },
        { id: 3, title: "Title 3", content: "Note 3", color: "#E1AB91" },
        { id: 4, title: "Title 4", content: "Note 4", color: "#DE8C73" },
        { id: 5, title: "Title 5", content: "Note 5", color: "#6FB0B6" }
    ]);

>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

<<<<<<< HEAD
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
=======
    const addNote = () => {
        const colors = ["#A2D9D1", "#6FB0B6", "#F7E2B3", "#E1AB91", "#DE8C73", "#EBEDEC", "#353638"];
        const newNote = {
            id: notes.length + 1,
            title: "Title",
            content: "Write your notes here!",
            color: colors[Math.floor(Math.random() * colors.length)]
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
        };
        setNotes([...notes, newNote]);
    };

    const deleteNote = (id: number) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
    };

    const openNote = (id: number) => {
<<<<<<< HEAD
        const note = notes.find(note => note.id === id);
=======
        const note:any = notes.find(note => note.id === id);
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
        setSelectedNote(note);
    };

    const closeNote = () => {
        setSelectedNote(null);
    };

<<<<<<< HEAD
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
=======
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        note.content.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleOverlayNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedNote = { ...selectedNote, content: e.target.value };
        const updatedNotes = notes.map(note =>
            note.id === selectedNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);
        setSelectedNote(updatedNote);
    };

    const handleOverlayTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedNote = { ...selectedNote, title: e.target.value };
        const updatedNotes = notes.map(note =>
            note.id === selectedNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);
        setSelectedNote(updatedNote);
    };

    return (
        <div className="grid gap-6 justify-items-center bg-gradient-to-r from-[#DE8C73] to-[#F7E2B3] w-full h-full">
            <div className="w-full"><NotesPageHeader onClick={toggleSideMenu} /></div>
            {isSideMenuOpen && <SideMenu classNameList={classNameList} />}
            <div className="object-center w-full md:w-[50rem] lg:w-[85.9375rem] h-dvh bg-white rounded-[1.25rem] overflow-auto">
                <div className="flex flex-row p-3.5 gap-2 bg-[#EBEDEC] h-[4.25rem] rounded-t-[1.25rem]">
                    <button className="w-[2.5rem] h-[2.5rem] rounded-[0.625rem]" onClick={addNote}><AddIcon /></button>
                    <form className="relative flex items-center">
                        <input
                            type="text"
                            className="h-[2.5rem] flex-grow pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>
                {/* Notes area */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center p-8 gap-9 overflow-auto">
                    {filteredNotes.map(note => (
                        <div key={note.id} className="overflow-auto relative w-[200px] h-[200px] transition ease-in-out hover:scale-110 rounded-[0.9375rem]" style={{ backgroundColor: note.color }} onClick={() => openNote(note.id)}>
                            <p className={` p-2 ${isDarkColor(note.color) ? 'text-gray-200' : 'text-black'}`}>{note.title}</p>
                            <p className={` p-2 ${isDarkColor(note.color) ? 'text-gray-200' : 'text-black'}`}>{note.content}</p>
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
                            <button className="absolute bottom-2 left-2 w-8 h-8 bg-red-500 rounded-full text-white" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}><DeleteIcon /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay for selected note */}
            {selectedNote && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
<<<<<<< HEAD
                        <textarea
                            className="w-full h-40 p-2 mb-4 border rounded-md resize-none"
                            value={selectedNote.content}
                            onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
=======
                        <textarea className='w-full h-10 p-2 mb-4 border rounded-md resize-none'
                            value={selectedNote.title}
                            onChange={handleOverlayTitleChange} // Handle note title change in overlay
                        ></textarea>
                        <textarea
                            className="w-full h-40 p-2 mb-4 border rounded-md resize-none"
                            value={selectedNote.content}
                            onChange={handleOverlayNoteChange} // Handle note content change in overlay
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
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
<<<<<<< HEAD
    // Convert color to RGB
=======
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
<<<<<<< HEAD

    // Calculate luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Return true if color is dark, false otherwise
=======
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
    return luminance < 128;
}
