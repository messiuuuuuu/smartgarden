import React from 'react';

const DeviceInfo = ({ 
    deviceName, 
    editingName, 
    newDeviceName, 
    setNewDeviceName, 
    handleEditName, 
    handleSaveName, 
    handleCancelEdit, 
    handleImageChange, 
    previewImage 
}) => {
    return (
        <div className="text-center">
            <div className="relative inline-block">
                <img 
                    src={previewImage} 
                    alt={deviceName} 
                    className="w-40 h-40 rounded-full border-4 border-white shadow-lg mx-auto object-cover" 
                />
                {editingName && (
                    <label htmlFor="image-upload" className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                )}
            </div>

            <div className="mt-6">
                {editingName ? (
                    <div className="flex flex-col items-center gap-4">
                        <input 
                            type="text" 
                            value={newDeviceName}
                            onChange={(e) => setNewDeviceName(e.target.value)}
                                className="w-full text-2xl font-bold p-2 border rounded mb-4"
                        />
                        <div className="flex gap-3">
                            <button onClick={handleSaveName} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition">Lưu</button>
                            <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition">Hủy</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-4xl font-bold text-gray-800">{deviceName}</h1>
                        <div className="flex items-center">
                            <button onClick={handleEditName} className="text-green-600 hover:text-green-800 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceInfo;
