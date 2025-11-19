import React from 'react';
import DeviceCard from './DeviceCard';

const UnassignedDevice = ({ devices, groups }) => {
    const unassignedDevices = devices.filter(device => {
        return !Object.values(groups).some(group => group.devices && group.devices[device.id]);
    });

    if (unassignedDevices.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-teal-800 mb-6 bg-teal-50 p-5 rounded-xl shadow-sm text-center">Thiết Bị Chưa Được Phân Nhóm</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {unassignedDevices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );
};

export default UnassignedDevice;