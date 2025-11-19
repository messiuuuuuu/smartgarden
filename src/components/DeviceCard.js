import React from 'react';
import { Link } from 'react-router-dom';
import a from '../assets/1.jpg';
import Swal from 'sweetalert2';

const DeviceCard = ({ device, onRemoveDevice, groupId }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105">
        <div className="relative">
            <img
                src={a}
                alt={device.name}
                className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Hoạt động
            </div>
        </div>
        <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
                {device.name}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
                <span role="img" aria-label="drop">💧</span> Độ ẩm: {device.doAmDat?.current ?? 'N/A'}%
            </p>
            <div className="flex gap-2">
                <Link to={`/devices/${device.id}`} className="flex-1">
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Xem chi tiết
                    </button>
                </Link>
                {groupId && onRemoveDevice && (
                    <button
                        onClick={() => Swal.fire({
                            title: 'Bạn có chắc chắn muốn xóa thiết bị này khỏi khu vườn?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Xóa',
                            cancelButtonText: 'Hủy'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                onRemoveDevice(groupId, device.id);
                            }
                        })}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default DeviceCard;
