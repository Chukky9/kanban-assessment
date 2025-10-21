import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function UsersIndex({ users, auth }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'member',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role,
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                reset();
            }
        });
    };

    const handleDelete = (user) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(`/users/${user.id}`);
        }
    };

    const handleRestore = (user) => {
        if (confirm('Are you sure you want to restore this user?')) {
            // We'll need to add a restore route
            patch(`/users/${user.id}/restore`, {
                onSuccess: () => {
                    // router.reload();
                }
            });
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            member: 'bg-blue-100 text-blue-800'
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role]}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Users" />
            
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create New User
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <li key={user.id} className={`${user.deleted_at ? 'bg-gray-50 opacity-75' : ''}`}>
                                <div className="px-4 py-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                    {user.deleted_at && <span className="text-gray-500 ml-2">(Deleted)</span>}
                                                </p>
                                                {
                                                    getRoleBadge(user.role)
                                                }
                                            </div>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        {/* User Stats */}
                                        <div className="text-sm text-gray-500">
                                            <div className="flex space-x-4">
                                                <span>Tasks: {user.stats.total_tasks}</span>
                                                <span>Completed: {user.stats.completed_tasks}</span>
                                                <span>Pending: {user.stats.pending_tasks}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex space-x-2">
                                            {user.deleted_at ? (
                                                <button 
                                                    onClick={() => handleRestore(user)}
                                                    className="text-green-600 hover:text-green-900 text-sm"
                                                >
                                                    Restore
                                                </button>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => handleEdit(user)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user)}
                                                        className="text-red-600 hover:text-red-900 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
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
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
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
                                        {processing ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
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
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password (leave blank to keep current)
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingUser(null);
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
                                        {processing ? 'Updating...' : 'Update User'}
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