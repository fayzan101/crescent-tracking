'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, X, Minus, Loader } from 'lucide-react';

const PurchaseRequestPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [approving, setApproving] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stores, setStores] = useState([]);
  const [storesByOffice, setStoresByOffice] = useState([]); // Dynamic stores for selected office
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [offices, setOffices] = useState([]);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [purchaseRequestItems, setPurchaseRequestItems] = useState([]);
  const [user, setUser] = useState(null);
  const [office, setOffice] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, requestId: null });
  const [purchaseFormData, setPurchaseFormData] = useState({
    officeId: '', // Add officeId to form
    storeId: '', // Add storeId to form
    itemSku: '',
    itemId: '',
    itemName: '',
    unitOfMeasurement: '',
    quantity: 1
  });

  useEffect(() => {
    fetchRequests();
    fetchStores();
    fetchItems();
    loadUserAndOffice();
  }, []);

  const loadUserAndOffice = () => {
    try {
      // Get current user from localStorage or auth context
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('[PurchaseRequestPage] Raw user data from localStorage:', userData);
      setUser(userData);
      
      // Extract office info from user data - office is stored in nested object
      let officeData = { 
        id: null,
        name: 'N/A',
        branchName: 'N/A'
      };
      
      // Try different possible paths for office data
      if (userData?.office?.id) {
        officeData.id = userData.office.id;
        officeData.branchName = userData.office.branchName || userData.office.name || 'Auto';
        officeData.name = userData.office.branchName || userData.office.name || 'Auto';
      } else if (userData?.officeId) {
        officeData.id = userData.officeId;
        officeData.name = userData.officeName || 'Auto';
      }
      
      console.log('[PurchaseRequestPage] Office data extracted:', officeData);
      setOffice(officeData);
      setOffices(officeData.id ? [officeData] : []);
      setPurchaseFormData(prev => ({
        ...prev,
        officeId: officeData.id || ''
      }));
      setStoresByOffice([]);
      setLoadingOffices(false);
      console.log('[PurchaseRequestPage] User and office data loaded:', { userId: userData?.id, office: officeData });
    } catch (error) {
      console.error('Error loading user and office:', error);
      setLoadingOffices(false);
    }
  };

  const fetchRequests = () => {
    setLoading(true);
    setRequests([]);
    setTotalItems(0);
    setTotalPages(0);
    setLoading(false);
  };

  const fetchStores = () => {
    setStores([]);
    setStoresByOffice([]);
  };

  const fetchItems = () => {
    setItems([]);
  };

  const filteredRequests = requests.filter(req =>
    req.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.storeId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayRequests = filteredRequests;

  // Get store name by ID
  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'Unknown Store';
  };

  // Get office name by ID
  const getOfficeName = (officeId) => {
    const officeData = offices.find(o => o.id === officeId);
    return officeData?.branchName || officeData?.name || 'Unknown Office';
  };

  const handlePreview = (request) => {
    toast.success(`Viewing PR #${request.id}`);
  };

  const handleEdit = (request) => {
    setPurchaseFormData({
      itemSku: '',
      itemId: '',
      itemName: '',
      unitOfMeasurement: '',
      quantity: 1
    });
    setPurchaseRequestItems(request.items || []);
    setShowAddModal(true);
  };

  const handleDelete = async (requestId) => {
    setDeleteModal({ isOpen: true, requestId });
  };

  const handleConfirmDelete = () => {
    const { requestId } = deleteModal;

    setDeleting(requestId);
    toast.error('Delete is unavailable until APIs are implemented.');
    setDeleteModal({ isOpen: false, requestId: null });
    setDeleting(null);
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, requestId: null });
  };

  const handleApprove = (requestId) => {
    setApproving(requestId);
    toast.error('Approval workflow is unavailable until APIs are implemented.');
    setApproving(null);
  };

  const [selectedRows, setSelectedRows] = useState(new Set());

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
    if (selectedRows.size === displayRequests.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(displayRequests.map(req => req.id));
      setSelectedRows(allIds);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleClosePurchaseModal = () => {
    setShowAddModal(false);
    setPurchaseRequestItems([]);
    setPurchaseFormData({
      storeId: '',
      itemSku: '',
      itemId: '',
      itemName: '',
      unitOfMeasurement: '',
      quantity: 1
    });
  };

  const handlePurchaseFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (value) => {
    const num = parseInt(value) || 1;
    if (num > 0) {
      setPurchaseFormData(prev => ({
        ...prev,
        quantity: num
      }));
    }
  };

  const handleAddItem = () => {
    if (!purchaseFormData.itemId) {
      toast.error('Please select an item');
      return;
    }
    if (!purchaseFormData.unitOfMeasurement) {
      toast.error('Please select unit of measurement');
      return;
    }
    
    const selectedItem = items.find(i => i.id === purchaseFormData.itemId);
    if (!selectedItem) {
      toast.error('Item not found');
      return;
    }

    const newItem = {
      id: Date.now(),
      itemId: selectedItem.id,
      itemSku: selectedItem.sku,
      itemName: selectedItem.name,
      unitOfMeasurement: purchaseFormData.unitOfMeasurement,
      quantity: purchaseFormData.quantity,
      unitPrice: selectedItem.price || 0
    };
    setPurchaseRequestItems([...purchaseRequestItems, newItem]);
    setPurchaseFormData(prev => ({
      ...prev,
      itemSku: '',
      itemId: '',
      itemName: '',
      unitOfMeasurement: '',
      quantity: 1
    }));
    toast.success('Item added to request');
  };

  const handleRemoveItem = (itemId) => {
    setPurchaseRequestItems(purchaseRequestItems.filter(item => item.id !== itemId));
    toast.success('Item removed from request');
  };

  const handleSubmitPurchaseRequest = () => {
    setSubmitting(true);
    toast.error('Submission is unavailable until APIs are implemented.');
    setSubmitting(false);
  };

  return (
    <div className="bg-white m-5 rounded-lg p-6 min-h-screen scrollbar-hide">
      {/* Header with Search, Add Button, Filter */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="flex items-center bg-gray-100 rounded-lg w-64 px-4 py-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search Here"
            className="bg-transparent ml-3 w-full outline-none text-gray-600 placeholder-gray-400 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition text-sm">
            <Plus size={18} />
            Add New Request
          </button>
          <button className="border border-gray-300 p-2 rounded-lg hover:bg-gray-100 transition">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === displayRequests.length && displayRequests.length > 0}
                  onChange={toggleAllSelection}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left bg-blue-50">Office</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">User ID</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Purchased Request</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Created On</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Group / Section</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Status</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader className="animate-spin" size={20} />
                    Loading requests...
                  </div>
                </td>
              </tr>
            ) : displayRequests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">No purchase requests found</td>
              </tr>
            ) : (
              displayRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(request.id)}
                      onChange={() => toggleRowSelection(request.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-sm bg-blue-50 font-medium">{getOfficeName(request.officeId)}</td>
                  <td className="py-4 px-4 text-gray-700 text-sm overflow-x-scroll">{user?.id || 'N/A'}</td>
                  <td className="py-4 px-4 font-medium text-gray-800 text-sm overflow-x-scroll">{request.id}</td>
                  <td className="py-4 px-4 text-gray-700 text-sm">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-gray-700 text-sm">General</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                      request.status === 'APPROVED' || request.status === 'SUBMITTED'
                        ? 'bg-green-100 text-green-700' 
                        : request.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {request.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handlePreview(request)}
                        className="w-8 h-8 rounded-md bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition"
                        title="Preview"
                      >
                        <Eye size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => handleEdit(request)}
                        className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        disabled={deleting === request.id}
                        className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === request.id ? <Loader size={16} className="text-white animate-spin" /> : <Trash2 size={16} className="text-white" />}
                      </button>
                      <button
                        onClick={() => handleApprove(request.id, request.status)}
                        disabled={approving === request.id}
                        className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center hover:bg-green-600 transition disabled:opacity-50"
                        title="Approve/Workflow"
                      >
                        {approving === request.id ? <Loader size={16} className="text-white animate-spin" /> : <span className="text-white font-bold text-sm">✓</span>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium">Showing:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-center flex-1">
          <span className="text-gray-600 text-sm">
            Showing {displayRequests.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, totalItems)} out of {totalItems} records
          </span>
        </div>

        <div className="flex gap-1 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 2))
            .map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded transition text-sm ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Add New Purchase Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0">
              <h2 className="text-base font-semibold text-gray-900">Add New Purchase Request</h2>
              <button
                onClick={handleClosePurchaseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Top 3 Auto-filled Fields + Office Selector */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Office *</label>
                  <select
                    name="officeId"
                    value={purchaseFormData.officeId}
                    onChange={(e) => setPurchaseFormData(prev => ({
                      ...prev,
                      officeId: e.target.value
                    }))}
                    disabled={loadingOffices}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm bg-white disabled:opacity-50"
                  >
                    <option value="">{loadingOffices ? 'Loading...' : 'Select Office'}</option>
                    {offices.map(officeItem => (
                      <option key={officeItem.id} value={officeItem.id}>
                        {officeItem.branchName || officeItem.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Store *</label>
                  <select
                    name="storeId"
                    value={purchaseFormData.storeId}
                    onChange={(e) => setPurchaseFormData(prev => ({
                      ...prev,
                      storeId: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm bg-white"
                  >
                    <option value="">Select Store</option>
                    {storesByOffice.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">User ID *</label>
                  <input
                    type="text"
                    value={user?.id || user?.userId || 'Loading...'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Date & Time *</label>
                  <input
                    type="text"
                    value={new Date().toLocaleString()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Item Selection Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Item SKU / Barcode *</label>
                    <select
                      name="itemId"
                      value={purchaseFormData.itemId}
                      onChange={(e) => {
                        const selectedItem = items.find(i => i.id === e.target.value);
                        if (selectedItem) {
                          setPurchaseFormData(prev => ({
                            ...prev,
                            itemId: selectedItem.id,
                            itemSku: selectedItem.sku,
                            itemName: selectedItem.name
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm bg-white"
                    >
                      <option value="">Type & Search</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>{item.sku}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={purchaseFormData.itemName}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
                      placeholder="Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Select Unit of Measurement *</label>
                    <select
                      name="unitOfMeasurement"
                      value={purchaseFormData.unitOfMeasurement}
                      onChange={(e) => setPurchaseFormData(prev => ({
                        ...prev,
                        unitOfMeasurement: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Kg">Kg</option>
                      <option value="Liters">Liters</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Quantity *</label>
                      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-sm p-2">
                        <button
                          onClick={() => handleQuantityChange(purchaseFormData.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <input
                          type="number"
                          value={purchaseFormData.quantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          className="flex-1 text-center bg-gray-100 border-0 focus:outline-none text-sm font-medium"
                        />
                        <button
                          onClick={() => handleQuantityChange(purchaseFormData.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleAddItem}
                      className="px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-sm hover:bg-blue-700 transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Details Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Review Details</h3>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">S. No.</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Item SKU / Barcode</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Item Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Unit of Measurement</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Quantity</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseRequestItems.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">No items added yet</td>
                        </tr>
                      ) : (
                        purchaseRequestItems.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">{String(index + 1).padStart(2, '0')}</td>
                            <td className="px-4 py-3 text-gray-700">{item.itemSku}</td>
                            <td className="px-4 py-3 text-gray-700">{item.itemName}</td>
                            <td className="px-4 py-3 text-gray-700">{item.unitOfMeasurement}</td>
                            <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="w-6 h-6 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                                title="Remove"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-200 bg-white sticky bottom-0">
              <button
                onClick={handleClosePurchaseModal}
                className="px-8 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPurchaseRequest}
                disabled={submitting}
                className="px-8 py-2 bg-blue-600 text-white font-medium text-sm rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader size={16} className="animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Purchase Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Delete Purchase Request</h2>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <p className="text-gray-700 text-base">
                Are you sure you want to delete this purchase request? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting === deleteModal.requestId}
                className="px-6 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting === deleteModal.requestId && <Loader size={16} className="animate-spin" />}
                {deleting === deleteModal.requestId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequestPage;
