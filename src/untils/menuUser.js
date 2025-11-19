import icons from './icon'

const { ImPencil2, MdOutlineLibraryBooks, RiRobot3Line, FaUserEdit} = icons

const menuUser = [
    {
        id: 1,
        text: 'Danh sách khu vườn',
        path: '/devices',
        icon: <MdOutlineLibraryBooks />
    },
    {
        id: 2,
        text: 'Thêm thiết bị',
        path: '/add-device',
        icon: <ImPencil2 />
    },
    {
        id: 3,
        text: 'Chatbot',
        path: '/chatbot',
        icon: <RiRobot3Line />
    },
    {
        id: 4,
        text: 'Chỉnh sửa thông tin',
        path: '/edit-profile',
        icon: <FaUserEdit />
    },

]

export default menuUser