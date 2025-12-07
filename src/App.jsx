import React, {useState, useEffect} from 'react';
import {DndContext} from '@dnd-kit/core';
import Dragable from './components/Dragable';
import {Droppable} from './components/Droppable';

function App() {
  // LocalStorage'dan task'ları yükle
  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return [];
      }
    }
    // Eğer localStorage'da yoksa başlangıç task'larını döndür
    return [
      {id: 'task-1', content: 'Fix login bug', status: 'todo'},
      {id: 'task-2', content: 'Add dark mode', status: 'todo'},
      {id: 'task-3', content: 'Update documentation', status: 'in-progress'},
      {id: 'task-4', content: 'Deploy to production', status: 'done'},
    ];
  };

  const [tasks, setTasks] = useState(loadTasksFromLocalStorage);
  const [newTaskContent, setNewTaskContent] = useState('');

  const columns = [
    {id: 'todo', title: 'TODO'},
    {id: 'in-progress', title: 'IN PROGRESS'},
    {id: 'done', title: 'DONE'},
  ];

  // Task'lar değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sayfa yüklendiğinde task'ları kontrol et (opsiyonel)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'kanban-tasks') {
        try {
          const newTasks = JSON.parse(e.newValue);
          setTasks(newTasks);
        } catch (error) {
          console.error('Error parsing tasks from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: newTaskContent,
      status: 'todo'
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskContent('');
  };

  const handleDeleteAllTasks = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTasks([]);
      localStorage.removeItem('kanban-tasks');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset to default tasks? Your current tasks will be lost.')) {
      const defaultTasks = [
        {id: 'task-1', content: 'Fix login bug', status: 'todo'},
        {id: 'task-2', content: 'Add dark mode', status: 'todo'},
        {id: 'task-3', content: 'Update documentation', status: 'in-progress'},
        {id: 'task-4', content: 'Deploy to production', status: 'done'},
      ];
      setTasks(defaultTasks);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container mt-4">
        {/* Yeni Task Ekleme Formu */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Yeni Task Ekle</h5>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-light"
                    onClick={handleResetToDefault}
                    title="Reset to default tasks"
                  >
                    Yenile
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-light"
                    onClick={handleDeleteAllTasks}
                    title="Delete all tasks"
                  >
                    Hepsimi Temizle
                  </button>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddTask}>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="taskContent"
                        placeholder="task açıklaması girin..."
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-end">
                      <button type="submit" className="btn btn-small btn-primary w-100">
                        Task Ekle
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-text">
                        <br />
                        <small>Toplam tasklar: {tasks.length}</small>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="row">
          {columns.map(column => (
            <div className="col-md-4 mb-4" style={{margin: '5px', justifyContent: 'space-around', width: '32%'}} key={column.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{column.title}</h5>
                </div>
                <div className="card-body p-3">
                  <Droppable id={column.id}>
                    {tasks
                      .filter(task => task.status === column.id)
                      .map(task => (
                        <Dragable key={task.id} id={task.id}>
                          <div className="card mb-3 shadow-sm border">
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="task-content flex-grow-1">
                                  {task.content}
                                </div>
                              </div>
                              <div className="text-muted small mt-2">
                                <small>ID: {task.id.substring(0, 8)}...</small>
                              </div>
                            </div>
                          </div>
                        </Dragable>
                      ))}
                    {tasks.filter(task => task.status === column.id).length === 0 && (
                      <div className="text-center text-muted py-5 border rounded">
                        <div className="mb-2">
                          <i className="bi bi-inbox" style={{fontSize: '2rem'}}></i>
                        </div>
                        Buraya sürükle
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );

  function handleDragEnd({active, over}) {
    if (over) {
      setTasks(tasks => 
        tasks.map(task => 
          task.id === active.id ? {...task, status: over.id} : task
        )
      );
    }
  }
}

export default App;