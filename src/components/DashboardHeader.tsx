// DashboardHeader.tsx
import React, { useState } from "react";
import SideMenuButton from "./SideMenuButton";
import { useNavigate } from "react-router-dom";


interface DashboardHeaderProps {
    onClick: () => void;
}
export default function DashBoardHeader({ onClick }: DashboardHeaderProps) {

    const navigate = useNavigate()

    const goToProfile = () => {

        navigate('/EditProfile')
    }

    return (
        <div className="bg-[#EBEDEC] h-[45px] lg:h-[90px] flex pl-[23px] justify-between items-center">

            <div className="flex">
                <div><SideMenuButton onClick={onClick} /></div>
                <div><p className="ml-4 text-2xl lg:text-4xl font-bold text-[32px]">Calendar</p></div>
            </div>



            <div onClick={goToProfile} className="mr-10 bg-gray-300 h-[40px] w-[40px] rounded-full hover:cursor-pointer" ></div>

        </div>
    );
}
