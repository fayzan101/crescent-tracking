"use client";
import React, { useState } from "react";
import FieldWrapper from "../ui/FieldWrapper";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Textarea from "../ui/TextArea";
import DateInput from "../ui/DateInput";
import ConfidentialForm from "./ConfidentialForm";

const TABS = {
    CLIENT: "client",
    PRODUCT: "product",
    VEHICLE: "vehicle",
};

const InstallationForm = () => {
    const [activeTab, setActiveTab] = useState(TABS.CLIENT);
    const [confidentialForm, setConfidentialForm] = useState(false)

    const tabButtonClasses = (isActive) =>
        `
    px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm md:text-sm font-medium transition-all duration-200
    whitespace-nowrap
    ${isActive
            ? "bg-customGreen text-gray-100 shadow-sm"
            : "border border-customGreen text-gray-900 hover:bg-customGreen/10 cursor-pointer"
        }
  `;

    const handleNext = () => {
        if (activeTab === TABS.CLIENT) {
            setActiveTab(TABS.PRODUCT);
        } else if (activeTab === TABS.PRODUCT) {
            setActiveTab(TABS.VEHICLE);
        }
    };


    return (
        <div className="flex-1 flex flex-col gap-4 md:gap-6">
            {/* Tabs */}
            {
                !confidentialForm && (
                    <div className="flex flex-wrap gap-2 md:gap-3 overflow-x-auto pb-1">
                        <button
                            className={tabButtonClasses(activeTab === TABS.CLIENT)}
                            onClick={() => setActiveTab(TABS.CLIENT)}
                        >
                            Client Details
                        </button>

                        <button
                            className={tabButtonClasses(activeTab === TABS.PRODUCT)}
                            onClick={() => setActiveTab(TABS.PRODUCT)}
                        >
                            Product & Package
                        </button>

                        <button
                            className={tabButtonClasses(activeTab === TABS.VEHICLE)}
                            onClick={() => setActiveTab(TABS.VEHICLE)}
                        >
                            Vehicle & Installation
                        </button>
                    </div>
                )
            }

            {/* ================= Client Details Form ================= */}
            {activeTab === TABS.CLIENT && !confidentialForm && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Select Client Category" required className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Select IR No." className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Full Name" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="CNIC No." required className="text-sm">
                                <Input placeholder="12345-1234567-1" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Phone Home" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Email ID" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Address" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Select Client Status" required className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Cell No." required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Father Name" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Date of Birth" className="text-sm">
                                <DateInput placeholder="Select (dd/mm/yyyy)" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Phone Office" className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Company / Department" className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Address Line 2" className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>
                        </div>
                    </div>
                </>
            )}

            {/* ================= Product & Package ================= */}
            {activeTab === TABS.PRODUCT && !confidentialForm && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Select Product" required className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Installation Date" required className="text-sm">
                                <DateInput placeholder="Select (dd/mm/yyyy)" className="text-sm py-2" />
                            </FieldWrapper>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Select Package Type" required className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Renewal Date" required className="text-sm">
                                <DateInput placeholder="Select (dd/mm/yyyy)" className="text-sm py-2" />
                            </FieldWrapper>
                        </div>
                    </div>
                    
                    {/* Device & Accessories Section */}
                    <div className="mt-4 md:mt-6">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                            Device & Accessories
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                            {/* col 1 */}
                            <div className="flex flex-col gap-3 md:gap-3">
                                <FieldWrapper label="Select Product" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                                <FieldWrapper label="Select Zone" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                                <FieldWrapper label="Select Device Combo" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                                <FieldWrapper label="Select SIM" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                                <FieldWrapper label="Select Accessories 2" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                            </div>

                            {/* Column 2 */}
                            <div className="flex flex-col gap-3 md:gap-3">
                                <FieldWrapper label="Select Package Type" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>

                                <FieldWrapper label="Assign Technician" required className="text-sm">
                                    <Input placeholder="Type here" className="text-sm py-2" />
                                </FieldWrapper>

                                <FieldWrapper label="Select Device" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                                <FieldWrapper label="Select Accessories 1" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                                <FieldWrapper label="Select Accessories 3" required className="text-sm">
                                    <Select placeholder="Select" className="text-sm py-2" />
                                </FieldWrapper>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ================= Vehicle & Installation ================= */}
            {activeTab === TABS.VEHICLE && !confidentialForm && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Registration No." required className="text-sm">
                                <Input placeholder="Type (ABC-1234)" className="text-sm py-2" />
                            </FieldWrapper>
                            <FieldWrapper label="Engine No." required className="text-sm">
                                <Input placeholder="Auto" className="text-sm py-2" />
                            </FieldWrapper>
                            <FieldWrapper label="Chassis No." required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Make/Model" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Year" required className="text-sm">
                                <DateInput placeholder="Select (dd/mm/yyyy)" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Color" required className="text-sm">
                                <Input placeholder="Type here" className="text-sm py-2" />
                            </FieldWrapper>
                        </div>
                    </div>
                </>
            )}

            {
                confidentialForm && <ConfidentialForm />
            }

            {/* Bottom Buttons */}
            {
                !confidentialForm && (
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <button
                            className="
                w-full sm:w-auto
                text-customBlue
                border border-customBlue
                px-4 py-2
                rounded-lg
                text-sm font-medium
                transition
                hover:bg-gray-100
            "
                        >
                            Save
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={activeTab === TABS.VEHICLE}
                            className={`
                w-full sm:w-auto
                px-4 py-2 rounded-lg text-sm font-medium transition
                ${activeTab === TABS.VEHICLE
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-customBlue text-gray-100 hover:bg-customBlue/90"
                                }
            `}
                        >
                            {activeTab === TABS.VEHICLE ? "Submit" : "Next"}
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default InstallationForm;