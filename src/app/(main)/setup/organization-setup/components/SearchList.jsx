"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Input from "@/components/ui/Input";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import SuccessModal from "@/components/ui/SuccessModal";
import { ViewButton, EditButton, DeleteButton, ToggleButton } from "./ButtonComponents";
import Image from "next/image";

const SearchList = ({
  isLoading = false,
  error = null,
  items,
  showView = true,
  showEdit = true,
  showDelete = true,
  showToggle = true,
  onView,
  onEdit,
  onDelete,
  onToggle,
  searchQuery = "",
  onSearchChange = () => {},
  tabName = "Item",
}) => {
  const [toggleStates, setToggleStates] = useState(() =>
    Object.fromEntries(items.map((item, index) => [index, item?.isActive ?? true]))
  );
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterActive, setFilterActive] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  
  // Modal states
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    itemName: "",
    itemIndex: null,
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "create",
  });

  const getItemName = (item) => {
    if (typeof item === "string") return item;
    return item?.name || item?.title || "";
  };

  const getItemActive = (item, index) => {
    if (typeof item === "string") return toggleStates[index];
    return item?.isActive ?? toggleStates[index];
  };

  const getSortedAndFiltered = () => {
    let result = items
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => {
        const name = getItemName(item);
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        const isActive = getItemActive(item, index);
        
        if (filterActive === null) return matchesSearch;
        if (filterActive === true) return matchesSearch && isActive;
        if (filterActive === false) return matchesSearch && !isActive;
        
        return matchesSearch;
      });

    if (sortBy === "a-z") {
      result.sort((a, b) => getItemName(a.item).localeCompare(getItemName(b.item)));
    } else if (sortBy === "z-a") {
      result.sort((a, b) => getItemName(b.item).localeCompare(getItemName(a.item)));
    } else if (sortBy === "active-first") {
      result.sort((a, b) => {
        const aActive = getItemActive(a.item, a.index) ? 0 : 1;
        const bActive = getItemActive(b.item, b.index) ? 0 : 1;
        return aActive - bActive;
      });
    } else if (sortBy === "inactive-first") {
      result.sort((a, b) => {
        const aActive = getItemActive(a.item, a.index) ? 1 : 0;
        const bActive = getItemActive(b.item, b.index) ? 1 : 0;
        return aActive - bActive;
      });
    }

    return result;
  };

  const filteredItems = getSortedAndFiltered();
 

  const handleToggle = (item, index) => {
    const nextValue = !getItemActive(item, index);
    setToggleStates((prev) => ({ ...prev, [index]: nextValue }));
    if (onToggle) onToggle(item, index, nextValue);
  };

  const handleDeleteClick = (item, index) => {
    setDeleteConfirmation({
      isOpen: true,
      itemName: getItemName(item),
      itemIndex: index,
    });
  };

  const handleDeleteConfirm = () => {
    const { itemIndex, itemName } = deleteConfirmation;
    setDeleteConfirmation({ isOpen: false, itemName: "", itemIndex: null });
    
    // Call the delete callback
    if (onDelete) onDelete(itemName, itemIndex);
    
    // Show success modal
    setSuccessModal({
      isOpen: true,
      title: "Deleted Successfully",
      message: `"${itemName}" has been deleted successfully.`,
      type: "delete",
    });
  };

  const handleEditClick = (item, index) => {
    if (onEdit) onEdit(item, index);
  };

  const handleViewClick = (item, index) => {
    if (onView) onView(item, index);
  };

  console.log("Filtered & Sorted Items:", filteredItems);

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between h-12">
        <div className="flex flex-row items-center gap-4 relative w-full sm:max-w-105 border border-gray-200 rounded-xl px-4 py-2.5 h-full">
          <Search className="h-6 w-6 text-black" />
          <Input 
            placeholder="Search Item" 
            className="py-2.5 font-lexend font-light caret-gray-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-8 py-2.5 text-md font-lexend text-gray-700 transition hover:bg-gray-50 h-full relative"
        >
          <Image src="/icons/filter.svg" alt="Filter Icon" width={22} height={22} />
          Filter
          {(filterActive !== null || sortBy !== "default") && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              ●
            </span>
          )}
        </button>
      </div>

      {/* Enhanced Filter Panel */}
      {showFilterPanel && (
        <div className="absolute right-36 bottom-60 bg-white border border-gray-300 rounded-xl shadow-xl p-6 z-10 w-72 animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800">Filter & Sort</h3>
            <button
              onClick={() => setShowFilterPanel(false)}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Filter Section */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Status</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="filter"
                  checked={filterActive === null}
                  onChange={() => setFilterActive(null)}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700">All Items</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="filter"
                  checked={filterActive === true}
                  onChange={() => setFilterActive(true)}
                  className="w-4 h-4 cursor-pointer accent-green-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Active Only
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="filter"
                  checked={filterActive === false}
                  onChange={() => setFilterActive(false)}
                  className="w-4 h-4 cursor-pointer accent-gray-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Inactive Only
                </span>
              </label>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Sort Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "default"}
                  onChange={() => setSortBy("default")}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700">Default</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "a-z"}
                  onChange={() => setSortBy("a-z")}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700">A to Z</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "z-a"}
                  onChange={() => setSortBy("z-a")}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700">Z to A</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "active-first"}
                  onChange={() => setSortBy("active-first")}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700">Active First</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "inactive-first"}
                  onChange={() => setSortBy("inactive-first")}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700">Inactive First</span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFilterActive(null);
              setSortBy("default");
            }}
            className="w-full mt-5 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Reset All
          </button>
        </div>
      )}
      
      <div className="mt-15 sm:mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-red-600 font-semibold">Error</p>
              <p className="text-red-500 mt-2">{error}</p>
            </div>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items available
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(({ item, index }, displayIndex) => {
            const name = getItemName(item);
            const isActive = getItemActive(item, index);
            return (
              <div
                key={item?.Id ?? item?.id ?? index}
                className="flex items-center justify-between bg-[#F6FBF8] px-4 py-3 transition hover:bg-[#EEF6F2]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-600">
                    {displayIndex + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                </div>

                <div className="flex items-center gap-3">
                  {showView && <ViewButton onClick={() => handleViewClick(item, index)} />}
                  {showEdit && <EditButton onClick={() => handleEditClick(item, index)} />}
                  {showDelete && <DeleteButton onClick={() => handleDeleteClick(item, index)} />}
                  {showToggle && (
                    <ToggleButton
                      isActive={!!isActive}
                      onClick={() => handleToggle(item, index)}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No items found
          </div>
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        itemName={deleteConfirmation.itemName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmation({ isOpen: false, itemName: "", itemIndex: null })}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        type={successModal.type}
        onClose={() => setSuccessModal({ isOpen: false, title: "", message: "", type: "create" })}
      />
    </div>
  );
};

export default SearchList;
