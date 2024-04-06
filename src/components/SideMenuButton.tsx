// SideMenuButton.tsx
import React from 'react';
import { useState } from "react";

interface SideMenuButtonProps {
    onClick: () => void;
}

export default function SideMenuButton({ onClick }: SideMenuButtonProps) {
    return (

        <div className="cursor-pointer relative" onClick={onClick} >

            <img src="dashboardHeaderBackground.svg" className="w-[36px] h-[36px] object-cover" alt="Background" />
            <img
                src="dashboardHeaderList.svg"
                className="w-18 h-18 object-cover absolute inset-0 m-auto"
                alt="List"
            />
        </div>
    );
}
