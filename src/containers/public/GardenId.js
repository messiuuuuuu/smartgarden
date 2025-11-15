import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { DeviceInfo, MoistureControl, PumpControl, HistoryChart, Settings} from '../../components';


const DeviceId = () => {
    const { deviceId } = useParams();
    const [soilMoisture, setSoilMoisture] = useState(0);
    const [pumpStatus, setPumpStatus] = useState(0);
    const [historyData, setHistoryData] = useState([]);
    const [deviceName, setDeviceName] = useState('');
    const [minMoisture, setMinMoisture] = useState('');
    const [maxMoisture, setMaxMoisture] = useState('');
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
        const minRef = ref(realtimedb, `devices/${deviceId}/doAmDat/min`);
        const maxRef = ref(realtimedb, `devices/${deviceId}/doAmDat/max`);
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
        onValue(minRef, (snapshot) => setMinMoisture(snapshot.val() || ''));
        onValue(maxRef, (snapshot) => setMaxMoisture(snapshot.val() || ''));
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
        const nameRef = ref(realtimedb, `devices/${deviceId}/name`);
        set(nameRef, newDeviceName)
            .then(() => {
                setDeviceName(newDeviceName);
                setEditingName(false);
            })
            .catch((error) => console.error("Lỗi khi cập nhật tên thiết bị:", error));
    };
    const handleCancelEdit = () => {
        setNewDeviceName(deviceName);
        setEditingName(false);
    };

    const handleDelete = async () => {
        const user = auth.currentUser;
        if (!user) return;
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        const user = auth.currentUser;
        if (!user) return;
        const userDeviceRef = ref(realtimedb, `users/${user.uid}/devices/${deviceId}`);
        set(userDeviceRef, false)
            .then(() => {
                setShowDeleteModal(false);
                navigate('/devices');
            })
            .catch((error) => console.error("Lỗi khi xóa thiết bị:", error));
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleMinMoistureChange = (e) => {
        const newMin = parseInt(e.target.value, 10);
        if (!isNaN(newMin)) {
            setMinMoisture(newMin);
            set(ref(realtimedb, `devices/${deviceId}/doAmDat/min`), newMin);
        }
    };

    const handleMaxMoistureChange = (e) => {
        const newMax = parseInt(e.target.value, 10);
        if (!isNaN(newMax)) {
            setMaxMoisture(newMax);
            set(ref(realtimedb, `devices/${deviceId}/doAmDat/max`), newMax);
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
                        minMoisture={minMoisture}
                        maxMoisture={maxMoisture}
                        handleMinMoistureChange={handleMinMoistureChange}
                        handleMaxMoistureChange={handleMaxMoistureChange}
                    />

                    <Settings time={time} handleTimeChange={handleTimeChange} />

                    <PumpControl pumpStatus={pumpStatus} handlePumpControl={handlePumpControl} />

                    <HistoryChart historyData={historyData} />

                    <button
                        onClick={() => navigate('/devices')}
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-all duration-200"
                    >
                        Trở về danh sách thiết bị
                    </button>
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Xác nhận xóa thiết bị</h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có chắc chắn muốn xóa thiết bị <span className="font-bold text-green-700">{deviceName || 'này'}</span>? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceId;
