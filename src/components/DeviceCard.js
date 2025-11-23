import React from 'react';
import { Link } from 'react-router-dom';
import a from '../assets/1.jpg'; // Assuming this is your default device image

const DeviceCard = ({ device, onRemove }) => {

    const getPumpStatus = (mayBom) => {
        if (mayBom === undefined || mayBom.trangThai === undefined) {
            return 'N/A';
        }
        const status = mayBom.trangThai;
        switch (status) {
            case 0:
                return 'Tắt';
            case 1:
                return 'Bật';
            case 20:
                return 'Tự động (Tắt)';
            case 21:
                return 'Tự động (Bật)';
            default:
                return 'Không xác định';
        }
    };


    return (
        <div className="relative flex items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg group h-64">
            <div
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                    backgroundImage: `url(${device.imageUrl || a})`,
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="relative flex flex-col items-center text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out w-full">
                <h2 className="text-xl font-bold text-center">{device.name}</h2>
                <p className="mt-2 text-sm italic text-center">
                    <span role="img" aria-label="drop">💧</span> Độ ẩm: {device.doAmDat?.current ?? 'N/A'}%
                </p>
                <p className="mt-1 text-sm italic text-center">
                    Máy bơm: {getPumpStatus(device.mayBom)}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <Link to={`/devices/${device.id}`} className="w-full sm:w-auto">
                        <button className="w-full px-4 py-2 bg-green-500 text-white font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400 whitespace-nowrap">
                            Xem Chi Tiết
                        </button>
                    </Link>
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="w-full px-4 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400 whitespace-nowrap"
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeviceCard;
