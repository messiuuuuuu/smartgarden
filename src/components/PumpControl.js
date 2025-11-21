import React from 'react';

const PumpControl = ({ pumpStatus, handlePumpControl, soilMoisture, setMoisture }) => {
    const isAuto = pumpStatus === 20 || pumpStatus === 21;
    
    let statusText;
    if (isAuto) {
        if (soilMoisture < setMoisture) {
            pumpStatus = 21;
            statusText = 'Tự động (Bật)';
        } else {
            pumpStatus = 20;
            statusText = 'Tự động (Tắt)';
        }
    } else if (pumpStatus === 1) {
        statusText = 'Bật';
    } else {
        statusText = 'Tắt';
    }

    return (
        <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Điều khiển máy bơm</h2>
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => handlePumpControl(1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${pumpStatus === 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'}`}
                >
                    Bật
                </button>
                <button
                    onClick={() => handlePumpControl(0)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${pumpStatus === 0 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'}`}
                >
                    Tắt
                </button>
                <button
                    onClick={() => handlePumpControl(20)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isAuto ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                >
                    Tự động
                </button>
            </div>
            <p className="mt-2 text-gray-600">
                Trạng thái: <span className="font-semibold text-green-700">
                    {statusText}
                </span>
            </p>
        </div>
    );
};

export default PumpControl;