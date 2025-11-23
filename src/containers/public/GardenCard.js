import React from 'react';
import Swal from 'sweetalert2';
import a from '../../assets/1.jpg'; // default image

const GardenCard = ({ group, groupId, onSelectGroup, onDeleteGroup, isSelected }) => {
    const deviceCount = group.devices ? Object.keys(group.devices).length : 0;

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card's onClick from firing if it were on the parent

        Swal.fire({
            title: `Bạn có chắc muốn xóa khu vườn "${group.name}"?`,
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed && onDeleteGroup) {
                onDeleteGroup(groupId);
            }
        });
    };

    return (
        <div
            className={`relative flex items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg group h-64 border-4 ${isSelected ? 'border-teal-500' : 'border-transparent'}`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                    backgroundImage: `url(${group.imageUrl || a})`,
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            {/* Hover overlay with details and actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/50">
                <div className="relative text-center text-white p-4 w-full">
                    <h2 className="text-2xl font-bold">{group.name}</h2>
                    <p className="mt-2 text-md italic">
                        {group.description || 'Chưa có mô tả'}
                    </p>
                    <p className="mt-1 text-sm">
                        Số lượng thiết bị: <span className="font-medium">{deviceCount}</span>
                    </p>
                    {/* Action Buttons */}
                    <div className="mt-4 flex w-full justify-center gap-3">
                        <button
                            onClick={() => onSelectGroup(groupId)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Xem Chi Tiết</span>
                        </button>
                        {onDeleteGroup && (
                            <button
                                onClick={handleDelete}
                                title="Xóa khu vườn"
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M3 7h18M5 7l1.618-2.427A2 2 0 08.437 3h7.126a2 2 0 011.819 1.573L19 7"></path></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Default visible content (non-hover) */}
            <div className="relative w-full p-4 text-white transition-opacity duration-500 group-hover:opacity-0" onClick={() => onSelectGroup(groupId)}>
                 <h2 className="text-xl font-bold text-center">{group.name}</h2>
            </div>
        </div>
    );
};

export default GardenCard;
