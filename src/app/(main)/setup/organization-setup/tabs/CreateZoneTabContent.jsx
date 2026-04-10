"use client";

import React, { useState, useEffect, useMemo } from "react";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormActions from "../components/FormActions";
import SearchList from "../components/SearchList";
import EditModal from "../components/EditModal";
import ViewModal from "../components/ViewModal";
import ValidationErrorModal from "../components/ValidationErrorModal";
import { EditButton, DeleteButton, ToggleButton } from "../components/ButtonComponents";
import { useZones } from "@/hooks/zone/useZones";
import { useCreateZone } from "@/hooks/zone/useCreateZone";
import { useUpdateZone } from "@/hooks/zone/useUpdateZone";
import { useDeleteZone } from "@/hooks/zone/useDeleteZone";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useOffices } from "@/hooks/office/useOffices";

const CreateZoneTabContent = () => {
  // Zone form states (for creating new zones)
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [selectedOfficeName, setSelectedOfficeName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [officeId, setOfficeId] = useState("");

  // Zone edit form states (for editing existing zones)
  const [editSelectedOfficeId, setEditSelectedOfficeId] = useState("");
  const [editZoneName, setEditZoneName] = useState("");
  const [editOfficeId, setEditOfficeId] = useState("");

  // Local state for optimistic updates
  const [localZones, setLocalZones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // State for adding employees to zone
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [employeeToggleStates, setEmployeeToggleStates] = useState({});

  // API hooks
  const { data: officesData } = useOffices();
  const { data, isLoading, error, isFetching, refetch } = useZones();
  const { data: employeesData, isLoading: employeesLoading } = useEmployees();

  const { mutate: deleteZone } = useDeleteZone({
    onSuccess: () => refetch(),
  });

  const {
    mutate: updateZone,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateZone({
    onSuccess: () => {
      resetEditForm();
      setShowEditModal(false);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdateZone();

  const { mutate: createZone, isPending: isCreating } = useCreateZone({
    onSuccess: () => {
      resetForm();
      setTimeout(() => refetch(), 1000);
    },
  });

  // Auto-populate officeId when office is selected (Add form)
  useEffect(() => {
    if (selectedOfficeId && officesData) {
      const selectedOffice = officesData.find((o) => o.officeId === parseInt(selectedOfficeId));
      if (selectedOffice) {
        setSelectedOfficeName(selectedOffice.officeName);
        setOfficeId(selectedOffice.officeId);
      }
    } else {
      setSelectedOfficeName("");
      setOfficeId("");
    }
  }, [selectedOfficeId, officesData]);

  // Auto-populate officeId when office is selected (Edit form)
  useEffect(() => {
    if (editSelectedOfficeId && officesData) {
      const selectedOffice = officesData.find((o) => o.officeId === parseInt(editSelectedOfficeId));
      if (selectedOffice) {
        setEditOfficeId(selectedOffice.officeId);
      }
    } else {
      setEditOfficeId("");
    }
  }, [editSelectedOfficeId, officesData]);

  const officeOptions = useMemo(
    () => {
      if (!officesData || officesData.length === 0) return [];
      return officesData.map((office) => ({
        value: office.officeId ? office.officeId.toString() : "",
        label: office.officeName || "Unknown Office",
      }));
    },
    [officesData]
  );

  const employeeOptions = useMemo(
    () => {
      if (!employeesData || employeesData.length === 0) return [];
      return employeesData.map((emp) => ({
        value: emp.employeeId ? emp.employeeId.toString() : "",
        label: `${emp.employeeId} - ${emp.emailId || "N/A"}`,
      }));
    },
    [employeesData]
  );

  // Sync localZones with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((zone) => ({
        id: zone.zoneId,
        name: zone.zoneName,
        zoneName: zone.zoneName,
        officeId: zone.officeId,
        isActive: zone.isActive,
      }));
      setLocalZones(mapped);
    }
  }, [data, isLoading, error]);

  const zones = useMemo(() => {
    if (isLoading || error) return [];
    return localZones;
  }, [localZones, isLoading, error]);

  const zoneOptions = useMemo(
    () => {
      if (!zones || zones.length === 0) return [];
      return zones.map((zone) => ({
        value: zone.id.toString(),
        label: zone.name || "Unknown Zone",
      }));
    },
    [zones]
  );

  const resetForm = () => {
    setSelectedOfficeId("");
    setSelectedOfficeName("");
    setZoneName("");
    setOfficeId("");
  };

  const resetEditForm = () => {
    setEditSelectedOfficeId("");
    setEditZoneName("");
    setEditOfficeId("");
  };

  const validateCreateZone = () => {
    const errors = [];
    if (!zoneName.trim()) errors.push("Zone Name");
    if (!officeId) errors.push("Office");
    return errors;
  };

  const handleCreateZone = () => {
    const errors = validateCreateZone();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return false;
    }
    createZone({
      zoneName,
      officeId,
      isActive: true,
    });
  };

  const validateUpdateZone = () => {
    const errors = [];
    if (!editZoneName.trim()) errors.push("Zone Name");
    if (!editOfficeId) errors.push("Office");
    return errors;
  };

  const handleDeleteZone = (itemName, index) => {
    if (zones[index]?.id) {
      deleteZone(zones[index].id);
    }
  };

  const handleEditZone = (item) => {
    setSelectedZone(item);
    setEditSelectedOfficeId(item.officeId?.toString() || "");
    setEditZoneName(item.zoneName);
    setEditOfficeId(item.officeId || "");
    setShowEditModal(true);
  };

  const handleUpdateZone = (onSuccess) => {
    const errors = validateUpdateZone();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return;
    }
    if (!selectedZone) return;
    updateZone(
      {
        id: selectedZone.id,
        payload: {
          zoneName: editZoneName,
          officeId: editOfficeId,
        },
      },
      { onSuccess }
    );
  };

  const handleToggleZone = (item) => {
    if (item?.id) {
      setLocalZones((prev) =>
        prev.map((zone) =>
          zone.id === item.id ? { ...zone, isActive: !zone.isActive } : zone
        )
      );
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleViewZone = (item) => {
    setViewItem(item);
    setShowViewModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetEditForm();
    resetUpdateError?.();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewItem(null);
  };

  // Sample data for demonstration
  const sampleEmployeesData = [
    {
      name: "Ali Khan",
      call: "03001234567",
      cnic: "12345-6789012-3",
      zone: "North Zone",
      office: "Main Office",
      city: "Lahore",
    },
    {
      name: "Sara Ahmed",
      call: "03109876543",
      cnic: "98765-4321098-7",
      zone: "South Zone",
      office: "Branch Office",
      city: "Karachi",
    },
    {
      name: "Hassan Malik",
      call: "03215554444",
      cnic: "11111-2222233-4",
      zone: "East Zone",
      office: "Sub Office",
      city: "Islamabad",
    },
    {
      name: "Fatima Hussain",
      call: "03335559999",
      cnic: "55555-6666677-8",
      zone: "West Zone",
      office: "Regional Office",
      city: "Multan",
    },
  ];

  // Filter employees by selected zone (if zone is selected)
  const employeesInZone = useMemo(() => {
    // For now, show sample data - will be replaced with API data in future
    if (!selectedZoneId) return sampleEmployeesData;
    
    if (!employeesData) return sampleEmployeesData;
    // For now, return all employees - in a real app, you'd filter by zone assignment
    return employeesData.map((emp) => ({
      name: emp.emailId,
      call: emp.primaryMobileNo || "N/A",
      cnic: emp.cnic || "N/A",
      zone: selectedZoneId,
      office: "Office Name",
      city: "City",
    }));
  }, [selectedZoneId, employeesData]);

  return (
    <div className="flex-1 flex flex-col">
      {/* SECTION 1: Create Zone */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Create Zone
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Select Office" required className="text-sm">
              {officesData && officesData.length > 0 ? (
                <Select
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  placeholder="Select Office"
                  options={officeOptions}
                  className="text-sm"
                />
              ) : (
                <div className="text-sm text-gray-500 p-2 rounded">
                  Loading offices
                </div>
              )}
            </FieldWrapper>
          </div>
          
          <div className="space-y-1">
            <FieldWrapper label="Zone Name" required className="text-sm">
              <Input 
                placeholder="Enter zone name" 
                className="text-sm"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
              />
            </FieldWrapper>
          </div>
        </div>

        <FormActions onSave={handleCreateZone} tabName="Zone" />
      </div>

      {/* SECTION 2: Search Zones */}
      <div className="pb-6 md:pb-8">
        <SearchList
          isLoading={isLoading || isFetching}
          error={error?.message}
          items={zones}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewZone}
          onEdit={handleEditZone}
          onDelete={handleDeleteZone}
          onToggle={handleToggleZone}
          tabName="Zone"
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedZone}
        onUpdate={handleUpdateZone}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Zone"
        itemType="zone"
        fields={[
          { label: "Select Office", value: editSelectedOfficeId, onChange: setEditSelectedOfficeId, type: "select", options: officeOptions },
          { label: "Zone Name", value: editZoneName, onChange: setEditZoneName },
        ]}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        item={viewItem}
        onClose={handleCloseViewModal}
        title="Zone Details"
        fields={[
          { key: "id", label: "Zone ID" },
          { key: "zoneName", label: "Zone Name" },
          { key: "officeId", label: "Office ID" },
          {
            key: "isActive",
            label: "Status",
            render: (value) => (value ? "Active" : "Inactive"),
          },
        ]}
      />

      {/* SECTION 3: Employees in Zone */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Employees in Zone
        </h2>

        <div className="flex flex-row gap-5 items-end mb-6">
            <div className="flex-1">
              <FieldWrapper label="Select Employee" required className="text-sm">
                <Select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  placeholder="Select Employee"
                  options={employeeOptions}
                  className="text-sm"
                />
              </FieldWrapper>
            </div>
            
            <div className="flex-1">
              <FieldWrapper label="Select Zone" required className="text-sm">
                <Select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  placeholder="Select Zone"
                  options={zoneOptions}
                  className="text-sm"
                />
              </FieldWrapper>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EEF0FB]">
                <th className="py-5 px-4 text-left border-r border-gray-300 rounded-l-xl">
                    <input type="checkbox" className="mr-2 w-4 h-4 rounded-md border border-gray-300 accent-customBlue cursor-pointer appearance-none" />
                </th>
                <th className="text-left py-5 px-4 whitespace-nowrap">Employee Name</th>
                <th className="text-left py-5 px-4">Call No.</th>
                <th className="text-left py-5 px-4">CNIC No.</th>
                <th className="text-left py-5 px-4">Zone</th>
                <th className="text-left py-5 px-4">Office</th>
                <th className="text-left py-5 px-4">City</th>
                <th className="text-left py-5 px-4 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {employeesInZone && employeesInZone.length > 0 ? (
                employeesInZone.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-5 px-4">
                      <input type="checkbox" className="mr-2 w-4 h-4 rounded-md border border-gray-300 accent-customBlue cursor-pointer appearance-none" />
                    </td>
                    <td className="py-5 px-4">{emp.name}</td>
                    <td className="py-5 px-4">{emp.call}</td>
                    <td className="py-5 px-4">{emp.cnic}</td>
                    <td className="py-5 px-4">{emp.zone}</td>
                    <td className="py-5 px-4">{emp.office}</td>
                    <td className="py-5 px-4">{emp.city}</td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <EditButton onClick={() => console.log('Edit employee:', emp.name)} />
                        <DeleteButton onClick={() => console.log('Delete employee:', emp.name)} />
                        <ToggleButton
                          isActive={!!employeeToggleStates[idx]}
                          onClick={() =>
                            setEmployeeToggleStates((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-5 px-4 text-center text-gray-500">
                    No employees available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <FormActions tabName="Zone" primaryClassName="bg-customBlue hover:bg-customBlue/90" />
      </div>

      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        missingFields={validationErrors}
      />
    </div>
  );
};

export default CreateZoneTabContent;
