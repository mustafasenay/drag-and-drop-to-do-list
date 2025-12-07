import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

function Dragable(props) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="draggable-item"
    >
      {props.children}
    </div>
  );
}

export default Dragable;