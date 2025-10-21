import React from 'react';
import { Head } from '@inertiajs/react';

export default function ReportsIndex({ reports }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Reports" />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Project Reports</h1>
                        <button 
                            onClick={() => {
                                fetch('/reports/generate', { method: 'POST' })
                                    .then(() => alert('Report generation started!'))
                                    .catch(() => alert('Error generating reports'));
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Generate New Reports
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((reportData) => (
                            <div key={reportData.project.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        {reportData.project.name}
                                    </h3>
                                    
                                    {reportData.report ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Tasks:</span>
                                                <span className="font-semibold">{reportData.report.total_tasks}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Completed:</span>
                                                <span className="font-semibold text-green-600">{reportData.report.completed_tasks}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Pending:</span>
                                                <span className="font-semibold text-yellow-600">{reportData.report.pending_tasks}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">In Progress:</span>
                                                <span className="font-semibold text-orange-600">{reportData.report.in_progress_tasks}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-4">
                                                Last Generated: {new Date(reportData.report.last_generated_at).toLocaleString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">
                                            No report generated yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}