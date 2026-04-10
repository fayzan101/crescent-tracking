import { FiCalendar } from "react-icons/fi";

const DateInput = ({ placeholder }) => (
    <div className="flex items-center justify-between">
        <input
            type="text"
            placeholder={placeholder}
            className="bg-transparent outline-none text-sm md:text-base text-gray-900 placeholder-gray-400 flex-1"
        />
        <FiCalendar className="text-gray-400 ml-2" />
    </div>
);

export default DateInput;