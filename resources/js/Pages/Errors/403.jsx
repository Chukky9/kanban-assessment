import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Error403() {
    return (
        <AppLayout>
            <Head title="Access Denied" />
            
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                        <p className="mt-2 text-gray-600">
                            You don't have permission to access this resource. Admin privileges are required.
                        </p>
                        
                        <div className="mt-6">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}