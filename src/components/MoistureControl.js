import React from 'react';
import icons from '../untils/icon';

const { IoWaterOutline } = icons;

const MoistureControl = ({
    soilMoisture,
    minMoisture,
    maxMoisture,
    handleMinMoistureChange,
    handleMaxMoistureChange,
}) => {
    return (
        <>
            <div className="p-6 bg-white rounded-xl shadow-lg flex items-center space-x-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <IoWaterOutline className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="text-xl font-bold text-gray-800">Độ ẩm đất hiện tại</div>
                    <p className="text-4xl font-extrabold text-gray-900 ">{soilMoisture !== null ? `${soilMoisture}%` : '--%'}</p>
                </div>
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            className="text-gray-200"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className="text-blue-500"
                            strokeWidth="10"
                            strokeDasharray={`${(soilMoisture / 100) * 2 * Math.PI * 45}, ${2 * Math.PI * 45}`}
                            strokeDashoffset={0}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-700">
                        {soilMoisture}%
                    </div>
                </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Giới hạn độ ẩm</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Min</label>
                        <input
                            type="number"
                            value={minMoisture}
                            onChange={handleMinMoistureChange}
                            className="w-full px-4 py-2 mt-1 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            placeholder="Nhập giá trị min"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max</label>
                        <input
                            type="number"
                            value={maxMoisture}
                            onChange={handleMaxMoistureChange}
                            className="w-full px-4 py-2 mt-1 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            placeholder="Nhập giá trị max"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MoistureControl;
