"use client";

import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2, Power, Loader } from 'lucide-react';
import FieldWrapper from '../../../ui/FieldWrapper';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Textarea from '../../../ui/TextArea';

const AddVendorPage = ({ onStepChange, onMarkCompleted }) => {
    const [vendors, setVendors] = useState([
        { id: '1', businessName: 'Tech Supplies Inc.', city: 'New York', address: '123 Tech Street', contactPerson: 'John Smith', emailId: 'john001', primaryContactNumber: '+1234567890', secondaryContactNumber: '+1234567891', isActive: true },
        { id: '2', businessName: 'Office Furniture Co.', city: 'Los Angeles', address: '456 Office Blvd', contactPerson: 'Jane Doe', emailId: 'jane002', primaryContactNumber: '+0987654321', secondaryContactNumber: '+0987654322', isActive: true },
        { id: '3', businessName: 'Stationery World', city: 'Chicago', address: '789 Supply Ave', contactPerson: 'Bob Johnson', emailId: 'bob003', primaryContactNumber: '+1122334455', secondaryContactNumber: '+1122334456', isActive: false }
    ]);
    
    const [formData, setFormData] = useState({
        businessName: '',
        city: '',
        address: '',
        contactPerson: '',
        emailId: '',
        primaryContactNumber: '',
        secondaryContactNumber: '',
        isActive: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const paymentTermsOptions = [
        { id: 'net30', name: 'Net 30' },
        { id: 'net60', name: 'Net 60' },
        { id: 'net90', name: 'Net 90' },
        { id: 'immediate', name: 'Immediate' }
    ];

    const filteredVendors = vendors.filter(vendor =>
        vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
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
        
        if (!formData.vendorName || !formData.vendorCode) {
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onMarkCompleted('add-vendor');
            
            // Add new vendor to list
            const newVendor = {
                id: String(vendors.length + 1),
                businessName: formData.businessName,
                city: formData.city,
                address: formData.address,
                contactPerson: formData.contactPerson,
                emailId: formData.emailId,
                primaryContactNumber: formData.primaryContactNumber,
                secondaryContactNumber: formData.secondaryContactNumber,
                isActive: formData.isActive
            };
            setVendors(prev => [...prev, newVendor]);
            
            // Reset form
            setFormData({
                businessName: '',
                city: '',
                address: '',
                contactPerson: '',
                emailId: '',
                primaryContactNumber: '',
                secondaryContactNumber: '',
                isActive: true
            });
        }, 1500);
    };

    const handleCancel = () => {
        setFormData({
            vendorName: '',
            vendorCode: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            paymentTerms: '',
            taxId: '',
            description: '',
            isActive: true
        });
    };

    const handleToggleStatus = (vendorId) => {
        setVendors(prev => prev.map(vendor => 
            vendor.id === vendorId ? { ...vendor, isActive: !vendor.isActive } : vendor
        ));
    };

    const handleEdit = (vendor) => {
        setFormData({
            businessName: vendor.businessName,
            city: vendor.city,
            address: vendor.address,
            contactPerson: vendor.contactPerson,
            emailId: vendor.emailId,
            primaryContactNumber: vendor.primaryContactNumber,
            secondaryContactNumber: vendor.secondaryContactNumber,
            isActive: vendor.isActive
        });
    };

    const handleDelete = (vendorId) => {
        setVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
            {/* Header Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Vendor/Supplier</h1>

            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading vendors...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Business Name */}
                            <div>
                                <FieldWrapper label="Business Name">
                                    <Input
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        placeholder="Enter business name"
                                    />
                                </FieldWrapper>
                            </div>

                            {/* City */}
                            <div>
                                <FieldWrapper label="City">
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                    />
                                </FieldWrapper>
                            </div>

                            {/* Address */}
                            <div>
                                <FieldWrapper label="Address">
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter address"
                                    />
                                </FieldWrapper>
                            </div>

                            {/* Contact Person */}
                            <div>
                                <FieldWrapper label="Contact Person">
                                    <Input
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        placeholder="Enter contact person name"
                                    />
                                </FieldWrapper>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Primary Contact Number */}
                            <div>
                                <FieldWrapper label="Primary Contact Number">
                                    <Input
                                        name="primaryContactNumber"
                                        value={formData.primaryContactNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter primary contact number"
                                    />
                                </FieldWrapper>
                            </div>

                            {/* Secondary Contact Number */}
                            <div>
                                <FieldWrapper label="Secondary Contact Number">
                                    <Input
                                        name="secondaryContactNumber"
                                        value={formData.secondaryContactNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter secondary contact number"
                                    />
                                </FieldWrapper>
                            </div>
                        </div>

                            {/* Email ID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FieldWrapper label="Email ID">
                                    <Input
                                        name="emailId"
                                        value={formData.emailId}
                                        onChange={handleInputChange}
                                        placeholder="Enter email ID"
                                    />
                                </FieldWrapper>
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

                    {/* Vendors List */}
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {filteredVendors.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="font-medium">No vendors found matching your search</p>
                            </div>
                        ) : (
                            filteredVendors.map((vendor, index) => (
                                <div
                                    key={vendor.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-customBlue transition-all"
                                >
                                    {/* Row Number */}
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                    </div>

                                    {/* Vendor Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{vendor.businessName}</p>
                                        {vendor.contactPerson && <p className="text-xs text-gray-500">Contact: {vendor.contactPerson}</p>}
                                        {vendor.city && <p className="text-xs text-gray-500">{vendor.city}</p>}
                                    </div>

                                    {/* Status Toggle */}
                                    <button
                                        onClick={() => handleToggleStatus(vendor.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            vendor.isActive 
                                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        title={vendor.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        <Power size={16} />
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(vendor)}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor.id)}
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

export default AddVendorPage;
