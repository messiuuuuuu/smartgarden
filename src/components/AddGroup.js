import React from 'react';


const AddGroup = ({ newGroupName, setNewGroupName, newGroupDescription, setNewGroupDescription, onAddGroup, onCancel }) => (
    <div className="w-full max-w-7xl mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thêm Nhóm Mới</h2>
        <div className="flex flex-col gap-4">
            <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nhập tên nhóm, ví dụ: Vườn Sau Nhà"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/50"
            />
            <textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Mô tả cho khu vườn của bạn"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/50"
                rows="3"
            />
            <div className="flex gap-4">
                <button
                    onClick={onAddGroup}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                >
                    Thêm
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
                >
                    Hủy
                </button>
            </div>
        </div>
    </div>
);

export default AddGroup;
