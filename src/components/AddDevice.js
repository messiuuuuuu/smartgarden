import React, { useState } from 'react';

const AddDevice = ({ groupId, devices, groups, onAddDevice }) => {
    const [selectedDevice, setSelectedDevice] = useState('');

    const unassignedDevices = devices.filter(device => {
        return !Object.values(groups).some(group => group.devices && group.devices[device.id]);
    });

    const handleAdd = () => {
        if (!selectedDevice) return;
        onAddDevice(groupId, selectedDevice);
        setSelectedDevice('');
    };

    return (
        <div className="mt-4 bg-white p-5 rounded-xl shadow-md border border-teal-100">
            <div className="flex gap-4">
                <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 bg-gray-50"
                >
                    <option value="">Chọn thiết bị</option>
                    {unassignedDevices.map(device => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                    ))}
                </select>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300"
                >
                    Thêm
                </button>
            </div>
            {unassignedDevices.length === 0 && (
                <p className="text-gray-600 text-sm mt-2">Không có thiết bị nào chưa được phân nhóm.</p>
            )}
        </div>
    );
};

export default AddDevice;
