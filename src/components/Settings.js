import React from 'react';

const Settings = ({ time, handleTimeChange }) => {
    return (
        <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Thời gian cập nhật dữ liệu</h2>
            <input
                type="number"
                value={time}
                onChange={handleTimeChange}
                className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Nhập thời gian (giây)"
            />
        </div>
    );
};

export default Settings;
