import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set, update } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { DeviceInfo, MoistureControl, PumpControl, HistoryChart, Settings} from '../../components';
import Swal from 'sweetalert2';
import a from '../../assets/1.jpg'; // default image

const DeviceId = () => {
    const { deviceId } = useParams();
    const [soilMoisture, setSoilMoisture] = useState(0);
    const [pumpStatus, setPumpStatus] = useState(0);
    const [historyData, setHistoryData] = useState([]);
    const [deviceName, setDeviceName] = useState('');
    const [setMoisture, setSetMoisture] = useState('');
    const [time, setTime] = useState('');
    const navigate = useNavigate();
    const [editingName, setEditingName] = useState(false);
    const [newDeviceName, setNewDeviceName] = useState('');
    const [groupId, setGroupId] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(a);

    useEffect(() => {
        if (!deviceId) return;

        const deviceRef = ref(realtimedb, `devices/${deviceId}`);

        onValue(deviceRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSoilMoisture(data.doAmDat?.current || 0);
                setPumpStatus(data.mayBom?.trangThai || 0);
                setDeviceName(data.name || '');
                setNewDeviceName(data.name || '');
                setSetMoisture(data.doAmDat?.set || '');
                setTime(data.time || '');
                setPreviewImage(data.imageUrl || a);
                
                const history = data.doAmDat?.history;
                if (history) {
                    const historyArray = Object.keys(history).map((key) => ({
                        time: new Date(history[key].time).getTime(),
                        value: parseFloat(history[key].value),
                    }));
                    setHistoryData(historyArray);
                }
            }
        });

        const usersRef = ref(realtimedb, 'users');
        onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            let foundGroupId = null;
            if (usersData) {
                for (const userId of Object.keys(usersData)) {
                    const user = usersData[userId];
                    if (user.groups) {
                        for (const gId of Object.keys(user.groups)) {
                            const group = user.groups[gId];
                            if (group.devices && group.devices[deviceId]) {
                                foundGroupId = gId;
                                break;
                            }
                        }
                    }
                    if (foundGroupId) break;
                }
            }
            setGroupId(foundGroupId);
        });
    }, [deviceId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handlePumpControl = (status) => {
        const pumpStatusRef = ref(realtimedb, `devices/${deviceId}/mayBom/trangThai`);
        set(pumpStatusRef, status).catch((error) =>
            console.error("Lỗi khi cập nhật trạng thái máy bơm:", error)
        );
    };

    const handleEditName = () => setEditingName(true);
    const handleSaveName = async () => {
        let imageUrl = previewImage;
        if (newImageFile) {
            const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
            const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

            const formData = new FormData();
            formData.append('file', newImageFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'device'); 

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.secure_url) {
                    imageUrl = data.secure_url;
                } else {
                    Swal.fire('Lỗi!', 'Lỗi khi tải ảnh lên.', 'error');
                    return;
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                Swal.fire('Lỗi!', 'Lỗi khi tải ảnh lên.', 'error');
                return;
            }
        }

                const deviceRef = ref(realtimedb, `devices/${deviceId}`);
                const updates = {
                    name: newDeviceName,
                    imageUrl: imageUrl
                };

                update(deviceRef, updates)
                    .then(() => {
                        setDeviceName(newDeviceName);
                        setEditingName(false);
                        setNewImageFile(null); 
                        Swal.fire('Thành Công', 'Thông tin thiết bị đã được cập nhật.', 'success');
                    })
                    .catch((error) => {
                        console.error("Lỗi khi lưu thông tin:", error);
                        Swal.fire('Lỗi', 'Đã xảy ra lỗi khi lưu thông tin.', 'error');
                    });
            
    };
    const handleCancelEdit = () => {
        setNewDeviceName(deviceName);
        setEditingName(false);
    };

    const handleDelete = async () => {
        const user = auth.currentUser;
        if (!user) return;

        Swal.fire({
            title: 'Xác nhận xóa thiết bị',
            html: `Bạn có chắc chắn muốn xóa thiết bị <span class="font-bold text-green-700">${deviceName || 'này'}</span>? `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                const userDeviceRef = ref(realtimedb, `users/${user.uid}/devices/${deviceId}`);
                set(userDeviceRef, false)
                    .then(() => {
                        navigate('/devices');
                    })
                    .catch((error) => console.error("Lỗi khi xóa thiết bị:", error));
            }
        });
    };

    const handleSetMoistureChange = (e) => {
        const newSet = parseInt(e.target.value, 10);
        if (!isNaN(newSet)) {
            setSetMoisture(newSet);
            set(ref(realtimedb, `devices/${deviceId}/doAmDat/set`), newSet);
        }
    };

    const handleTimeChange = (e) => {
        const newTime = parseInt(e.target.value, 10);
        if (!isNaN(newTime)) {
            setTime(newTime);
            set(ref(realtimedb, `devices/${deviceId}/time`), newTime);
        }
    };

    return (
        <div className="min-h-screen bg-green-100 p-6 flex items-center justify-center">
            <div className="relative bg-green-100 shadow-2xl rounded-2xl w-full max-w-4xl p-8 transform transition-all hover:scale-[1.01]">
                <button
                    onClick={() => navigate(groupId ? `/devices?group=${groupId}` : '/devices')}
                    className="absolute top-8 left-8 bg-gray-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 z-10"
                >
                    Trở về khu vườn
                </button>
                <DeviceInfo
                    deviceName={deviceName}
                    editingName={editingName}
                    newDeviceName={newDeviceName}
                    setNewDeviceName={setNewDeviceName}
                    handleEditName={handleEditName}
                    handleSaveName={handleSaveName}
                    handleCancelEdit={handleCancelEdit}
                    handleDelete={handleDelete}
                    handleImageChange={handleImageChange}
                    previewImage={previewImage}
                />

                <div className="space-y-8 mt-8">
                    <MoistureControl
                        soilMoisture={soilMoisture}
                        setMoisture={setMoisture}
                        handleSetMoistureChange={handleSetMoistureChange}
                    />

                    <Settings time={time} handleTimeChange={handleTimeChange} />

                    <PumpControl pumpStatus={pumpStatus} handlePumpControl={handlePumpControl} soilMoisture={soilMoisture} setMoisture={setMoisture} />

                    <HistoryChart historyData={historyData} />
                </div>
            </div>
        </div>
    );
};

export default DeviceId;
