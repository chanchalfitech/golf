import React from "react";
import { ArrowLeft } from "lucide-react";

const Header = ({ title, onBack, onAdd, disableAdd }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      
      {/* LEFT: Back Button + Title */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            title="back"
            onClick={onBack}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
        )}

        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* RIGHT: Add Button */}
      {onAdd && (
        <button
          onClick={onAdd}
          disabled={disableAdd}
          className={`px-4 py-2 rounded-md shadow text-white 
            ${disableAdd 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          Add {title}
        </button>
      )}
    </div>
  );
};  

export default Header;
