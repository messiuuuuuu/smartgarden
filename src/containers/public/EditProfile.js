
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth, realtimedb } from '../../firebaseConfig';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaCamera } from 'react-icons/fa';
import Swal from 'sweetalert2';
import anonAvatar from '../../assets/anon-avatar.png';

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(anonAvatar);
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userRef = ref(realtimedb, `users/${currentUser.uid}`);
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setUser({ uid: currentUser.uid, ...data });
                        setName(data.displayName || '');
                        setEmail(currentUser.email);
                        setAvatar(data.avatar || anonAvatar);
                    }
                    setLoading(false);
                });
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setNewAvatarFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setIsUploading(true);
        let avatarUrl = user.avatar;

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

        const updates = {
            displayName: name,
            avatar: avatarUrl,
        };

        const userRef = ref(realtimedb, `users/${user.uid}`);
        update(userRef, updates)
            .then(() => {
                Swal.fire('Thành công', 'Thông tin cá nhân đã được cập nhật.', 'success');
            })
            .catch((error) => {
                console.error("Lỗi cập nhật thông tin:", error);
                Swal.fire('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại.', 'error');
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Chỉnh Sửa Thông Tin Cá Nhân</h1>

                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative w-32 h-32">
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transform hover:scale-110 transition-all duration-300 shadow-md"
                            aria-label="Thay đổi ảnh đại diện"
                        >
                            <FaCamera />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">Họ và tên</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white mt-1 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">Địa chỉ Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-md bg-white mt-1 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="py-2 px-8 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="py-2 px-8 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                        {isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
