import React from 'react';

interface SideMenuButtonProps {
    onClick: () => void;
}

export default function SideMenuButton({ onClick }: SideMenuButtonProps) {
    return (
        <div>
            <button onClick={onClick}>Toggle Side Menu</button>
        </div>
    );
}
