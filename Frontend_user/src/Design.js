import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

const SortableItem = ({ id, content, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    margin: '5px 0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    cursor: 'move',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      {content}
    </div>
  );
};

const Design = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const toolItems = [
    { id: 'text', content: 'Click to edit text' },
    { id: 'image', content: <img src="https://via.placeholder.com/100" alt="tool" width="50" /> },
    { id: 'slide', content: 'New Slide' },
    { id: 'banner', content: 'New Banner' },
  ];

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const item = toolItems.find((item) => item.id === active.id);
      if (item) {
        const newElement = { ...item, id: `element-${Date.now()}` };
        setElements([...elements, newElement]);
      }
    }
  };

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleUpdateContent = (e) => {
    if (selectedElement) {
      setElements(
        elements.map((el) =>
          el.id === selectedElement.id ? { ...el, content: e.target.value } : el
        )
      );
    }
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      setElements(elements.filter((el) => el.id !== selectedElement.id));
      setSelectedElement(null);
    }
  };

  return (
    <div className="app">
      <div className="top-bar">
        <button onClick={() => console.log('Save design')}>Save</button>
        <button onClick={() => console.log('Export design')}>Export</button>
        <span>User: [User Name]</span>
      </div>

      <div className="main-container">
        <div className="left-toolbar">
          <h3>Tools</h3>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={toolItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {toolItems.map((item) => (
                <SortableItem key={item.id} id={item.id} content={item.content} onClick={() => handleElementClick(item)} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="canvas-area">
          <div className="canvas">
            {elements.map((element) => (
              <div
                key={element.id}
                className="canvas-element"
                onClick={() => handleElementClick(element)}
                style={{ position: 'absolute', left: '50px', top: '50px' }}
              >
                {typeof element.content === 'string' ? (
                  <input
                    type="text"
                    value={element.content}
                    onChange={handleUpdateContent}
                    disabled={selectedElement?.id !== element.id}
                  />
                ) : (
                  element.content
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="right-toolbar">
          <h3>Properties</h3>
          {selectedElement && (
            <div>
              <label>Content:</label>
              <input
                type="text"
                value={typeof selectedElement.content === 'string' ? selectedElement.content : ''}
                onChange={handleUpdateContent}
              />
              <button onClick={handleDeleteElement}>Delete</button>
              <label>Font Size:</label>
              <input type="number" defaultValue="16" />
              <label>Color:</label>
              <input type="color" defaultValue="#000000" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Design;