import { useState, FunctionComponent } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const NewStickynotes: FunctionComponent = () => {
    const [notes, setNotes] = useState<{ text: string; color: string }[]>([
        { text: "Note 1", color: "#A2D9D1" },
        { text: "Note 2", color: "#6FB0B6" },
        { text: "Note 3", color: "#F7E2B3" }
    ]);
    const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);

    const addNote = () => {
        const colors = ["#A2D9D1", "#6FB0B6", "#F7E2B3", "#E1AB91", "#DE8C73", "#EBEDEC", "#353638"];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        const newNotes = [...notes, { text: "", color: newColor }];
        setNotes(newNotes);
        setCurrentNoteIndex(newNotes.length - 1);
    };

    const goToPreviousNote = () => {
        if (currentNoteIndex > 0) {
            setCurrentNoteIndex(currentNoteIndex - 1);
        }
    };

    const goToNextNote = () => {
        if (currentNoteIndex < notes.length - 1) {
            setCurrentNoteIndex(currentNoteIndex + 1);
        }
    };

    const deleteNote = () => {
        if (notes.length > 1) {
            const updatedNotes = notes.filter((_, index) => index !== currentNoteIndex);
            setNotes(updatedNotes);

            // Adjust currentNoteIndex if it's out of bounds after deletion
            setCurrentNoteIndex(prevIndex => Math.min(prevIndex, updatedNotes.length - 1));
        }
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex].text = e.target.value;
        setNotes(updatedNotes);
    };

    const isColorDark = (color: string) => {
        // Convert hex color to RGB
        const rgb = parseInt(color.substring(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // If luminance is less than 0.5, color is dark
        return luminance < 0.5;
    };

    const fontColor = isColorDark(notes[currentNoteIndex].color) ? "#F0F0F0" : "#333";
    const arrowColor = isColorDark(notes[currentNoteIndex].color) ? "#F0F0F0" : "#333";

    return (
        <div>
            {/* stickynotes */}
            <div style={{ backgroundColor: notes[currentNoteIndex].color }} className="w-[316px] h-[316px] rounded-[20px]">
                {/* stickynotes child */}
                <div className="" />
                {/* stickynotes item */}
                <div className="" />
                {/* Frame Parent */}
                <div className="bg-white w-[316px] h-[40px] rounded-t-[10px]">
                    {/* icont button parent */}
                    <div className="flex  justify-between justify-center ">
                        {/* icon button */}
                        {/* Delete icon */}
                        <div className="">
                            <button className="bg-transparent w-[40px] h-[40px]" onClick={deleteNote}><DeleteIcon /></button>
                        </div>
                        {/* View all notes button */}
                        <div className="self-center">
                            <div className="">view all notes</div>
                        </div>
                        {/* Add icon */}
                        <div className="">
                            <button className="bg-transparent w-[40px] h-[40px]" onClick={addNote}><AddIcon /></button>
                        </div>
                    </div>
                </div>
                {/* icon button group */}
                <div className="flex justify-between items-center">
                    {/* icon 2 */}
                    <div className="">
                        <button className="bg-transparent w-[40px] h-[40px]" onClick={goToPreviousNote}><ArrowBackIosNewIcon style={{ color: arrowColor }} /></button>
                    </div>
                    <div className="pt-4 bg-transparent resize-none">
                        <TextareaAutosize
                            className="border-transparent bg-transparent w-[220px] h-[230px]"
                            value={notes[currentNoteIndex].text}
                            onChange={handleNoteChange}
                            style={{ resize: "none", color: fontColor, outline: "none", border: "none", width: "220px", height: "230px" }}
                        />
                    </div>
                    {/* icon 3 */}
                    <div className="">
                        <button className="bg-transparent w-[40px] h-[40px]" onClick={goToNextNote}><ArrowForwardIosIcon style={{ color: arrowColor }} /></button>
                    </div>
                </div>
                {/* chevron right filled */}
                <div style={{ color: arrowColor }} className="ml-2">{currentNoteIndex + 1}/{notes.length}</div>
            </div>
        </div>
    );
};

export default NewStickynotes;
import { useState, FunctionComponent } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const NewStickynotes: FunctionComponent = () => {
    const [notes, setNotes] = useState<{ text: string; color: string }[]>([
        { text: "Note 1", color: "#A2D9D1" },
        { text: "Note 2", color: "#6FB0B6" },
        { text: "Note 3", color: "#F7E2B3" }
    ]);
    const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);

    const addNote = () => {
        const colors = ["#A2D9D1", "#6FB0B6", "#F7E2B3", "#E1AB91", "#DE8C73", "#EBEDEC", "#353638"];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        const newNotes = [...notes, { text: "", color: newColor }];
        setNotes(newNotes);
        setCurrentNoteIndex(newNotes.length - 1);
    };

    const goToPreviousNote = () => {
        if (currentNoteIndex > 0) {
            setCurrentNoteIndex(currentNoteIndex - 1);
        }
    };

    const goToNextNote = () => {
        if (currentNoteIndex < notes.length - 1) {
            setCurrentNoteIndex(currentNoteIndex + 1);
        }
    };

    const deleteNote = () => {
        if (notes.length > 1) {
            const updatedNotes = notes.filter((_, index) => index !== currentNoteIndex);
            setNotes(updatedNotes);

            // Adjust currentNoteIndex if it's out of bounds after deletion
            setCurrentNoteIndex(prevIndex => Math.min(prevIndex, updatedNotes.length - 1));
        }
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex].text = e.target.value;
        setNotes(updatedNotes);
    };

    const isColorDark = (color: string) => {
        // Convert hex color to RGB
        const rgb = parseInt(color.substring(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // If luminance is less than 0.5, color is dark
        return luminance < 0.5;
    };

    const fontColor = isColorDark(notes[currentNoteIndex].color) ? "#F0F0F0" : "#333";
    const arrowColor = isColorDark(notes[currentNoteIndex].color) ? "#F0F0F0" : "#333";

    return (
        <div>
            {/* stickynotes */}
            <div style={{ backgroundColor: notes[currentNoteIndex].color, fontFamily: 'Quicksand, sans-serif' }} className="w-[316px] h-[316px] rounded-[20px]">
                {/* stickynotes child */}
                <div className="" />
                {/* stickynotes item */}
                <div className="" />
                {/* Frame Parent */}
                <div className="bg-white w-[316px] h-[40px] rounded-t-[10px]">
                    {/* icont button parent */}
                    <div className="flex  justify-between justify-center ">
                        {/* icon button */}
                        {/* Delete icon */}
                        <div className="">
                            <button className="bg-transparent w-[40px] h-[40px]" onClick={deleteNote}><DeleteIcon /></button>
                        </div>
                        {/* View all notes button */}
                        <div className="self-center">
                            <div className="">View All Notes</div>
                        </div>
                        {/* Add icon */}
                        <div className="">
                            <button className="bg-transparent w-[40px] h-[40px]" onClick={addNote}><AddIcon /></button>
                        </div>
                    </div>
                </div>
                {/* icon button group */}
                <div className="flex justify-between items-center">
                    {/* icon 2 */}
                    <div className="">
                        <button className="bg-transparent w-[40px] h-[40px]" onClick={goToPreviousNote}><ArrowBackIosNewIcon style={{ color: arrowColor }} /></button>
                    </div>
                    <div className="pt-4 bg-transparent resize-none">
                        <TextareaAutosize
                            className="border-transparent bg-transparent w-[220px] h-[230px]"
                            value={notes[currentNoteIndex].text}
                            onChange={handleNoteChange}
                            style={{ resize: "none", color: fontColor, outline: "none", border: "none", width: "220px", height: "230px" }}
                        />
                    </div>
                    {/* icon 3 */}
                    <div className="">
                        <button className="bg-transparent w-[40px] h-[40px]" onClick={goToNextNote}><ArrowForwardIosIcon style={{ color: arrowColor }} /></button>
                    </div>
                </div>
                {/* chevron right filled */}
                <div style={{ color: arrowColor }} className="ml-2">{currentNoteIndex + 1}/{notes.length}</div>
            </div>
        </div>
    );
};

export default NewStickynotes;
