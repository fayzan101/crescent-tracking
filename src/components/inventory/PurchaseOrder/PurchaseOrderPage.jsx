"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2, X, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import FieldWrapper from '../../ui/FieldWrapper';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Textarea from '../../ui/TextArea';

const PurchaseOrderPage = () => {
    const [orders, setOrders] = useState([
        {
            id: '1',
            store: 'Head Office',
            userId: 'admin@example.com',
            purchasedRequestNo: 'PR001',
            purchaseOrderNo: 'PO001',
            createdOn: '2024-02-20 10:30:00',
            approvalStatus: 'APPROVED',
            deliveryStatus: 'PENDING'
        },
        {
            id: '2',
            store: 'Branch Office',
            userId: 'user@example.com',
            purchasedRequestNo: 'PR002',
            purchaseOrderNo: 'PO002',
            createdOn: '2024-02-18 14:15:00',
            approvalStatus: 'DRAFT',
            deliveryStatus: 'PENDING'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showAddModal, setShowAddModal] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingOffices, setLoadingOffices] = useState(false);
    const [offices, setOffices] = useState([
        { id: '1', branchName: 'Head Office' },
        { id: '2', branchName: 'Branch Office' }
    ]);
    const [items, setItems] = useState([
        { id: '1', name: 'Laptop Dell Latitude', unitOfMeasurement: 'pieces', price: 1200 },
        { id: '2', name: 'Wireless Mouse', unitOfMeasurement: 'pieces', price: 25 }
    ]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [approving, setApproving] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, poId: null });
    const [previewPO, setPreviewPO] = useState(null);

    const [formData, setFormData] = useState({
        office: '',
        officeId: '',
        user: '1 - Admin User',
        userId: '1',
        date: '',
        expectedDeliveryDate: '',
        taxAmount: '',
        shippingCost: '',
        discountAmount: '',
        notes: '',
        poItems: [],
        currentItem: {
            itemId: '',
            itemName: '',
            unitOfMeasurement: '',
            quantityOrdered: 1,
            unitPrice: '',
            totalPrice: ''
        }
    });
    const [loading, setLoading] = useState(false);

    const filteredOrders = orders.filter(order =>
        order.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.purchasedRequestNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.purchaseOrderNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const handlePreview = (order) => {
        setPreviewPO(order);
    };

    const closePreviewModal = () => {
        setPreviewPO(null);
    };

    const handleEdit = (order) => {
        console.log(`Edit functionality for PO #${order.purchaseOrderNo} coming soon`);
    };

    const handleDelete = (poId) => {
        setDeleteModal({ isOpen: true, poId });
    };

    const handleConfirmDelete = async () => {
        const { poId } = deleteModal;
        try {
            setDeleting(poId);
            // Simulate API call
            setTimeout(() => {
                setOrders(prev => prev.filter(order => order.id !== poId));
                setDeleteModal({ isOpen: false, poId: null });
                setDeleting(null);
            }, 1000);
        } catch (error) {
            console.error('Error deleting PO:', error);
            setDeleting(null);
        }
    };

     // Handle quantity input change
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setFormData(prev => ({
      ...prev,
      currentItem: {
        ...prev.currentItem,
        quantityOrdered: value
      }
    }));
  };

  // Handle unit price change and calculate total price
  const handleUnitPriceChange = (e) => {
    const unitPrice = e.target.value;
    const totalPrice = unitPrice && formData.currentItem.quantityOrdered 
      ? (parseFloat(unitPrice) * formData.currentItem.quantityOrdered).toFixed(2)
      : '';
    
    setFormData(prev => ({
      ...prev,
      currentItem: {
        ...prev.currentItem,
        unitPrice,
        totalPrice
      }
    }));
  };

//   // Add item to PO items list
//   const handleAddItem = () => {
//     const { itemId, itemName, quantityOrdered, unitPrice, totalPrice } = formData.currentItem;
    
//     if (!itemId || !itemName) {
//       toast.error('Please select an item');
//       return;
//     }

//     if (!quantityOrdered || quantityOrdered < 1) {
//       toast.error('Quantity must be at least 1');
//       return;
//     }

//     if (!unitPrice || parseFloat(unitPrice) <= 0) {
//       toast.error('Unit price must be greater than 0');
//       return;
//     }

//     if (!totalPrice) {
//       toast.error('Total price is required');
//       return;
//     }

//     // Validate itemId is UUID format (basic check)
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//     if (!uuidRegex.test(itemId)) {
//       console.error('[PurchaseOrderPage] Invalid UUID format for itemId:', itemId);
//       toast.error('Invalid item ID format. Please select a valid item from the list.');
//       return;
//     }

//     console.log('[PurchaseOrderPage] Adding item:', { itemId, itemName, quantityOrdered, unitPrice, totalPrice });
    
//     const newItem = {
//       itemId,
//       itemName,
//       unitOfMeasurement: formData.currentItem.unitOfMeasurement,
//       quantityOrdered: parseInt(quantityOrdered),
//       unitPrice: unitPrice.toString(),
//       totalPrice: totalPrice.toString(),
//       id: Date.now()
//     };

//     setFormData(prev => ({
//       ...prev,
//       poItems: [...prev.poItems, newItem],
//       currentItem: {
//         itemId: '',
//         itemName: '',
//         unitOfMeasurement: '',
//         quantityOrdered: 1,
//         unitPrice: '',
//         totalPrice: ''
//       }
//     }));

//     toast.success('Item added to purchase order');
//   };

  // Remove item from PO items list
//   const handleRemoveItem = (itemId) => {
//     setFormData(prev => ({
//       ...prev,
//       poItems: prev.poItems.filter(item => item.id !== itemId)
//     }));
//   };

  // Handle form submission
  const handleCreatePurchaseOrder = async () => {
    try {
      if (!formData.office || !formData.user || formData.poItems.length === 0) {
        toast.error('Please fill all required fields and add at least one item');
        return;
      }

      setLoading(true);
      
      // Map items to backend format - convert prices to proper decimal strings
      const items = formData.poItems.map(item => {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const totalPrice = parseFloat(item.totalPrice) || 0;
        
        return {
          itemId: item.itemId, // Should be UUID from backend
          quantityOrdered: parseInt(item.quantityOrdered) || 0,
          unitPrice: unitPrice.toFixed(2), // Ensure 2 decimal places
          totalPrice: totalPrice.toFixed(2) // Ensure 2 decimal places
        };
      });

      // Build the request object - only include fields that backend expects
      const poData = {
        officeId: formData.officeId,
        items,
        // Only include optional fields if they have values
        ...(formData.expectedDeliveryDate && { expectedDeliveryDate: formData.expectedDeliveryDate }),
        ...(formData.taxAmount && { taxAmount: parseFloat(formData.taxAmount).toFixed(2) }),
        ...(formData.shippingCost && { shippingCost: parseFloat(formData.shippingCost).toFixed(2) }),
        ...(formData.discountAmount && { discountAmount: parseFloat(formData.discountAmount).toFixed(2) }),
        ...(formData.notes && { notes: formData.notes })
      };

      console.log('[PurchaseOrderPage] Form data before submit:', {
        office: formData.office,
        officeId: formData.officeId,
        user: formData.user,
        userId: formData.userId
      });
      console.log('[PurchaseOrderPage] Submitting PO data:', JSON.stringify(poData, null, 2));

      // Call the purchase order service
      const response = await purchaseOrderService.createPurchaseOrder(poData);
      console.log('[PurchaseOrderPage] PO creation response:', response);
      
      toast.success('Purchase Order created successfully');
      setShowAddModal(false);
      setFormData(prev => ({
        ...prev,
        office: '',
        officeId: '',
        user: '',
        userId: '',
        date: '',
        expectedDeliveryDate: '',
        taxAmount: '',
        shippingCost: '',
        discountAmount: '',
        notes: '',
        poItems: [],
        currentItem: {
          itemId: '',
          itemName: '',
          unitOfMeasurement: '',
          quantityOrdered: 1,
          unitPrice: '',
          totalPrice: ''
        }
      }));
      
      // Refresh the purchase orders list
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error creating PO:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create Purchase Order';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

    const handleCancelDelete = () => {
        setDeleteModal({ isOpen: false, poId: null });
    };

    const handleApprove = async (poId, currentStatus) => {
        try {
            setApproving(poId);
            // Simulate API call
            setTimeout(() => {
                if (currentStatus === 'DRAFT') {
                    console.log('Purchase Order submitted for approval');
                } else if (currentStatus === 'SUBMITTED') {
                    console.log('Purchase Order approved');
                    setOrders(prev => prev.map(order => 
                        order.id === poId ? { ...order, approvalStatus: 'APPROVED' } : order
                    ));
                } else if (currentStatus === 'APPROVED') {
                    console.log('Purchase Order rejected');
                    setOrders(prev => prev.map(order => 
                        order.id === poId ? { ...order, approvalStatus: 'REJECTED' } : order
                    ));
                } else {
                    console.log('This PO cannot be modified in its current status');
                }
                setApproving(null);
            }, 1000);
        } catch (error) {
            console.error('Error updating PO:', error);
            setApproving(null);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleRowSelection = (id) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const toggleAllSelection = () => {
        if (selectedRows.size === currentOrders.length) {
            setSelectedRows(new Set());
        } else {
            const allIds = new Set(currentOrders.map(order => order.id));
            setSelectedRows(allIds);
        }
    };

    const handleIncrement = () => {
        setFormData(prev => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                quantityOrdered: prev.currentItem.quantityOrdered + 1
            }
        }));
    };

    const handleDecrement = () => {
        setFormData(prev => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                quantityOrdered: Math.max(1, prev.currentItem.quantityOrdered - 1)
            }
        }));
    };

    const handleItemChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                [field]: value
            }
        }));
    };

    const calculateTotalPrice = () => {
        const { quantityOrdered, unitPrice } = formData.currentItem;
        return quantityOrdered && unitPrice ? (quantityOrdered * unitPrice).toFixed(2) : '';
    };

    const handleAddItem = () => {
        const { currentItem } = formData;
        if (currentItem.itemId && currentItem.quantityOrdered > 0 && currentItem.unitPrice) {
            const newItem = {
                ...currentItem,
                totalPrice: calculateTotalPrice()
            };
            setFormData(prev => ({
                ...prev,
                poItems: [...prev.poItems, newItem],
                currentItem: {
                    itemId: '',
                    itemName: '',
                    unitOfMeasurement: '',
                    quantityOrdered: 1,
                    unitPrice: '',
                    totalPrice: ''
                }
            }));
        }
    };

    const handleRemoveItem = (index) => {
        setFormData(prev => ({
            ...prev,
            poItems: prev.poItems.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            setTimeout(() => {
                const newOrder = {
                    id: String(orders.length + 1),
                    store: formData.office,
                    userId: formData.user,
                    purchasedRequestNo: `PR${String(orders.length + 1).padStart(3, '0')}`,
                    purchaseOrderNo: `PO${String(orders.length + 1).padStart(3, '0')}`,
                    createdOn: new Date().toLocaleString(),
                    approvalStatus: 'DRAFT',
                    deliveryStatus: 'PENDING'
                };
                setOrders(prev => [newOrder, ...prev]);
                setShowAddModal(false);
                setLoading(false);
                setFormData({
                    office: '',
                    officeId: '',
                    user: '1 - Admin User',
                    userId: '1',
                    date: '',
                    expectedDeliveryDate: '',
                    taxAmount: '',
                    shippingCost: '',
                    discountAmount: '',
                    notes: '',
                    poItems: [],
                    currentItem: {
                        itemId: '',
                        itemName: '',
                        unitOfMeasurement: '',
                        quantityOrdered: 1,
                        unitPrice: '',
                        totalPrice: ''
                    }
                });
            }, 1500);
        } catch (error) {
            console.error('Error creating PO:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
      // Handle modal close
  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData(prev => ({
      ...prev,
      office: '',
      officeId: '',
      user: '',
      userId: '',
      date: '',
      expectedDeliveryDate: '',
      taxAmount: '',
      shippingCost: '',
      discountAmount: '',
      notes: '',
      poItems: [],
      currentItem: {
        itemId: '',
        itemName: '',
        unitOfMeasurement: '',
        quantityOrdered: 1,
        unitPrice: '',
        totalPrice: ''
      }
    }));
  };

    return (
        <div className="bg-white p-8 min-h-screen scrollbar-hide m-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-customBlue/90 transition"
                >
                    <Plus size={20} />
                    <span>Add Purchase Order</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by store, user, PR #, or PO #..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <Filter size={20} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left p-3 font-semibold text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.size === currentOrders.length}
                                    onChange={toggleAllSelection}
                                    className="rounded border-gray-300 text-customBlue focus:ring-customBlue"
                                />
                            </th>
                            <th className="text-left p-3 font-semibold text-gray-700">Store</th>
                            <th className="text-left p-3 font-semibold text-gray-700">User</th>
                            <th className="text-left p-3 font-semibold text-gray-700">PR #</th>
                            <th className="text-left p-3 font-semibold text-gray-700">PO #</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Created On</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Approval Status</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Delivery Status</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(order.id)}
                                        onChange={() => toggleRowSelection(order.id)}
                                        className="rounded border-gray-300 text-customBlue focus:ring-customBlue"
                                    />
                                </td>
                                <td className="p-3 text-sm text-gray-900">{order.store}</td>
                                <td className="p-3 text-sm text-gray-900">{order.userId}</td>
                                <td className="p-3 text-sm text-gray-900">{order.purchasedRequestNo}</td>
                                <td className="p-3 text-sm text-gray-900">{order.purchaseOrderNo}</td>
                                <td className="p-3 text-sm text-gray-900">{order.createdOn}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        order.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        order.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                        order.approvalStatus === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {order.approvalStatus}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        order.deliveryStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        order.deliveryStatus === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.deliveryStatus}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePreview(order)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Preview"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(order)}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} entries
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

           {/* Add New Purchase Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Add New Purchase Order</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
            {/* Top Section - Office, User, Date */}
            <div className="grid grid-cols-3 gap-4">
              {/* Office Field - Dropdown selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office *</label>
                <select
                  value={formData.officeId}
                  onChange={(e) => {
                    const selectedOffice = offices.find(o => o.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      officeId: e.target.value,
                      office: selectedOffice?.branchName || ''
                    }));
                  }}
                  disabled={loadingOffices}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500 bg-white disabled:opacity-50"
                >
                  <option value="">{loadingOffices ? 'Loading...' : 'Select Office'}</option>
                  {offices.map(office => (
                    <option key={office.id} value={office.id}>
                      {office.branchName}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Field - Auto-filled and Disabled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User *</label>
                <input
                  type="text"
                  value={formData.user}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-sm bg-gray-100 cursor-not-allowed"
                  placeholder="Auto"
                />
              </div>

              {/* Date & Time Field - Auto-filled and Disabled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-sm bg-gray-100 cursor-not-allowed"
                  placeholder="Auto"
                />
              </div>
            </div>

            {/* Item Selection Section */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Item SKU / Barcode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item SKU / Barcode</label>
                  <select
                    value={formData.currentItem.itemId}
                    onChange={(e) => {
                      const selectedItem = items.find(item => item.id === e.target.value);
                      setFormData({
                        ...formData,
                        currentItem: {
                          ...formData.currentItem,
                          itemId: e.target.value,
                          itemName: selectedItem?.name || '',
                          unitOfMeasurement: selectedItem?.unitOfMeasurement || ''
                        }
                      });
                    }}
                    disabled={loadingItems}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 disabled:opacity-50"
                  >
                    <option value="">{loadingItems ? 'Loading items...' : 'Type & search'}</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.sku || item.barcode || item.id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <select
                    value={formData.currentItem.itemName}
                    onChange={(e) => {
                      const selectedItem = items.find(item => item.name === e.target.value);
                      setFormData({
                        ...formData,
                        currentItem: {
                          ...formData.currentItem,
                          itemId: selectedItem?.id || '',
                          itemName: e.target.value,
                          unitOfMeasurement: selectedItem?.unitOfMeasurement || ''
                        }
                      });
                    }}
                    disabled={loadingItems}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 disabled:opacity-50"
                  >
                    <option value="">{loadingItems ? 'Loading items...' : 'Type & search'}</option>
                    {items.map(item => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Unit of Measurement - Auto-filled when item is selected */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
                  <input
                    type="text"
                    value={formData.currentItem.unitOfMeasurement}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-sm bg-gray-100 cursor-not-allowed"
                    placeholder="Auto (selected with item)"
                  />
                </div>

                {/* Selected Item ID - For debugging/verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item ID (UUID)</label>
                  <input
                    type="text"
                    value={formData.currentItem.itemId}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-xs bg-gray-100 cursor-not-allowed break-all font-mono"
                    placeholder="Auto (Item UUID)"
                  />
                </div>
              </div>

              {/* Quantity Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Ordered *</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrement}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition font-semibold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={formData.currentItem.quantityOrdered}
                    onChange={handleQuantityChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-center text-gray-700 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                    min="1"
                  />
                  <button
                    onClick={handleIncrement}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price *</label>
                  <input
                    type="number"
                    value={formData.currentItem.unitPrice}
                    onChange={handleUnitPriceChange}
                    placeholder="Enter unit price"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                  />
                </div>

                {/* Total Price - Auto-calculated */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
                  <input
                    type="text"
                    value={formData.currentItem.totalPrice}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 text-sm bg-gray-100 cursor-not-allowed"
                    placeholder="Auto calculated"
                  />
                </div>
              </div>

              {/* Add Item Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAddItem}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition text-sm"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Review Details Section */}
            {formData.poItems.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Review Details</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">S. No.</th>
                        <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Item Name</th>
                        <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Quantity</th>
                        <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Unit Price</th>
                        <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Total Price</th>
                        <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.poItems.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-gray-700 text-sm font-medium">{index + 1}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm">{item.itemName}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm font-semibold">{item.quantityOrdered}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm">{item.unitPrice}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm font-semibold">{item.totalPrice}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition font-bold"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleCloseModal}
              className="border border-gray-300 text-gray-700 font-semibold py-2 px-8 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePurchaseOrder}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-8 rounded-lg transition"
            >
              {loading ? 'Creating...' : 'Add New Purchase Order'}
            </button>
          </div>
        </div>
      </div>
      )}

            {/* Preview Modal */}
            {previewPO && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-semibold text-gray-900">Purchase Order Details</h2>
                            <button
                                onClick={closePreviewModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Store:</p>
                                    <p className="text-sm text-gray-900">{previewPO.store}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">User:</p>
                                    <p className="text-sm text-gray-900">{previewPO.userId}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">PR #:</p>
                                    <p className="text-sm text-gray-900">{previewPO.purchasedRequestNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">PO #:</p>
                                    <p className="text-sm text-gray-900">{previewPO.purchaseOrderNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Created On:</p>
                                    <p className="text-sm text-gray-900">{previewPO.createdOn}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Approval Status:</p>
                                    <p className="text-sm text-gray-900">{previewPO.approvalStatus}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Delivery Status:</p>
                                    <p className="text-sm text-gray-900">{previewPO.deliveryStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this purchase order? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deleting && <Loader size={16} className="animate-spin" />}
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseOrderPage;
