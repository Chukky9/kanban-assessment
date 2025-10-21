import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ProjectShow({ project, tasksByStatus }) {
    const [tasks, setTasks] = useState(tasksByStatus);

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if ((destination.droppableId === source.droppableId) && (destination.index === source.inde)) return;

        const newStatus = destination.droppableId;
        const taskId = parseInt(draggableId);

        // Optimistic update
        const newTasks = { ...tasks };
        const task = newTasks[source.droppableId].find(t => t.id === taskId);
        
        if (task) {
            newTasks[source.droppableId] = newTasks[source.droppableId].filter(t => t.id !== taskId);
            newTasks[newStatus] = [...newTasks[newStatus], { ...task, status: newStatus }];
            setTasks(newTasks);

            fetch(`/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                // Update the task with the server response
                const updatedTask = data.task;
                const finalTasks = { ...newTasks };
                finalTasks[newStatus] = finalTasks[newStatus].map(t => 
                    (t.id === taskId) ? updatedTask : t
                );
                setTasks(finalTasks);
            })
            .catch(error => {
                console.error('Error updating task:', error);
                setTasks(tasksByStatus);
            });
        }
    };

    const columns = [
        { id: 'pending', title: 'Pending', tasks: tasks.pending || [] },
        { id: 'in-progress', title: 'In Progress', tasks: tasks['in-progress'] || [] },
        { id: 'done', title: 'Done', tasks: tasks.done || [] }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={`${project.name} - Kanban Board`} />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-gray-600">{project.description}</p>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {columns.map((column) => (
                                <div key={column.id} className="bg-white rounded-lg shadow">
                                    <div className="p-4 border-b">
                                        <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
                                        <span className="text-sm text-gray-500">({column.tasks.length})</span>
                                    </div>
                                    
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`p-4 min-h-96 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                                            >
                                                {column.tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${
                                                                    snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                                                }`}
                                                            >
                                                                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                                                                {task.description && (
                                                                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                                                )}
                                                                {task.assigned_user && (
                                                                    <div className="text-xs text-blue-600">
                                                                        Assigned to: {task.assigned_user.name}
                                                                        {
                                                                            task.assigned_user.deleted_at && (
                                                                                <span className="text-red-500 ml-1">(Deleted)</span>
                                                                            )
                                                                        }
                                                                    </div>
                                                                )}
                                                                {task.due_date && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}