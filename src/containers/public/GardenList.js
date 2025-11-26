import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, remove, push, serverTimestamp } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import GroupForm from '../../components/GroupForm';
import GroupSection from '../../components/GroupSection';
import UnassignedDevice from '../../components/UnassignedDevice';
import InfoCard from '../../components/InfoCard'; // Thay thế GardenCard
import a from '../../assets/1.jpg';
import Swal from 'sweetalert2';

const GardenList = () => {
    const [devices, setDevices] = useState([]);
    const [groups, setGroups] = useState({});
    const [error, setError] = useState(null);
    const [isAddFormOpen, setAddFormOpen] = useState(false);
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
            onValue(userRef, (snapshot) => {
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
                }, (err) => {
                    setError("Lỗi khi tải dữ liệu thiết bị: " + err.message);
                    setLoading(false);
                });
            }, (err) => {
                setError("Lỗi khi tải dữ liệu người dùng: " + err.message);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, []);

    const handleAddGroup = async ({ name, description, image }) => {
        if (!name.trim()) {
            Swal.fire('Lỗi', 'Tên khu vườn không được để trống.', 'error');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Swal.fire('Lỗi', 'Bạn phải đăng nhập để tạo khu vườn.', 'error');
            return;
        }

        setLoading(true);
        let imageUrl = '';
        if (image) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
            formData.append('folder', 'garden');
            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Tải ảnh lên thất bại');
                const data = await res.json();
                imageUrl = data.secure_url;
            } catch (err) {
                Swal.fire('Lỗi Tải Lên', err.message, 'error');
                setLoading(false);
                return;
            }
        }

        const newGroupRef = push(ref(realtimedb, `users/${user.uid}/groups`));
        set(newGroupRef, {
            name,
            description,
            imageUrl: imageUrl || a,
            createdAt: serverTimestamp(),
            devices: {}
        }).then(() => {
            Swal.fire('Thành Công', 'Khu vườn mới đã được tạo.', 'success');
            setAddFormOpen(false);
        }).catch(err => {
            Swal.fire('Lỗi Database', `Lỗi khi thêm khu vườn: ${err.message}`, 'error');
        }).finally(() => setLoading(false));
    };

    const handleUpdateGroupInfo = async (groupId, newName, newDescription, imageFile) => {
        const user = auth.currentUser;
        if (!user) return;
        if (!newName.trim()) {
            Swal.fire('Lỗi', 'Tên khu vườn không được để trống.', 'error');
            return;
        }

        setLoading(true);
        const updates = { name: newName, description: newDescription };
        if (imageFile) {
             try {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Tải ảnh lên thất bại');
                const data = await res.json();
                updates.imageUrl = data.secure_url;
            } catch (err) {
                Swal.fire('Lỗi Tải Lên', err.message, 'error');
                setLoading(false);
                return;
            }
        }

        update(ref(realtimedb, `users/${user.uid}/groups/${groupId}`), updates)
            .then(() => Swal.fire('Thành công', 'Thông tin khu vườn đã được cập nhật.', 'success'))
            .catch(err => Swal.fire('Lỗi', `Lỗi khi cập nhật: ${err.message}`, 'error'))
            .finally(() => setLoading(false));
    };
        
    const handleDeleteGroup = (groupId) => {
        const user = auth.currentUser;
        if (!user) return;

        remove(ref(realtimedb, `users/${user.uid}/groups/${groupId}`))
            .then(() => {
                Swal.fire('Đã xóa!', 'Khu vườn đã được xóa.', 'success');
                setSearchParams({});
            })
            .catch(err => Swal.fire('Lỗi', `Lỗi khi xóa: ${err.message}`, 'error'));
    };

    const handleAddDeviceToGroup = (groupId, deviceId) => {
        const user = auth.currentUser;
        if (!user) return;
        update(ref(realtimedb, `users/${user.uid}/groups/${groupId}/devices`), { [deviceId]: true })
            .then(() => Swal.fire('Thành công', 'Đã thêm thiết bị vào khu vườn.', 'success'))
            .catch(err => Swal.fire('Lỗi', `Lỗi khi thêm thiết bị: ${err.message}`, 'error'));
    };

    const handleRemoveDeviceFromGroup = (groupId, deviceId) => {
        const user = auth.currentUser;
        if (!user) return;
        remove(ref(realtimedb, `users/${user.uid}/groups/${groupId}/devices/${deviceId}`))
            .then(() => Swal.fire('Thành Công', 'Đã xóa thiết bị khỏi khu vườn.', 'success'))
            .catch(err => Swal.fire('Lỗi', `Lỗi khi xóa thiết bị: ${err.message}`, 'error'));
    };

    const handleSelectGroup = (groupId) => setSearchParams({ group: groupId });

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
                        <button onClick={() => setSearchParams({})} className="bg-gray-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-gray-600">
                            Quay lại danh sách
                        </button>
                    ) : (
                        <button onClick={() => setAddFormOpen(true)} className="bg-green-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-600">
                           + Thêm Khu Vườn Mới
                        </button>
                    )}
                </div>

                {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                <GroupForm 
                    isOpen={isAddFormOpen && !selectedGroupId}
                    onClose={() => setAddFormOpen(false)}
                    onSave={handleAddGroup}
                />

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
                            {currentGardens.map(([groupId, group]) => (
                                <InfoCard
                                    key={groupId}
                                    item={group}
                                    type="garden"
                                    onSelect={() => handleSelectGroup(groupId)}
                                    onDelete={() => handleDeleteGroup(groupId)}
                                    isSelected={selectedGroupId === groupId}
                                />
                            ))}
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
