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
                <div className="mt-4 flex justify-center gap-3">
                    <Link to={`/devices/${device.id}`}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Xem Chi Tiết</span>
                        </button>
                    </Link>
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M3 7h18M5 7l1.618-2.427A2 2 0 018.437 3h7.126a2 2 0 011.819 1.573L19 7"></path></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeviceCard;
