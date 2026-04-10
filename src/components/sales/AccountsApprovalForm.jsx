import React from 'react'
import { FiChevronDown, FiCalendar } from "react-icons/fi";
import FieldWrapper from '../ui/FieldWrapper';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/TextArea';
import DateInput from '../ui/DateInput';

const AccountsApprovalForm = () => {
    return (
        <>
            <div className="flex-1 flex flex-col gap-3 md:gap-4">
                {/* Heading */}
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Accounts Approval
                </h2>

                {/* Form Grid - 2 columns on medium and large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {/* Column 1 - Client Information */}
                    <div className="flex flex-col gap-3 md:gap-3">
                        <FieldWrapper label="Select Client Category" required className="text-sm">
                            <Select placeholder="Select" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Select IR No." className="text-sm">
                            <Select placeholder="Select" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Full Name" className="text-sm">
                            <Input placeholder="12345-1234567-1" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="CNIC No." className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>
                        
                        <FieldWrapper label="Phone Home" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Email ID" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Address" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>
                    </div>

                    {/* Column 2 - Client Details */}
                    <div className="flex flex-col gap-3 md:gap-3">
                        <FieldWrapper label="Select Client Status" required className="text-sm">
                            <Select placeholder="Select" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Cell No." className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Father Name" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Date of Birth" className="text-sm">
                            <DateInput placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Phone Office" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>

                        <FieldWrapper label="Company/ Department" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>
                        
                        <FieldWrapper label="Address Line 2" className="text-sm">
                            <Input placeholder="Type here" className="text-sm py-2" />
                        </FieldWrapper>
                    </div>
                </div>

                {/* Product & Package Section */}
                <div className="mt-4 md:mt-6">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                        Select Product & Package
                    </h2>

                    {/* Product Grid - 2 columns on medium and large screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Select Product" required className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>
                            
                            <FieldWrapper label="Sale Amount" required className="text-sm">
                                <Input placeholder="Type (10000) numeric only" className="text-sm py-2" />
                            </FieldWrapper>
                            
                            <FieldWrapper label="Sale Type" required className="text-sm">
                                <Input placeholder="Type here (credit/ Cash/ Cheque/ Transfer)" className="text-sm py-2" />
                            </FieldWrapper>
                            
                            <FieldWrapper label="Account Remarks" className="text-sm">
                                <Textarea 
                                    placeholder="Type here" 
                                    className="min-h-[60px] md:min-h-[80px] text-sm"
                                />
                            </FieldWrapper>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-3 md:gap-3">
                            <FieldWrapper label="Select Package Type" required className="text-sm">
                                <Select placeholder="Select" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Renewal Charges" required className="text-sm">
                                <Input placeholder="Type (8000) numeric only" className="text-sm py-2" />
                            </FieldWrapper>

                            <FieldWrapper label="Sales Remarks" className="text-sm">
                                <Textarea 
                                    placeholder="Type here" 
                                    className="min-h-[60px] md:min-h-[80px] text-sm"
                                />
                            </FieldWrapper>
                        </div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col md:flex-row justify-end gap-3 mt-6 md:mt-8">
                    <button
                        className="
                            w-full md:w-auto
                            bg-red-600
                            text-gray-100
                            px-4 py-2
                            rounded-lg
                            cursor-pointer
                            text-sm font-medium
                            transition
                            hover:bg-red-700
                        "
                    >
                        Hold
                    </button>

                    <button
                        className="
                            w-full md:w-auto
                            bg-customBlue
                            text-gray-100
                            px-4 py-2
                            rounded-lg
                            cursor-pointer
                            text-sm font-medium
                            transition
                            hover:bg-customBlue/90
                        "
                    >
                        Save & Submit
                    </button>
                </div>
            </div>
        </>
    )
}

export default AccountsApprovalForm;