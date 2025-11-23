import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, remove, push, serverTimestamp } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AddGroup from '../../components/AddGroup';
import GroupSection from '../../components/GroupSection';
import UnassignedDevice from '../../components/UnassignedDevice';
import GardenCard from './GardenCard';
import a from '../../assets/1.jpg'; // default image
import Swal from 'sweetalert2';

const GardenList = () => {
    const [devices, setDevices] = useState([]);
    const [groups, setGroups] = useState({});
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(a);
    const [error, setError] = useState(null);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const gardensPerPage = 9;

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const selectedGroupId = searchParams.get('group');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setError("Vui lòng đăng nhập để xem danh sách thiết bị");
                setLoading(false);
                return;
            }

            setLoading(true);
            const userRef = ref(realtimedb, `users/${user.uid}`);
            const onValueChange = onValue(userRef, (snapshot) => {
                const userData = snapshot.val() || {};
                const loadedGroups = userData.groups || {};
                const userDeviceIds = userData.devices || {};
                setGroups(loadedGroups);

                const devicesRef = ref(realtimedb, "devices");
                onValue(devicesRef, (snapshot) => {
                    const allDevices = snapshot.val() || {};
                    const linkedDevices = Object.keys(userDeviceIds)
                        .filter(id => allDevices[id])
                        .map(id => ({ id, ...allDevices[id] }));
                    setDevices(linkedDevices);
                    setLoading(false);
                }, (error) => {
                    setError("Lỗi khi tải dữ liệu thiết bị: " + error.message);
                    setLoading(false);
                });
            }, (error) => {
                setError("Lỗi khi tải dữ liệu người dùng: " + error.message);
                setLoading(false);
            });

            return () => onValueChange();
        });

        return () => unsubscribe();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleCancelAddGroup = () => {
        setIsAddGroupOpen(false);
        setNewGroupName('');
        setNewGroupDescription('');
        setNewImageFile(null);
        setPreviewImage(a);
        setError(null);
    };

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) {
            Swal.fire('Lỗi', 'Tên nhóm không được để trống.', 'error');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Swal.fire('Lỗi', 'Bạn phải đăng nhập để tạo nhóm.', 'error');
            return;
        }

        setLoading(true);
        let imageUrl = '';

        if (newImageFile) {
            const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
            const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;
            const formData = new FormData();
            formData.append('file', newImageFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'garden');

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || 'Cloudinary upload failed');
                }

                const data = await response.json();
                imageUrl = data.secure_url;
            } catch (error) {
                console.error('Error uploading image:', error);
                Swal.fire('Lỗi Tải Lên', `Lỗi khi tải ảnh lên: ${error.message}`, 'error');
                setLoading(false);
                return;
            }
        }

        const groupsRef = ref(realtimedb, `users/${user.uid}/groups`);
        const newGroupRef = push(groupsRef);
        const newGroupData = {
            name: newGroupName,
            description: newGroupDescription,
            imageUrl: imageUrl || a,
            createdAt: serverTimestamp(),
            devices: {}
        };

        set(newGroupRef, newGroupData)
            .then(() => {
                Swal.fire('Thành Công', 'Khu vườn mới đã được tạo.', 'success');
                handleCancelAddGroup();
            })
            .catch(error => {
                console.error("Firebase error:", error);
                Swal.fire('Lỗi Database', `Lỗi khi thêm nhóm: ${error.message}`, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddDeviceToGroup = (groupId, deviceId) => {
        const user = auth.currentUser;
        if (!user) return;

        const groupDeviceRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}/devices`);
        update(groupDeviceRef, { [deviceId]: true })
            .then(() => {
                Swal.fire('Thành công', 'Đã thêm thiết bị vào khu vườn.', 'success');
            })
            .catch(error => {
                Swal.fire('Lỗi', `Lỗi khi thêm thiết bị: ${error.message}`, 'error');
            });
    };

    const handleUpdateGroupInfo = async (groupId, newName, newDescription, imageFile) => {
        const user = auth.currentUser;
        if (!user) {
            Swal.fire('Lỗi', 'Bạn cần đăng nhập để thực hiện chức năng này.', 'error');
            return;
        }
        if (!newName.trim()) {
            Swal.fire('Lỗi', 'Tên nhóm không được để trống.', 'error');
            return;
        }

        setLoading(true);
        const updates = {
            name: newName,
            description: newDescription,
        };

        if (imageFile) {
            const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
            const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'garden');

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || 'Cloudinary upload failed');
                }
                const data = await response.json();
                updates.imageUrl = data.secure_url;
            } catch (error) {
                console.error('Error uploading image:', error);
                Swal.fire('Lỗi Tải Lên', `Lỗi khi tải ảnh lên: ${error.message}`, 'error');
                setLoading(false);
                return;
            }
        }

        const groupRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}`);
        update(groupRef, updates)
            .then(() => {
                Swal.fire('Thành công', 'Thông tin khu vườn đã được cập nhật.', 'success');
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật thông tin nhóm:", error);
                Swal.fire('Lỗi', `Lỗi khi cập nhật thông tin nhóm: ${error.message}`, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    };
        
    const handleDeleteGroup = (groupId) => {
        const user = auth.currentUser;
        if (!user) return;

        const groupRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}`);
        remove(groupRef)
            .then(() => {
                Swal.fire('Đã xóa!', 'Khu vườn của bạn đã được xóa.', 'success');
                setSearchParams({}); 
            })
            .catch(error => {
                Swal.fire('Lỗi', `Lỗi khi xóa nhóm: ${error.message}`, 'error');
            });
    };

    const handleRemoveDeviceFromGroup = (groupId, deviceId) => {
        const user = auth.currentUser;
        if (!user) {
            Swal.fire('Lỗi', 'Bạn cần đăng nhập để thực hiện chức năng này.', 'error');
            return;
        }

        const deviceRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}/devices/${deviceId}`);
        remove(deviceRef)
            .then(() => {
                Swal.fire('Thành Công', 'Đã xóa thiết bị khỏi khu vườn.', 'success');
                // The onValue listener will automatically update the UI.
            })
            .catch(error => {
                console.error("Lỗi khi xóa thiết bị khỏi nhóm:", error);
                Swal.fire('Lỗi', `Lỗi khi xóa thiết bị khỏi nhóm: ${error.message}`, 'error');
            });
    };

    const handleSelectGroup = (groupId) => {
        setSearchParams({ group: groupId });
    };

    const indexOfLastGarden = currentPage * gardensPerPage;
    const indexOfFirstGarden = indexOfLastGarden - gardensPerPage;
    const currentGardens = Object.entries(groups).slice(indexOfFirstGarden, indexOfLastGarden);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const selectedGroup = selectedGroupId ? groups[selectedGroupId] : null;

    return (
        <div className="min-h-screen bg-green-50 px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-green-600">
                        {selectedGroup ? selectedGroup.name : "Danh Sách Khu Vườn"}
                    </h1>
                    {selectedGroupId ? (
                        <button
                            onClick={() => setSearchParams({})}
                            className="bg-gray-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                        >
                            Quay lại danh sách
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsAddGroupOpen(true)}
                            className="bg-green-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Thêm Khu Vườn Mới
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
                        {error}
                    </div>
                )}

                {isAddGroupOpen && !selectedGroupId && (
                    <AddGroup
                        newGroupName={newGroupName}
                        setNewGroupName={setNewGroupName}
                        newGroupDescription={newGroupDescription}
                        setNewGroupDescription={setNewGroupDescription}
                        onAddGroup={handleAddGroup}
                        onCancel={handleCancelAddGroup}
                        handleImageChange={handleImageChange}
                        previewImage={previewImage}
                    />
                )}

                {selectedGroupId && selectedGroup ? (
                    <GroupSection
                        key={selectedGroupId}
                        group={selectedGroup}
                        groupId={selectedGroupId}
                        devices={devices}
                        groups={groups}
                        onAddDeviceToGroup={handleAddDeviceToGroup}
                        onDeleteGroup={handleDeleteGroup}
                        onRemoveDeviceFromGroup={handleRemoveDeviceFromGroup}
                        onUpdateGroupInfo={handleUpdateGroupInfo}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentGardens.length > 0 ? (
                                currentGardens.map(([groupId, group]) => (
                                    <GardenCard
                                        key={groupId}
                                        group={group}
                                        groupId={groupId}
                                        onSelectGroup={handleSelectGroup}
                                        isSelected={selectedGroupId === groupId}
                                    />
                                ))
                            ) : (
                                !isAddGroupOpen && <p className="text-center text-gray-500 col-span-3">Chưa có khu vườn nào. Hãy thêm một khu vườn mới!</p>
                            )}
                        </div>
                        
                        {Object.keys(groups).length > gardensPerPage && (
                            <div className="flex justify-center mt-8">
                                {Array.from({ length: Math.ceil(Object.keys(groups).length / gardensPerPage) }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === i + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mt-12">
                          <UnassignedDevice devices={devices} groups={groups} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GardenList;
