import React, { useState } from 'react';
import AddDevice from './AddDevice';
import DeviceCard from './DeviceCard';

const GroupSection = ({ group, groupId, devices, groups, onAddDeviceToGroup, onRemoveDeviceFromGroup, onUpdateGroupInfo }) => {
    const [isAddDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
    const [isRenameModalOpen, setRenameModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState(group.name);
    const [newGroupDescription, setNewGroupDescription] = useState(group.description || '');
    const [newImageFile, setNewImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(group.imageUrl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRename = () => {
        if (newGroupName) {
            onUpdateGroupInfo(groupId, newGroupName, newGroupDescription, newImageFile);
        }
        setRenameModalOpen(false);
    };

    const groupDevices = Object.keys(group.devices || {}).map(deviceId => {
        return devices.find(d => d.id === deviceId);
    }).filter(Boolean);

    const handleAddDeviceAndCloseModal = (deviceId) => {
        onAddDeviceToGroup(groupId, deviceId);
        setAddDeviceModalOpen(false); // Close modal after adding
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setRenameModalOpen(true)} className="text-gray-500 hover:text-green-600 p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                    </button>
                </div>
            </div>

            {isRenameModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin</h3>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <textarea
                            value={newGroupDescription}
                            onChange={(e) => setNewGroupDescription(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            rows="3"
                            placeholder="Mô tả khu vườn"
                        />
                        <div className="mt-4">
                            <label className="block font-medium text-gray-700">Ảnh khu vườn</label>
                            <div className="mt-1 flex items-center">
                                <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                                    <img className="h-full w-full object-cover" src={previewImage} alt="Garden" />
                                </span>
                                <label htmlFor="file-upload" className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                    <span>Thay đổi</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={() => setRenameModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300">Hủy</button>
                            <button onClick={handleRename} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-gray-600 mt-2 italic">{group.description || 'Chưa có mô tả'}</p>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-700">Thiết bị trong khu vườn</h3>
                    <button
                        onClick={() => setAddDeviceModalOpen(true)}
                        className="bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-all duration-300 flex items-center justify-center h-10 w-10"
                        title="Thêm thiết bị mới"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {groupDevices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupDevices.map(device => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                                onRemove={() => onRemoveDeviceFromGroup(groupId, device.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Chưa có thiết bị nào trong khu vườn này.</p>
                )}
                
                {isAddDeviceModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Thêm thiết bị vào khu vườn</h3>
                            <AddDevice
                                devices={devices}
                                groups={groups}
                                currentGroupId={groupId}
                                onAddDeviceToGroup={handleAddDeviceAndCloseModal}
                            />
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setAddDeviceModalOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupSection;
