import React, { useState } from 'react';
import AddDevice from './AddDevice';
import DeviceCard from './DeviceCard';
import Swal from 'sweetalert2';

const GroupSection = ({ group, groupId, devices, groups, onAddDeviceToGroup, onDeleteGroup, onRemoveDeviceFromGroup, onUpdateGroupInfo }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [isRenameModalOpen, setRenameModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState(group.name);
    const [newGroupDescription, setNewGroupDescription] = useState(group.description || '');

    const handleRename = () => {
        if (newGroupName) {
            onUpdateGroupInfo(groupId, newGroupName, newGroupDescription);
            Swal.fire('Thành công!', 'Thông tin khu vườn đã được cập nhật.', 'success');
        }
        setRenameModalOpen(false);
    };

    const handleDeleteGroup = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa khu vườn này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                onDeleteGroup(groupId);
                Swal.fire('Đã xóa!', 'Khu vườn đã được xóa.', 'success');
            }
        });
    };

    const handleRemoveDevice = (deviceId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa thiết bị này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                onRemoveDeviceFromGroup(groupId, deviceId);
                Swal.fire('Đã xóa!', 'Thiết bị đã được xóa khỏi khu vườn.', 'success');
            }
        });
    };

    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6 ">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 ">{group.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{group.description || 'Chưa có mô tả'}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        Thêm thiết bị
                    </button>
                    <button
                        onClick={() => setRenameModalOpen(true)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 14a1 1 0 01-1 1H3a1 1 0 01-1-1v-1h2v1zM13 6l-1.5-1.5L10 6l-1.5-1.5L7 6l-1.5-1.5L4 6v2h12V6h-3z" />
                        </svg>
                        Sửa
                    </button>
                    <button
                        onClick={handleDeleteGroup}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 00-1 1v5a2 2 0 002 2h6a2 2 0 002-2v-5a1 1 0 10-2 0v5H7v-5a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Xóa
                    </button>
                </div>
            </div>

            {isRenameModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Chỉnh sửa thông tin</h3>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Tên khu vườn"
                        />
                        <textarea
                            value={newGroupDescription}
                            onChange={(e) => setNewGroupDescription(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Mô tả khu vườn"
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setRenameModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
                            <button onClick={handleRename} className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-6">Thêm thiết bị vào {group.name}</h2>
                        <AddDevice
                            devices={devices}
                            groups={groups}
                            onAddDeviceToGroup={(deviceId) => {
                                onAddDeviceToGroup(groupId, deviceId);
                                setShowAddForm(false);
                            }}
                        />
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {group.devices && Object.keys(group.devices).length > 0 ? (
                    Object.keys(group.devices).map((deviceId) => {
                        const device = devices.find(d => d.id === deviceId);
                        return device ? (
                            <DeviceCard
                                key={deviceId}
                                device={device}
                                onRemove={() => handleRemoveDevice(deviceId)}
                            />
                        ) : null;
                    })
                ) : (
                    <p className="text-gray-500 col-span-full text-center">Chưa có thiết bị nào trong khu vườn này.</p>
                )}
            </div>
        </div>
    );
};

export default GroupSection;
