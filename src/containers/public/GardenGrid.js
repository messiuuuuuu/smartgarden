import React from 'react';
import GardenCard from './GardenCard';

const GardenGrid = ({ groups, onSelectGroup, selectedGroupId }) => {
    if (Object.keys(groups).length === 0) {
        return <p className="text-gray-600 text-center">Không có khu vườn nào.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groups).map(([groupId, group]) => (
                <GardenCard
                    key={groupId}
                    group={group}
                    groupId={groupId}
                    onSelectGroup={onSelectGroup}
                    isSelected={selectedGroupId === groupId}
                />
            ))}
        </div>
    );
};

export default GardenGrid;
