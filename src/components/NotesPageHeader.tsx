// DashboardHeader.tsx
import React, { useState } from "react";
import SideMenuButton from "./SideMenuButton";
import { useNavigate } from "react-router-dom";


interface NotesPageHeaderProps {
    onClick: () => void;
}
export default function NotesPageHeader({ onClick }: NotesPageHeaderProps) {

    const navigate = useNavigate()

    const goToProfile = () => {

        navigate('/EditProfile')
    }

    const handleClick = () => {
        navigate("/dashboard")
    }
<<<<<<< HEAD
    
    return (
        <div className="bg-[#EBEDEC] h-[45px] lg:h-[90px] flex pl-[23px] justify-between items-center">
            <div className="flex gap-4  top-0 z-40">
=======

    return (
        <div className="bg-[#EBEDEC] h-[45px] lg:h-[90px] flex pl-[23px] justify-between items-center">
            <div className="flex gap-4 top-0 z-40">
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
                <div><SideMenuButton onClick={onClick} /></div>
                <button onClick={handleClick} className="bg-[#1E1E26] text-[#D5D2DD]">{"< Dashboard"}</button>

                <div><p className=" text-2xl lg:text-4xl font-bold text-[32px]">Notes</p></div>
            </div>



            <div onClick={goToProfile} className="mr-10 bg-gray-300 h-[40px] w-[40px] rounded-full hover:cursor-pointer" ></div>

        </div>
    );
}
