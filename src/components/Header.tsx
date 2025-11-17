import React from 'react'

const Header = ({title,onClick}) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <button onClick={onClick}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                 {title}
            </button>
        </div>
    )
}

export default Header
