"use client";

import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2, Power, Loader } from 'lucide-react';
import FieldWrapper from '../../../ui/FieldWrapper';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Textarea from '../../../ui/TextArea';

const AddStorePage = ({ onStepChange, onMarkCompleted }) => {
    const [stores, setStores] = useState([
        { id: '1', name: 'Main Store', location: 'Building A', officeId: '1', isActive: true },
        { id: '2', name: 'Warehouse', location: 'Building B', officeId: '2', isActive: true },
        { id: '3', name: 'Storage Unit', location: 'Building C', officeId: '1', isActive: false }
    ]);
    
    const [formData, setFormData] = useState({
        storeName: '',
        storeCode: '',
        location: '',
        managerName: '',
        contactNumber: '',
        email: '',
        address: '',
        description: '',
        capacity: '',
        isActive: true,
        officeId: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const offices = [
        { id: '1', name: 'Head Office' },
        { id: '2', name: 'Branch Office' }
    ];

    const filteredStores = stores.filter(store =>
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.storeName || !formData.storeCode || !formData.location) {
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onMarkCompleted('add-store');
            
            // Add new store to list
            const newStore = {
                id: String(stores.length + 1),
                name: formData.storeName,
                location: formData.location,
                officeId: formData.officeId,
                isActive: formData.isActive
            };
            setStores(prev => [...prev, newStore]);
            
            // Reset form
            setFormData({
                storeName: '',
                storeCode: '',
                location: '',
                managerName: '',
                contactNumber: '',
                email: '',
                address: '',
                description: '',
                capacity: '',
                isActive: true,
                officeId: ''
            });
        }, 1500);
    };

    const handleCancel = () => {
        setFormData({
            storeName: '',
            storeCode: '',
            location: '',
            managerName: '',
            contactNumber: '',
            email: '',
            address: '',
            description: '',
            capacity: '',
            isActive: true,
            officeId: ''
        });
    };

    const handleToggleStatus = (storeId) => {
        setStores(prev => prev.map(store => 
            store.id === storeId ? { ...store, isActive: !store.isActive } : store
        ));
    };

    const handleEdit = (store) => {
        setFormData({
            storeName: store.name,
            storeCode: store.id,
            location: store.location,
            officeId: store.officeId,
            isActive: store.isActive
        });
    };

    const handleDelete = (storeId) => {
        setStores(prev => prev.filter(store => store.id !== storeId));
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
            {/* Header Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Store</h1>

            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading stores...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Store Name */}
                            <div>
                                <FieldWrapper label="Store Name">
                                    <Input
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleInputChange}
                                        placeholder="Enter store name"
                                    />
                                </FieldWrapper>
                            </div>

                            {/* Office Dropdown */}
                            <div>
                                <FieldWrapper label="Select Office">
                                    <select
                                        name="officeId"
                                        value={formData.officeId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue text-sm"
                                    >
                                        <option value="">Select Office</option>
                                        {offices.map((office) => (
                                            <option key={office.id} value={office.id}>
                                                {office.name}
                                            </option>
                                        ))}
                                    </select>
                                </FieldWrapper>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleCancel}
                                className="px-10 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-10 py-3 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader size={18} className="animate-spin" />}
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Search Section */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-customBlue bg-white text-gray-700 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Stores List */}
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {filteredStores.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="font-medium">No stores found matching your search</p>
                            </div>
                        ) : (
                            filteredStores.map((store, index) => (
                                <div
                                    key={store.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-customBlue transition-all"
                                >
                                    {/* Row Number */}
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                    </div>

                                    {/* Store Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p>
                                        {store.location && <p className="text-xs text-gray-500">{store.location}</p>}
                                    </div>

                                    {/* Status Toggle */}
                                    <button
                                        onClick={() => handleToggleStatus(store.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            store.isActive 
                                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        title={store.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        <Power size={16} />
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(store)}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(store.id)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AddStorePage;
