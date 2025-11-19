import React, { useState, useEffect } from 'react';
import anonAvatar from '../../assets/anon-avatar.png';
import { useSelector } from 'react-redux';
import menuUser from '../../untils/menuUser';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { ref, onValue } from 'firebase/database';
import { realtimedb, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Sidebar = () => {
    const navigate = useNavigate();
    const { currentData } = useSelector((state) => state.user);
    const { gardenId } = useParams();
    const [gardenName, setGardenName] = useState('');
    const [userName, setUserName] = useState('Người dùng');
    const [userEmail, setUserEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (gardenId) {
            const nameRef = ref(realtimedb, `gardens/${gardenId}/name`);
            const unsubscribe = onValue(nameRef, (snapshot) => {
                const name = snapshot.val();
                setGardenName(name || 'Khu vườn chưa có tên');
            });
            return () => unsubscribe();
        }
    }, [gardenId]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                const nameRef = ref(realtimedb, `users/${userId}/displayName`);
                const emailRef = ref(realtimedb, `users/${userId}/email`);
                const avatarRef = ref(realtimedb, `users/${userId}/avatar`);
                const unsubscribeAvatar = onValue(avatarRef, (snapshot) => {
                    const avatar = snapshot.val();
                    setAvatarUrl(avatar || anonAvatar);
                });
                const unsubscribeDB = onValue(nameRef, (snapshot) => {
                    const name = snapshot.val();
                    setUserName(name || 'Người dùng');
                });
                const unsubscribeEmail = onValue(emailRef, (snapshot) => {
                    const email = snapshot.val();
                    setUserEmail(email || '');
                });
                return () => {
                    unsubscribeDB();
                    unsubscribeAvatar();
                    unsubscribeEmail();
                };
            } else {
                setUserName('Người dùng');
                setAvatarUrl(anonAvatar);
                setUserEmail('chưa đăng nhập');
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="w-[300px] h-screen bg-white shadow-2xl rounded-2xl p-6 flex flex-col items-center">
            <div className="w-full flex flex-col items-center mb-8">
                <img
                    src={avatarUrl || anonAvatar}
                    alt="avatar"
                    className="w-24 h-24 rounded-full border-4 border-green-200 shadow-md object-cover transition-transform duration-300 hover:scale-105"
                />
                <h2 className="mt-4 text-xl font-bold text-green-700">
                    {userName}
                </h2>
                <p className="text-green-600 text-sm mt-1 italic">
                    {userEmail}
                </p>
                {gardenId && (
                    <p className="text-green-600 text-sm mt-2 italic">
                        Khu vườn: <span className="font-semibold">{gardenName}</span>
                    </p>
                )}
            </div>

            <nav className="w-full flex flex-col gap-3">
                {menuUser.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item?.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                            }`
                        }
                    >
                        <span className="text-xl">{item?.icon}</span>
                        <span className="font-medium">{item.text}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="mt-auto w-full flex items-center gap-3 px-4 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
            >
                <AiOutlineLogout size={22} />
                <span className="font-medium">Thoát</span>
            </button>
        </div>
    );
};

export default Sidebar;
