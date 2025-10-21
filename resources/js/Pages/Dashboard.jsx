import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ projects }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Dashboard" />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
                        <div className="space-x-4">
                            <Link 
                                href="/reports" 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                View Reports
                            </Link>
                            <button 
                                onClick={() => {
                                    fetch('/reports/generate', { method: 'POST' })
                                        .then(() => alert('Report generation started!'))
                                        .catch(() => alert('Error generating reports'));
                                }}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Generate Reports
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-6">
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
                                    
                                    <Link 
                                        href={`/projects/${project.id}`}
                                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center"
                                    >
                                        View Kanban Board
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}