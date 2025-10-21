import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import AppLayout from '../../Layouts/AppLayout';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function ReportsIndex({ reports, chartData, auth }) {
    const handleGenerateReports = () => {
        fetch('/reports/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            alert('Report generation started!');
        })
        .catch(error => {
            console.error('Error generating reports:', error);
            alert('Error generating reports');
        });
    };
    return (
        <AppLayout>
            <Head title="Reports" />
            
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <button 
                        onClick={handleGenerateReports}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Generate New Reports
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">📊</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                                        <dd className="text-lg font-medium text-gray-900">{reports.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">✅</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {reports.reduce((sum, report) => sum + report.completed_tasks, 0)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">⏳</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {reports.reduce((sum, report) => sum + report.pending_tasks, 0)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">🔄</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {reports.reduce((sum, report) => sum + report.in_progress_tasks, 0)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion by Project</h3>
                        <div className="h-80">
                            {chartData?.barChart ? (
                                <Bar 
                                    data={chartData.barChart} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Task Completion by Project'
                                            },
                                            legend: {
                                                position: 'top',
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1
                                                }
                                            }
                                        }
                                    }} 
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Task Distribution</h3>
                        <div className="h-80">
                            {chartData?.pieChart ? (
                                <Pie 
                                    data={chartData.pieChart} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Project Task Distribution'
                                            },
                                            legend: {
                                                position: 'bottom',
                                            }
                                        }
                                    }} 
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Line Chart - Full Width */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion Over Time</h3>
                    <div className="h-80">
                        {chartData?.lineChart ? (
                            <Line 
                                data={chartData.lineChart} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Task Completion Over Time'
                                        },
                                        legend: {
                                            position: 'top',
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 1
                                            }
                                        }
                                    }
                                }} 
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Reports Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Reports</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Latest reports for each project
                        </p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <li key={report.id}>
                                <div className="px-4 py-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {report.project.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {report.project.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Last updated: {new Date(report.last_generated_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-500">
                                            <div className="flex space-x-4">
                                                <span>Total: {report.total_tasks}</span>
                                                <span className="text-green-600">Completed: {report.completed_tasks}</span>
                                                <span className="text-yellow-600">Pending: {report.pending_tasks}</span>
                                                <span className="text-orange-600">In Progress: {report.in_progress_tasks}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}