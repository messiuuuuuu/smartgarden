import React from 'react';
import InfoCard from './InfoCard';

const UnassignedDevices = ({ devices, groups }) => {
    const assignedDeviceIds = Object.values(groups).reduce((acc, group) => {
        if (group.devices) {
            return new Set([...acc, ...Object.keys(group.devices)]);
        }
        return acc;
    }, new Set());

    const unassigned = devices.filter(device => !assignedDeviceIds.has(device.id));

    // If there are no unassigned devices, render nothing.
    if (unassigned.length === 0) {
        return null;
    }

    // Otherwise, render the list of unassigned devices.
    return (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Các Thiết Bị Chưa Được Gán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {unassigned.map(device => (
                    <InfoCard
                        key={device.id}
                        item={device}
                        type="device"
                    />
                ))}
            </div>
        </div>
    );
};

export default UnassignedDevices;
