// SideMenuButton.tsx
import React from 'react';
import { useState } from "react";

interface SideMenuButtonProps {
    onClick: () => void;
}

export default function SideMenuButton({ onClick }: SideMenuButtonProps) {
    return (
        <div className="cursor-pointer mt-[27px]" onClick={onClick} >
            <img src="dashboardHeaderBackground.svg" className="absolute  w-[36px] h-[36px] object-cover" alt="Background" />
            <img src="dashboardHeaderList.svg" className="absolute w-[18px] h-[18px] object-cover mt-[9px] ml-[9px]" alt="List" />
        </div>
    );
}
