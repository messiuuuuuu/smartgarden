import React, { useState } from 'react';
import AddDevice from './AddDevice';
import DeviceCard from './DeviceCard';
import Swal from 'sweetalert2';

const GroupSection = ({ group, groupId, devices, groups, onAddDeviceToGroup, onDeleteGroup, onRemoveDeviceFromGroup, handleRenameGroup }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(group.name);


    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                {isRenaming ? (
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <button
                            onClick={() => {
                                handleRenameGroup(groupId, newName);
                                setIsRenaming(false);
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => setIsRenaming(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        >
                            Hủy
                        </button>
                    </div>
                ) : (
                    <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {showAddForm ? 'Ẩn' : 'Thêm Thiết Bị'}
                    </button>
                    <button
                        onClick={() => setIsRenaming(true)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Đổi Tên Nhóm
                    </button>
                    <button
                        onClick={() => Swal.fire({
                            title: 'Bạn có chắc chắn muốn xóa nhóm này?',
                            text: "Hành động này không thể hoàn tác!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Xóa Nhóm',
                            cancelButtonText: 'Hủy'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                onDeleteGroup(groupId);
                            }
                        })}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                        Xóa Nhóm
                    </button>
                </div>
            </div>
            {showAddForm && (
                <AddDevice
                    groupId={groupId}
                    devices={devices}
                    groups={groups}
                    onAddDevice={onAddDeviceToGroup}
                />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {devices
                    .filter(device => group.devices && group.devices[device.id])
                    .map(device => (
                        <DeviceCard
                            key={device.id}
                            device={device}
                            groupId={groupId}
                            onRemoveDevice={onRemoveDeviceFromGroup}
                        />
                    ))}
            </div>
        </div>
    );
};

export default GroupSection;