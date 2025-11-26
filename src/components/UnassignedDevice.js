import React from 'react';
import InfoCard from './InfoCard'; // Thay thế DeviceCard

const UnassignedDevices = ({ devices, groups }) => {
    // Lấy danh sách tất cả các ID thiết bị có trong các nhóm
    const assignedDeviceIds = Object.values(groups).reduce((acc, group) => {
        if (group.devices) {
            return new Set([...acc, ...Object.keys(group.devices)]);
        }
        return acc;
    }, new Set());

    // Lọc ra các thiết bị chưa được gán vào nhóm nào
    const unassigned = devices.filter(device => !assignedDeviceIds.has(device.id));

    return (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Các Thiết Bị Chưa Được Gán</h3>
            {unassigned.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {unassigned.map(device => (
                        <InfoCard
                            key={device.id}
                            item={device}
                            type="device"
                            // Các thiết bị chưa được gán không cần hành động xóa hoặc chọn
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 italic mt-4">Tất cả các thiết bị đã được gán vào khu vườn.</p>
            )}
        </div>
    );
};

export default UnassignedDevices;
