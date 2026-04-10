"use client";

import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2, Power, Loader } from 'lucide-react';
import FieldWrapper from '../../../ui/FieldWrapper';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Textarea from '../../../ui/TextArea';

const AddCategoryPage = ({ onStepChange, onMarkCompleted }) => {
    const [categories, setCategories] = useState([
        { id: '1', name: 'Electronics', description: 'Electronic devices and accessories', parentCategory: '', isActive: true },
        { id: '2', name: 'Furniture', description: 'Office furniture and equipment', parentCategory: '', isActive: true },
        { id: '3', name: 'Stationery', description: 'Paper and office supplies', parentCategory: 'Office Supplies', isActive: false }
    ]);
    
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryCode: '',
        description: '',
        parentCategory: '',
        isActive: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const parentCategories = [
        { id: 'electronics', name: 'Electronics' },
        { id: 'furniture', name: 'Furniture' },
        { id: 'stationery', name: 'Stationery' },
        { id: 'office-supplies', name: 'Office Supplies' }
    ];

    const filteredCategories = categories.filter(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        
        if (!formData.categoryName || !formData.categoryCode) {
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onMarkCompleted('add-category');
            
            // Add new category to list
            const newCategory = {
                id: String(categories.length + 1),
                name: formData.categoryName,
                description: formData.description,
                parentCategory: formData.parentCategory,
                isActive: formData.isActive
            };
            setCategories(prev => [...prev, newCategory]);
            
            // Reset form
            setFormData({
                categoryName: '',
                categoryCode: '',
                description: '',
                parentCategory: '',
                isActive: true
            });
        }, 1500);
    };

    const handleCancel = () => {
        setFormData({
            categoryName: '',
            categoryCode: '',
            description: '',
            parentCategory: '',
            isActive: true
        });
    };

    const handleToggleStatus = (categoryId) => {
        setCategories(prev => prev.map(category => 
            category.id === categoryId ? { ...category, isActive: !category.isActive } : category
        ));
    };

    const handleEdit = (category) => {
        setFormData({
            categoryName: category.name,
            categoryCode: category.id,
            description: category.description,
            parentCategory: category.parentCategory,
            isActive: category.isActive
        });
    };

    const handleDelete = (categoryId) => {
        setCategories(prev => prev.filter(category => category.id !== categoryId));
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
            {/* Header Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Category</h1>

            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading categories...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Category Name */}
                            <div>
                                <FieldWrapper label="Category Name">
                                    <Input
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name"
                                    />
                                </FieldWrapper>
                            </div>

                            {/* Parent Category */}
                            <div>
                                <FieldWrapper label="Parent Category">
                                    <select
                                        name="parentCategory"
                                        value={formData.parentCategory}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue text-sm"
                                    >
                                        <option value="">Select parent category (optional)</option>
                                        {parentCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
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

                    {/* Categories List */}
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="font-medium">No categories found matching your search</p>
                            </div>
                        ) : (
                            filteredCategories.map((category, index) => (
                                <div
                                    key={category.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-customBlue transition-all"
                                >
                                    {/* Row Number */}
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                    </div>

                                    {/* Category Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
                                        {category.description && <p className="text-xs text-gray-500">{category.description}</p>}
                                    </div>

                                    {/* Status Toggle */}
                                    <button
                                        onClick={() => handleToggleStatus(category.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            category.isActive 
                                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        title={category.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        <Power size={16} />
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
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

export default AddCategoryPage;
