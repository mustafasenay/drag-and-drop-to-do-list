import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props) {
  const {isOver, setNodeRef, active} = useDroppable({
    id: props.id,
  });
  
  const style = {
    backgroundColor: isOver ? '#f8f9fa' : 'transparent',
    border: isOver ? '2px dashed #007bff' : '2px dashed transparent',
    borderRadius: '8px',
    minHeight: '400px',
    transition: 'all 0.2s ease',
    padding: isOver ? '1.5rem' : '1rem',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="droppable-zone"
    >
      {props.children}
    </div>
  );
}

export default Droppable;