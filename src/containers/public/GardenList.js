import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, remove } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AddGroup from '../../components/AddGroup';
import GroupSection from '../../components/GroupSection';
import UnassignedDevice from '../../components/UnassignedDevice';

const GardenList = () => {
    const [devices, setDevices] = useState([]);
    const [groups, setGroups] = useState({});
    const [newGroupName, setNewGroupName] = useState('');
    const [editingGroupName, setEditingGroupName] = useState(false);
    const [error, setError] = useState(null);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGroupId, setSelectedGroupId] = useState(null); // New state for selected group
    const gardensPerPage = 9;

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
                }, (error) => {
                    setError("Lỗi khi tải dữ liệu thiết bị: " + error.message);
                    setLoading(false);
                });
            }, (error) => {
                setError("Lỗi khi tải dữ liệu người dùng: " + error.message);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, []);

    const handleAddGroup = () => {
        if (!newGroupName.trim()) {
            setError("Tên nhóm không được để trống");
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        const newGroupRef = ref(realtimedb, `users/${user.uid}/groups/${Date.now()}`);
        set(newGroupRef, {
            name: newGroupName,
            devices: {}
        })
            .then(() => {
                setNewGroupName('');
                setIsAddGroupOpen(false);
                setError(null);
            })
            .catch(error => setError("Lỗi khi thêm nhóm: " + error.message));
    };

    const handleAddDeviceToGroup = (groupId, deviceId) => {
        const user = auth.currentUser;
        if (!user) return;

        const groupDeviceRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}/devices`);
        update(groupDeviceRef, { [deviceId]: true })
            .then(() => setError(null))
            .catch(error => setError("Lỗi khi thêm thiết bị: " + error.message));
    };

    const handleRenameGroup = (groupId, newName) => {
        const user = auth.currentUser;
        if (!user) {
            setError("Bạn cần đăng nhập để thực hiện chức năng này.");
            return;
        }
        if (!newName.trim()) {
            setError("Tên nhóm không được để trống");
            return;
        }

        const groupRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}`);
        update(groupRef, { name: newName })
            .then(() => {
                setError(null);
            })
            .catch((error) => {
                setError("Lỗi khi đổi tên nhóm: " + error.message);
            });
    };
        
    const handleDeleteGroup = (groupId) => {
        const user = auth.currentUser;
        if (!user) return;

        const groupRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}`);
        remove(groupRef)
            .then(() => {
                setError(null);
                setSelectedGroupId(null); // Go back to grid view after deletion
            })
            .catch(error => setError("Lỗi khi xóa nhóm: " + error.message));
    };

    const handleRemoveDeviceFromGroup = (groupId, deviceId) => {
        const user = auth.currentUser;
        if (!user) return;

        const deviceRef = ref(realtimedb, `users/${user.uid}/groups/${groupId}/devices/${deviceId}`);
        remove(deviceRef)
            .then(() => {
                const updatedGroups = { ...groups };
                if (updatedGroups[groupId] && updatedGroups[groupId].devices) {
                    delete updatedGroups[groupId].devices[deviceId];
                    setGroups(updatedGroups);
                }
                setError(null);
            })
            .catch(error => setError("Lỗi khi xóa thiết bị khỏi nhóm: " + error.message));
    };

    const handleSelectGroup = (groupId) => {
        setSelectedGroupId(groupId);
    };

    const indexOfLastGarden = currentPage * gardensPerPage;
    const indexOfFirstGarden = indexOfLastGarden - gardensPerPage;
    const currentGardens = Object.entries(groups).slice(indexOfFirstGarden, indexOfLastGarden);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-600">Đang tải dữ liệu...</div>;
    }

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
                            onClick={() => setSelectedGroupId(null)}
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
                        onAddGroup={handleAddGroup}
                        onCancel={() => setIsAddGroupOpen(false)}
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
                        handleRenameGroup={handleRenameGroup}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentGardens.length > 0 ? (
                                currentGardens.map(([groupId, group]) => (
                                    <div
                                        key={groupId}
                                        onClick={() => handleSelectGroup(groupId)}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{group.name}</h3>
                                            <p className="text-gray-600">
                                                Số lượng thiết bị: {group.devices ? Object.keys(group.devices).length : 0}
                                            </p>
                                        </div>
                                    </div>
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