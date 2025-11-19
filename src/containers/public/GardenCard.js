import React from 'react';

const GardenCard = ({ group, groupId, onSelectGroup, isSelected }) => {
    const deviceCount = group.devices ? Object.keys(group.devices).length : 0;

    return (
        <div
            onClick={() => onSelectGroup(groupId)}
            className={`bg-white rounded-3xl shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer border-4 ${isSelected ? 'border-teal-500' : 'border-transparent'}`}
        >
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 truncate">
                    {group.name}
                </h2>
                <p className="text-gray-600 text-sm">
                    Số lượng thiết bị: <span className="text-teal-700 font-medium">{deviceCount}</span>
                </p>
            </div>
        </div>
    );
};

export default GardenCard;
