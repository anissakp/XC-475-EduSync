// DashboardHeader.tsx
import React, { useState } from "react";
import SideMenuButton from "./SideMenuButton";


interface DashboardHeaderProps {
    onClick: () => void;
}
export default function DashBoardHeader({ onClick }: DashboardHeaderProps) {

    return (
        <div className="bg-[#EBEDEC] h-[45px] lg:h-[90px] flex pl-[23px]">

            <div><SideMenuButton onClick={onClick} /></div>
            <div><p className="ml-[52px] text-2xl lg:text-4xl font-bold text-[20px] mt-[0.35em] lg:mt-[1.44rem]">Calendar</p></div>

        </div>
    );
}
