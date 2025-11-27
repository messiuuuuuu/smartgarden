import React, { useState, useEffect } from 'react';

const GroupForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || '');
                setDescription(initialData.description || '');
                setPreviewImage(initialData.imageUrl || null);
                setImage(null);
            } else {
                setName('');
                setDescription('');
                setPreviewImage(null);
                setImage(null);
            }
        }
    }, [initialData, isOpen]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewImage(null);
    };

    const handleSave = () => {
        onSave({
            name,
            description,
            image,
        });
        onClose();
    };

    const isSaveDisabled = !name;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-left">{initialData ? 'Chỉnh sửa khu vườn' : 'Thêm Khu Vườn Mới'}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tên khu vườn</label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên khu vườn"
                    className="w-full p-2 border border-gray-300 rounded-md bg-white mt-1 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white mt-1 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    placeholder="Nhập mô tả cho khu vườn"
                />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Ảnh khu vườn</label>
                    {previewImage ? (
                        <div className="relative mt-1">
                            <img className="w-full h-auto object-cover rounded-md" src={previewImage} alt="Preview" />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-700 hover:text-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md mt-1">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Tải ảnh lên
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    )}
                </div>


                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-200">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className={`text-white px-4 py-2 rounded-lg ${isSaveDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                        disabled={isSaveDisabled}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupForm;
