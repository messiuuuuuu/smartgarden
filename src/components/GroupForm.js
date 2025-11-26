
import React, { useState, useEffect } from 'react';
import a from '../assets/1.jpg'; // Default image

const GroupForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(a);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPreviewImage(initialData.imageUrl || a);
            setImage(null); // Reset image file on new open
        } else {
            // Reset form for adding new
            setName('');
            setDescription('');
            setPreviewImage(a);
            setImage(null);
        }
    }, [initialData, isOpen]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        onSave({
            name,
            description,
            image, // Pass the file object
        });
        onClose(); // Close modal after saving
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{initialData ? 'Chỉnh sửa khu vườn' : 'Thêm khu vườn mới'}</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên khu vườn"
                    className="w-full p-2 border rounded mb-4"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    rows="3"
                    placeholder="Mô tả khu vườn"
                />
                <div className="mt-4">
                    <label className="block font-medium text-gray-700">Ảnh khu vườn</label>
                    <div className="mt-1 flex items-center">
                        <span className="inline-block h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                            <img className="h-full w-full object-cover" src={previewImage} alt="Vorschau" />
                        </span>
                        <label htmlFor="file-upload" className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <span>{initialData ? 'Thay đổi' : 'Tải lên'}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300">Hủy</button>
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Lưu</button>
                </div>
            </div>
        </div>
    );
};

export default GroupForm;
