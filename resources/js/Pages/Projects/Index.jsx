import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ProjectsIndex({ projects, auth }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setData({
            name: project.name,
            description: project.description || '',
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/projects/${editingProject.id}`, {
            onSuccess: () => {
                setEditingProject(null);
                reset();
            }
        });
    };

    const handleDelete = (project) => {
        if (confirm('Are you sure you want to delete this project?')) {
            destroy(`/projects/${project.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Projects" />
            
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg h-full">
                            <div className="p-6 flex flex-col justify-between h-full">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {project.name}
                                </h3>
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{project.stats.total_tasks}</div>
                                        <div className="text-sm text-gray-500">Total Tasks</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{project.stats.completed_tasks}</div>
                                        <div className="text-sm text-gray-500">Completed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">{project.stats.pending_tasks}</div>
                                        <div className="text-sm text-gray-500">Pending</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">{project.stats.in_progress_tasks}</div>
                                        <div className="text-sm text-gray-500">In Progress</div>
                                    </div>
                                </div>
                                
                                {/* Action buttons at the bottom */}
                                <div className="px-1">
                                    <div className="flex gap-3">
                                        <Link 
                                            href={`/projects/${project.id}`}
                                            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-1 text-sm rounded text-center"
                                        >
                                            View Board
                                        </Link>
                                        <button 
                                            onClick={() => handleEdit(project)}
                                            className="flex-1 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-1 text-sm rounded"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(project)}
                                            className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-1 text-sm rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                                        {processing ? 'Creating...' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {editingProject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Project</h3>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProject(null);
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
                                        {processing ? 'Updating...' : 'Update Project'}
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