import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { DeviceInfo, MoistureControl, PumpControl, HistoryChart, Settings} from '../../components';
import Swal from 'sweetalert2';

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (!deviceId) return;

        const moistureRef = ref(realtimedb, `devices/${deviceId}/doAmDat`);
        const pumpStatusRef = ref(realtimedb, `devices/${deviceId}/mayBom/trangThai`);
        const historyRef = ref(realtimedb, `devices/${deviceId}/doAmDat/history`);
        const nameRef = ref(realtimedb, `devices/${deviceId}/name`);
        const setRef = ref(realtimedb, `devices/${deviceId}/doAmDat/set`);
        const timeRef = ref(realtimedb, `devices/${deviceId}/time`);

        onValue(nameRef, (snapshot) => {
            const name = snapshot.val();
            setDeviceName(name || '');
            setNewDeviceName(name || '');
        });
        onValue(moistureRef, (snapshot) => setSoilMoisture(snapshot.val()?.current || 0));
        onValue(pumpStatusRef, (snapshot) => setPumpStatus(snapshot.val() || 0));
        onValue(historyRef, (snapshot) => {
            const history = snapshot.val();
            if (history) {
                const historyArray = Object.keys(history).map((key) => ({
                    time: new Date(history[key].time).getTime(),
                    value: parseFloat(history[key].value),
                }));
                setHistoryData(historyArray);
            }
        });
        onValue(setRef, (snapshot) => setSetMoisture(snapshot.val() || ''));
        onValue(timeRef, (snapshot) => setTime(snapshot.val() || ''));
    }, [deviceId]);


    const handlePumpControl = (status) => {
        const pumpStatusRef = ref(realtimedb, `devices/${deviceId}/mayBom/trangThai`);
        set(pumpStatusRef, status).catch((error) =>
            console.error("Lỗi khi cập nhật trạng thái máy bơm:", error)
        );
    };

    const handleEditName = () => setEditingName(true);
    const handleSaveName = () => {
        Swal.fire({
            title: 'Lưu Tên Thiết Bị',
            text: `Bạn có chắc chắn muốn lưu tên thiết bị là "${newDeviceName}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const nameRef = ref(realtimedb, `devices/${deviceId}/name`);
                set(nameRef, newDeviceName)
                    .then(() => {
                        setDeviceName(newDeviceName);
                        setEditingName(false);
                        Swal.fire('Thành Công', 'Tên thiết bị đã được cập nhật.', 'success');
                    })
                    .catch((error) => {
                        console.error("Lỗi khi lưu tên thiết bị:", error);
                        Swal.fire('Lỗi', 'Đã xảy ra lỗi khi lưu tên thiết bị.', 'error');
                    });
            }
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
            <div className="bg-green-100 shadow-2xl rounded-2xl w-full max-w-4xl p-8 transform transition-all hover:scale-[1.01]">
                <DeviceInfo
                    deviceName={deviceName}
                    editingName={editingName}
                    newDeviceName={newDeviceName}
                    setNewDeviceName={setNewDeviceName}
                    handleEditName={handleEditName}
                    handleSaveName={handleSaveName}
                    handleCancelEdit={handleCancelEdit}
                    handleDelete={handleDelete}
                />

                <div className="space-y-8">
                    <MoistureControl
                        soilMoisture={soilMoisture}
                        setMoisture={setMoisture}
                        handleSetMoistureChange={handleSetMoistureChange}
                    />

                    <Settings time={time} handleTimeChange={handleTimeChange} />

                    <PumpControl pumpStatus={pumpStatus} handlePumpControl={handlePumpControl} soilMoisture={soilMoisture} setMoisture={setMoisture} />

                    <HistoryChart historyData={historyData} />

                    <button
                        onClick={() => navigate('/devices')}
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-all duration-200"
                    >
                        Trở về danh sách khu vườn
                    </button>
                </div>

                
            </div>
        </div>
    );
};

export default DeviceId;
