const Textarea = ({ placeholder, rows = 4 }) => (
    <textarea
        rows={rows}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 resize-none w-full"
    />
);

export default Textarea;