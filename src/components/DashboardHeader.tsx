// DashboardHeader.tsx
import React, { useState } from "react";
import SideMenuButton from "./SideMenuButton";


interface DashboardHeaderProps {
    onClick: () => void;
}
export default function DashBoardHeader({ onClick }: DashboardHeaderProps) {

    return (
        <div className="bg-[#EBEDEC] h-[90px] flex pl-[23px]">
            <SideMenuButton onClick={onClick} />
            <p className="ml-[52px] font-bold text-[32px] mt-[20px]">Calendar</p>
        </div>
    );
}
