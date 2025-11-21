import React from 'react';

const DeviceInfo = ({
    deviceName,
    editingName,
    newDeviceName,
    setNewDeviceName,
    handleEditName,
    handleSaveName,
    handleCancelEdit,
    handleDelete,
}) => {
    return (
        <div className="flex items-center justify-center mb-8 relative">
            {editingName ? (
                <div className="flex items-center w-full gap-4">
                    <input
                        type="text"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        className="flex-1 px-4 py-2 text-lg border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Nhập tên thiết bị"
                    />
                    <button
                        onClick= {handleSaveName}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                        Lưu
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    >
                        Hủy
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent text-center animate-fadeIn">
                        {deviceName || 'Thiết bị của bạn'}
                    </h1>
                    <div className="absolute right-0 flex gap-2">
                        <button
                            onClick={handleEditName}
                            className="p-2 text-green-600 hover:text-green-800 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M3 7h18" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeviceInfo;
