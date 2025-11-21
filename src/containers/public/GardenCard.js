import React from 'react';
import a from '../../assets/1.jpg'; // default image

const GardenCard = ({ group, groupId, onSelectGroup, isSelected }) => {
    const deviceCount = group.devices ? Object.keys(group.devices).length : 0;

    return (
        <div
            onClick={() => onSelectGroup(groupId)}
            className={`relative flex items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg group h-64 border-4 ${isSelected ? 'border-teal-500' : 'border-transparent'} cursor-pointer`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                    backgroundImage: `url(${group.image || a})`,
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/50">
                <div className="relative text-center text-white p-4">
                    <h2 className="text-2xl font-bold">{group.name}</h2>
                    <p className="mt-2 text-md italic">
                        {group.description || 'Chưa có mô tả'}
                    </p>
                    <p className="mt-1 text-sm">
                        Số lượng thiết bị: <span className="font-medium">{deviceCount}</span>
                    </p>
                </div>
            </div>

            <div className="relative w-full p-4 text-white transition-opacity duration-500 group-hover:opacity-0">
                 <h2 className="text-xl font-bold text-center">{group.name}</h2>
            </div>
        </div>
    );
};

export default GardenCard;
