import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { auth, realtimedb } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import anonAvatar from '../../assets/anon-avatar.png';

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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
                navigate('/login'); // Redirect if not logged in
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
                    throw new Error('Cloudinary upload failed. Check console for details.');                }
            } catch (error) {
                console.error('Error during the upload process:', error);
                alert('Lỗi khi tải ảnh lên. Vui lòng kiểm tra console để biết chi tiết.');
                setIsUploading(false);
                return;
            }
        }

        const userRef = ref(realtimedb, `users/${user.uid}`);
        update(userRef, {
            displayName: displayName,
            avatar: avatarUrl,
        }).then(() => {
            alert('Cập nhật thông tin thành công!');
            setIsUploading(false);
            navigate(-1); // Go back to the previous page
        }).catch((error) => {
            console.error('Error updating profile:', error);
            alert('Lỗi khi cập nhật thông tin.');
            setIsUploading(false);
        });
    };

    return (
        <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Chỉnh sửa thông tin</h2>
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={previewAvatar}
                        alt="Avatar Preview"
                        className="w-32 h-32 rounded-full border-4 border-green-200 object-cover shadow-md mb-4"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        id="avatar-upload"
                        className="hidden"
                    />
                    <div className="w-full flex justify-center">
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer bg-green-600 text-center px-10 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Thay đổi ảnh đại diện
                        </label>
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="displayName" className="block text-lg font-medium text-gray-700 mb-2">Tên người dùng</label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                        {isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
