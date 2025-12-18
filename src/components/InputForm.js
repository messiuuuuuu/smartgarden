import React, { memo } from 'react';

const InputForm = ({ label, type = 'text', value, setValue }) => {
    return (
        <div className="flex flex-col mb-4">
            <label htmlFor='input' className='text-sm font-semibold mb-1'>
                {label}
            </label>
            <input
                type={type} // Sử dụng thuộc tính type
                id='input' // Sửa lại id để không bị trùng lặp
                value={value} // Truyền giá trị
                onChange={(e) => setValue(e.target.value)} // Xử lý sự kiện thay đổi
                className="w-full p-2 border border-gray-300 rounded-md bg-white mt-1 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
            />
        </div>
    );
}

export default memo(InputForm);
