import React, { useState, useEffect } from 'react';
import icons from '../untils/icon';
import swal from 'sweetalert2';

const { IoWaterOutline } = icons;

const MoistureControl = ({
    soilMoisture,
    setMoisture,
    handleSetMoistureChange,
}) => {
    const [draftMoisture, setDraftMoisture] = useState(setMoisture);

    useEffect(() => {
        setDraftMoisture(setMoisture);
    }, [setMoisture]);

    const handleSave = () => {
        const mockEvent = { target: { value: draftMoisture } };
        handleSetMoistureChange(mockEvent);
        swal.fire("Thành công!", "Đã lưu ngưỡng độ ẩm mới!", "success");
    };

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

            <div className="p-4 bg-green-50 rounded-lg shadow-sm mt-4">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Cài đặt Ngưỡng Độ Ẩm</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        Ngưỡng độ ẩm hiện tại: <span className="font-semibold text-green-700">{setMoisture}%</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chọn ngưỡng độ ẩm mong muốn: {draftMoisture}%</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={draftMoisture}
                            onChange={(e) => setDraftMoisture(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 font-semibold"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MoistureControl;
