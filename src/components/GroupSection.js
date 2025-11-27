import React, { useState } from 'react';
import AddDevice from './AddDevice';
import GroupForm from './GroupForm'; 
import InfoCard from './InfoCard'; // Thay thế DeviceCard

const GroupSection = ({ group, groupId, devices, groups, onAddDeviceToGroup, onRemoveDeviceFromGroup, onUpdateGroupInfo }) => {
    const [isAddDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
    const [isEditFormOpen, setEditFormOpen] = useState(false); 

    const handleUpdateGroup = ({ name, description, image }) => {
        if (name) {
            onUpdateGroupInfo(groupId, name, description, image);
        }
        setEditFormOpen(false); 
    };

    const groupDevices = Object.keys(group.devices || {}).map(deviceId => {
        return devices.find(d => d.id === deviceId);
    }).filter(Boolean);

    const handleAddDeviceAndCloseModal = (deviceId) => {
        onAddDeviceToGroup(groupId, deviceId);
        setAddDeviceModalOpen(false); 
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setEditFormOpen(true)} className="text-gray-500 hover:text-green-600 p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                    </button>
                </div>
            </div>

            <GroupForm 
                isOpen={isEditFormOpen}
                onClose={() => setEditFormOpen(false)}
                onSave={handleUpdateGroup}
                initialData={group}
            />

            <p className="text-gray-600 mt-2 italic">{group.description || 'Chưa có mô tả'}</p>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-700">Thiết bị trong khu vườn</h3>
                    <button
                        onClick={() => setAddDeviceModalOpen(true)}
                        className="bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-all duration-300 flex items-center justify-center h-10 w-10"
                        title="Thêm thiết bị mới"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {groupDevices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {groupDevices.map(device => (
                            <InfoCard
                                key={device.id}
                                item={device}
                                type="device"
                                linkTo={`/devices/${device.id}`}
                                onDelete={() => onRemoveDeviceFromGroup(groupId, device.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Chưa có thiết bị nào trong khu vườn này.</p>
                )}
                
                {isAddDeviceModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Thêm thiết bị vào khu vườn</h3>
                            <AddDevice
                                devices={devices}
                                groups={groups}
                                currentGroupId={groupId}
                                onAddDeviceToGroup={handleAddDeviceAndCloseModal}
                            />
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setAddDeviceModalOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupSection;
