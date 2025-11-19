import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { auth, realtimedb } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import anonAvatar from '../../assets/anon-avatar.png';
import Swal from 'sweetalert2';

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setEmail(currentUser.email);
                const userRef = ref(realtimedb, `users/${currentUser.uid}`);
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setDisplayName(data.displayName || '');
                        setAvatar(data.avatar || '');
                        setPreviewAvatar(data.avatar || anonAvatar);
                    }
                });
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setIsUploading(true);
        let avatarUrl = avatar;

        if (newAvatarFile) {
            const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
            const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;
            
            const formData = new FormData();
            formData.append('file', newAvatarFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'avatar');
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.secure_url) {
                    avatarUrl = data.secure_url;
                } else {
                    console.error("Cloudinary upload failed. Response:", data);
                    throw new Error('Cloudinary upload failed. Check console for details.');
                }
            } catch (error) {
                console.error('Error during the upload process:', error);
                Swal.fire('Lỗi!', 'Lỗi khi tải ảnh lên. Vui lòng kiểm tra console để biết chi tiết.', 'error');
                setIsUploading(false);
                return;
            }
        }

        const userRef = ref(realtimedb, `users/${user.uid}`);
        update(userRef, {
            displayName: displayName,
            avatar: avatarUrl,
        }).then(() => {
            Swal.fire('Thành công!', 'Cập nhật thông tin thành công!', 'success');
            setIsUploading(false);
            navigate(-1);
        }).catch((error) => {
            console.error('Error updating profile:', error);
            Swal.fire('Lỗi!', 'Lỗi khi cập nhật thông tin.', 'error');
            setIsUploading(false);
        });
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8 m-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý tài khoản</h1>
                    <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn.</p>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                            <p className="text-gray-500 mt-1">Cập nhật ảnh và thông tin chi tiết cá nhân của bạn tại đây.</p>
                        </div>
                    </div>

                    <div className="mt-8 divide-y divide-gray-200">
                        <div className="py-8 grid grid-cols-3 gap-6 items-center">
                            <div className="col-span-1">
                                <span className="text-gray-700 font-medium">Ảnh đại diện</span>
                            </div>
                            <div className="col-span-2 flex items-center space-x-6">
                                <img
                                    src={previewAvatar}
                                    alt="Avatar Preview"
                                    className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    id="avatar-upload"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                                >
                                    Cập nhật
                                </label>
                            </div>
                        </div>

                        <div className="py-8 grid grid-cols-3 gap-6 items-center">
                             <div className="col-span-1">
                                <label htmlFor="displayName" className="text-gray-700 font-medium">Họ và tên</label>
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="text"
                                    id="displayName"
                                    placeholder="Nhập họ và tên"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div className="py-8 grid grid-cols-3 gap-6 items-center">
                            <div className="col-span-1">
                                <label htmlFor="email" className="text-gray-700 font-medium">Địa chỉ Email</label>
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0"
                                />
                                 <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-10 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="py-2 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isUploading}
                                className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-400"
                            >
                                {isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
