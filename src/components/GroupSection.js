import React, { useState } from 'react';
import AddDevice from './AddDevice';
import DeviceCard from './DeviceCard';

const GroupSection = ({ group, groupId, devices, groups, onAddDevice, onDeleteGroup, onRemoveDevice }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>
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
                        onClick={() => onDeleteGroup(groupId)}
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
                    onAddDevice={onAddDevice}
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
                            onRemoveDevice={onRemoveDevice}
                        />
                    ))}
            </div>
        </div>
    );
};

export default GroupSection;
