import NotesPageHeader from "../components/NotesPageHeader";
import { useContext, useState, useEffect } from "react";



export default function NotesPage() {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    return (
        <div className="bg-black">
            <NotesPageHeader onClick={toggleSideMenu} />
            <div>
                <p>this is notes page</p>
            </div>
        </div>

    )
}

