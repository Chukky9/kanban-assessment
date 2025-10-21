import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AppLayout from '../../Layouts/AppLayout';

export default function ProjectShow({ project, tasksByStatus, users, auth }) {
    const [tasks, setTasks] = useState(tasksByStatus);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        project_id: project.id,
        status: 'pending',
    });

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        const taskId = parseInt(draggableId);

        // Optimistic update
        const newTasks = { ...tasks };
        const task = newTasks[source.droppableId].find(t => t.id === taskId);
        
        if (task) {
            newTasks[source.droppableId] = newTasks[source.droppableId].filter(t => t.id !== taskId);
            newTasks[newStatus] = [...newTasks[newStatus], { ...task, status: newStatus }];
            setTasks(newTasks);

            // Update on server using fetch instead of router.patch
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
                    t.id === taskId ? updatedTask : t
                );
                setTasks(finalTasks);
            })
            .catch(error => {
                console.error('Error updating task:', error);
                // Revert on error
                setTasks(tasksByStatus);
            });
        }
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
                // Use router.visit to refresh the current page
                router.visit(`/projects/${project.id}`, {
                    only: ['project', 'tasksByStatus', 'users']
                });
            }
        });
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            assigned_to: task.assigned_to || '',
            due_date: task.due_date || '',
        });
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        put(`/tasks/${editingTask.id}`, {
            onSuccess: () => {
                setEditingTask(null);
                reset();
                // Use router.visit to refresh the current page
                router.visit(`/projects/${project.id}`, {
                    only: ['project', 'tasksByStatus', 'users']
                });
            }
        });
    };

    const handleDeleteTask = (task) => {
        if (confirm('Are you sure you want to delete this task?')) {
            destroy(`/tasks/${task.id}`, {
                onSuccess: () => {
                    // Use router.visit to refresh the current page
                    router.visit(`/projects/${project.id}`, {
                        only: ['project', 'tasksByStatus', 'users']
                    });
                }
            });
        }
    };

    const columns = [
        { id: 'pending', title: 'Pending', tasks: tasks.pending || [] },
        { id: 'in-progress', title: 'In Progress', tasks: tasks['in-progress'] || [] },
        { id: 'done', title: 'Done', tasks: tasks.done || [] }
    ];

    return (
        <AppLayout>
            <Head title={`${project.name} - Kanban Board`} />
            
            <div className="px-4 py-6 sm:px-0">
                {/* Back button and header */}
                <div className="flex items-center mb-6">
                    <Link 
                        href="/projects" 
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-gray-600">{project.description}</p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Task
                    </button>
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
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                                <div className="flex space-x-1">
                                                                    <button 
                                                                        onClick={() => handleEditTask(task)}
                                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteTask(task)}
                                                                        className="text-red-600 hover:text-red-900 text-sm"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {task.description && (
                                                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                                            )}
                                                            {task.assigned_user && (
                                                                <div className="text-xs text-blue-600 mb-1">
                                                                    Assigned to: {task.assigned_user.name}
                                                                </div>
                                                            )}
                                                            {task.due_date && (
                                                                <div className="text-xs text-gray-500">
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

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
                            <form onSubmit={handleCreateTask}>
                                <input type="hidden" name="project_id" value={project.id} />
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign To
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.assigned_to}
                                        onChange={(e) => setData('assigned_to', e.target.value)}
                                    >
                                        <option value="">Select a user</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            reset();
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h3>
                            <form onSubmit={handleUpdateTask}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign To
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.assigned_to}
                                        onChange={(e) => setData('assigned_to', e.target.value)}
                                    >
                                        <option value="">Select a user</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTask(null);
                                            reset();
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}