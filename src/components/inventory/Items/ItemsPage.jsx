"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2, X, Upload, Loader } from 'lucide-react';
import FieldWrapper from '../../ui/FieldWrapper';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Textarea from '../../ui/TextArea';

const ItemsPage = () => {
    const [items, setItems] = useState([
        {
            id: '1',
            name: 'Laptop Dell Latitude',
            sku: 'LP001',
            barcode: '1234567890',
            categoryId: '1',
            groupId: '1',
            unitOfMeasurement: 'pieces',
            initialPrice: 1200,
            reorderLevel: 5,
            reorderQuantity: 10,
            description: 'Business laptop with 16GB RAM',
            imagePath: null
        },
        {
            id: '2',
            name: 'Wireless Mouse',
            sku: 'MS001',
            barcode: '2345678901',
            categoryId: '2',
            groupId: '2',
            unitOfMeasurement: 'pieces',
            initialPrice: 25,
            reorderLevel: 20,
            reorderQuantity: 50,
            description: 'Ergonomic wireless mouse',
            imagePath: null
        }
    ]);

    const [categories] = useState([
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Accessories' },
        { id: '3', name: 'Furniture' }
    ]);

    const [groups] = useState([
        { id: '1', name: 'Computers' },
        { id: '2', name: 'Peripherals' },
        { id: '3', name: 'Office Equipment' }
    ]);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        sku: '',
        categoryId: '',
        groupId: '',
        unitOfMeasurement: '',
        expiryDays: '',
        servicePeriod: '',
        price: '',
        description: '',
        reorderLevel: '',
        reorderQuantity: '',
        image: null,
        id: null
    });

    const displayItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || 'N/A';
    };

    const getGroupName = (groupId) => {
        const group = groups.find(grp => grp.id === groupId);
        return group?.name || 'N/A';
    };

    const handlePreview = (item) => {
        setPreviewItem(item);
    };

    const closePreviewModal = () => {
        setPreviewItem(null);
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || '',
            barcode: item.barcode || '',
            sku: item.sku || '',
            categoryId: item.categoryId || '',
            groupId: item.groupId || '',
            unitOfMeasurement: item.unitOfMeasurement || '',
            expiryDays: '',
            servicePeriod: '',
            price: item.initialPrice || '',
            description: item.description || '',
            reorderLevel: item.reorderLevel || '',
            reorderQuantity: item.reorderQuantity || '',
            image: null,
            id: item.id
        });
        setShowAddModal(true);
    };

    const handleDelete = (itemId, itemName) => {
        setDeleteConfirm({ id: itemId, name: itemName });
    };

    const confirmDelete = () => {
        if (!deleteConfirm) return;

        const { id: itemId, name: itemName } = deleteConfirm;

        try {
            setDeleting(itemId);
            // Simulate API call
            setTimeout(() => {
                setItems(prev => prev.filter(item => item.id !== itemId));
                setDeleteConfirm(null);
                setDeleting(null);
            }, 1000);
        } catch (error) {
            setDeleting(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleAddItemClick = () => {
        setFormData({
            name: '',
            barcode: '',
            sku: '',
            categoryId: '',
            groupId: '',
            unitOfMeasurement: '',
            expiryDays: '',
            servicePeriod: '',
            price: '',
            description: '',
            reorderLevel: '',
            reorderQuantity: '',
            image: null,
            id: null
        });
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setFormData({
            name: '',
            barcode: '',
            sku: '',
            categoryId: '',
            groupId: '',
            unitOfMeasurement: '',
            expiryDays: '',
            servicePeriod: '',
            price: '',
            description: '',
            reorderLevel: '',
            reorderQuantity: '',
            image: null,
            id: null
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmitForm = async () => {
        if (!formData.name || !formData.barcode || !formData.sku || !formData.categoryId) {
            return;
        }

        try {
            setSubmitting(true);

            const itemData = {
                name: formData.name,
                barcode: formData.barcode,
                sku: formData.sku,
                categoryId: formData.categoryId,
                groupId: formData.groupId || null,
                unitOfMeasurement: formData.unitOfMeasurement,
                initialPrice: parseFloat(formData.price) || null,
                description: formData.description,
                reorderLevel: parseInt(formData.reorderLevel) || 0,
                reorderQuantity: parseInt(formData.reorderQuantity) || 0
            };

            if (formData.id) {
                // Update existing item
                setItems(prev => prev.map(item => 
                    item.id === formData.id ? { ...item, ...itemData } : item
                ));
            } else {
                // Add new item
                const newItem = {
                    ...itemData,
                    id: Date.now().toString()
                };
                setItems(prev => [...prev, newItem]);
            }

            handleCloseModal();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 min-h-screen scrollbar-hide m-5 rounded-lg">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-80 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search Item"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-customBlue text-sm text-gray-700"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleAddItemClick}
                            className="flex items-center gap-2 px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90">
                            <Plus size={18} />
                            Add New Item
                        </button>
                        <button className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-8 text-gray-500 flex items-center justify-center gap-2">
                        <Loader className="animate-spin" size={20} />
                        Loading items...
                    </div>
                ) : displayItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No items found</div>
                ) : (
                    <>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Item Name</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Image</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">SKU / Barcode</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Category</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Unit</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Price</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Reorder Level</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayItems.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-4 text-gray-900 font-medium text-sm">{item.name}</td>
                                        <td className="px-4 py-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 text-sm">{item.sku} / {item.barcode}</td>
                                        <td className="px-4 py-4 text-gray-700 text-sm">{getCategoryName(item.categoryId)}</td>
                                        <td className="px-4 py-4 text-gray-700 text-sm">{item.unitOfMeasurement}</td>
                                        <td className="px-4 py-4 text-gray-900 font-medium text-sm">${item.initialPrice || 0}</td>
                                        <td className="px-4 py-4 text-gray-700 text-sm">{item.reorderLevel}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2 justify-center">
                                                <button onClick={() => handlePreview(item)} className="w-8 h-8 rounded-md bg-yellow-400 flex items-center justify-center hover:bg-yellow-500" title="Preview">
                                                    <Eye size={16} className="text-white" />
                                                </button>
                                                <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center hover:bg-blue-600" title="Edit">
                                                    <Edit2 size={16} className="text-white" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id, item.name)} disabled={deleting === item.id} className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center hover:bg-red-600 disabled:opacity-50" title="Delete">
                                                    {deleting === item.id ? <Loader size={16} className="text-white animate-spin" /> : <Trash2 size={16} className="text-white" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-300">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">Per page</span>
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                                <span className="text-sm text-gray-700">Total: {items.length}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">‹</button>
                                <button className="w-8 h-8 rounded-lg font-semibold bg-customBlue text-white">1</button>
                                <button onClick={() => setCurrentPage(currentPage + 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">›</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-base font-semibold">{formData.id ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <FieldWrapper label="Item Name *" className="text-xs">
                                            <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter item name" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="SKU *" className="text-xs">
                                            <Input name="sku" value={formData.sku} onChange={handleFormChange} placeholder="Enter SKU" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Barcode *" className="text-xs">
                                            <Input name="barcode" value={formData.barcode} onChange={handleFormChange} placeholder="Enter Barcode" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Category *" className="text-xs">
                                            <Select name="categoryId" value={formData.categoryId} onChange={handleFormChange} className="text-sm">
                                                <option value="">Select category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Item Group" className="text-xs">
                                            <Select name="groupId" value={formData.groupId} onChange={handleFormChange} className="text-sm">
                                                <option value="">Select group</option>
                                                {groups.map((group) => (
                                                    <option key={group.id} value={group.id}>
                                                        {group.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Unit" className="text-xs">
                                            <Select name="unitOfMeasurement" value={formData.unitOfMeasurement} onChange={handleFormChange} className="text-sm">
                                                <option value="">Select</option>
                                                <option value="pieces">Pieces</option>
                                                <option value="kg">Kg</option>
                                                <option value="box">Box</option>
                                            </Select>
                                        </FieldWrapper>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <FieldWrapper label="Price" className="text-xs">
                                            <Input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="0.00" step="0.01" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Reorder Level" className="text-xs">
                                            <Input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleFormChange} placeholder="0" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Reorder Qty" className="text-xs">
                                            <Input type="number" name="reorderQuantity" value={formData.reorderQuantity} onChange={handleFormChange} placeholder="0" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Expiry Days" className="text-xs">
                                            <Input type="number" name="expiryDays" value={formData.expiryDays} onChange={handleFormChange} placeholder="Days" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Service Period" className="text-xs">
                                            <Input type="number" name="servicePeriod" value={formData.servicePeriod} onChange={handleFormChange} placeholder="365" className="text-sm" />
                                        </FieldWrapper>
                                    </div>

                                    <div>
                                        <FieldWrapper label="Image" className="text-xs">
                                            <div className="border border-gray-300 rounded-sm p-4 text-center hover:border-customBlue cursor-pointer relative bg-gray-50">
                                                <input type="file" name="image" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                <div className="flex flex-col items-center gap-1">
                                                    <Upload size={16} className="text-gray-400" />
                                                    <p className="text-xs text-gray-500">Choose file</p>
                                                </div>
                                            </div>
                                        </FieldWrapper>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <FieldWrapper label="Description" className="text-xs">
                                    <Textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" rows="3" className="text-sm resize-none" />
                                </FieldWrapper>
                            </div>

                            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6">
                                <button onClick={handleCloseModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
                                <button onClick={handleSubmitForm} disabled={submitting} className="px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90 disabled:opacity-50 flex items-center gap-2">
                                    {submitting && <Loader size={16} className="animate-spin" />}
                                    {formData.id ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={cancelDelete} 
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                disabled={deleting === deleteConfirm.id}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting === deleteConfirm.id && <Loader size={16} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Item Preview</h3>
                            <button onClick={closePreviewModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Name:</span>
                                <p className="text-gray-900">{previewItem.name}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">SKU/Barcode:</span>
                                <p className="text-gray-900">{previewItem.sku} / {previewItem.barcode}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Category:</span>
                                <p className="text-gray-900">{getCategoryName(previewItem.categoryId)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Price:</span>
                                <p className="text-gray-900">${previewItem.initialPrice || 0}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Description:</span>
                                <p className="text-gray-900">{previewItem.description || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={closePreviewModal} className="px-4 py-2 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemsPage;
