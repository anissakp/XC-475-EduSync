import React, { useState, useRef, useEffect } from 'react';

const StickyNote: React.FC<{ onClone: () => void }> = ({ onClone }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 1080, y: 550 });
  const stickyNoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offsetX,
          y: e.clientY - offsetY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offsetX, offsetY]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    const boundingRect = stickyNoteRef.current!.getBoundingClientRect();
    setOffsetX(e.clientX - boundingRect.left);
    setOffsetY(e.clientY - boundingRect.top);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isDragging) {
      localStorage.setItem('stickyNoteContent', e.target.value);
    }
  };

  const handleLoadContent = () => {
    const storedNoteContent = localStorage.getItem('stickyNoteContent');
    if (storedNoteContent && stickyNoteRef.current) {
      stickyNoteRef.current.querySelector('textarea')!.value = storedNoteContent;
    }
  };

  return (
    <div
      ref={stickyNoteRef}
      className="absolute w-[273px] h-[273px] resize-both overflow-auto"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onClone();
      }}
    >
      <textarea
        className={`bg-[url(./assets/Stickynote-yellow.png)] w-full h-full p-2 ${isDragging ? 'pointer-events-none' : 'pointer-events-auto'}`}
        contentEditable={!isDragging}
        onChange={handleInputChange}
        onLoad={handleLoadContent}
      ></textarea>
    </div>
  );
};

export default StickyNote;