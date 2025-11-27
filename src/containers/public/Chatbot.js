
import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown';
import { FaImage, FaLeaf, FaStethoscope } from "react-icons/fa";
import botAvatar from '../../assets/bot-avatar.png';
import { Loading } from "../../components";

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: <Markdown>Xin chào! Tôi là trợ lý vườn thông minh. Hãy tải ảnh cây của bạn lên để tôi nhận diện hoặc chẩn đoán bệnh nhé!</Markdown>, sender: "bot" },
    ]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setMessages((prev) => [
                ...prev,
                { text: `Đã tải lên ảnh: ${file.name}`, sender: "user" },
            ]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    const handleSendMessage = async (isDiagnosis = false) => {
        if (!image) {
            alert("Vui lòng tải lên một hình ảnh trước.");
            return;
        }

        setLoading(true);

        try {
            const base64Image = await fileToBase64(image);
            const mimeType = image.type;

            let prompt = "";
            if (!isDiagnosis) {
                prompt = `Đây là hình ảnh của một cây. Hãy làm theo các bước sau:
1. Nhận diện chính xác tên giống cây.
2. Ngay sau tên cây, cung cấp 3 thẻ (tags) tóm tắt về đặc điểm của cây, ví dụ: [tag: Cây thân thảo], [tag: Ưa ẩm], [tag: Cần ánh sáng gián tiếp].
3. Mô tả ngắn gọn về cây.
4. Cung cấp thông tin chi tiết về "Điều kiện trồng tối ưu" dưới dạng danh sách với các biểu tượng sau:
   - 💧 *Độ ẩm:* (ghi rõ khoảng an toàn, ví dụ: 60-70%)
   - 🌡️ *Nhiệt độ:* (ghi rõ khoảng an toàn, ví dụ: 18°C - 25°C)
   - ☀️ *Ánh sáng:* (ghi rõ yêu cầu, ví dụ: 6-8 giờ/ngày, ánh sáng gián tiếp)
   - 🌱 *Đất trồng:* (ghi rõ loại đất phù hợp)
Toàn bộ phản hồi phải bằng tiếng Việt và sử dụng markdown để định dạng.`;
            } else {
                prompt = `Đây là hình ảnh của một cây. Dựa vào hình ảnh, hãy chẩn đoán xem cây có khỏe mạnh không. Nếu có dấu hiệu bệnh, hãy nêu tên bệnh, mô tả triệu chứng và đề xuất các phương pháp điều trị/phòng ngừa phù hợp (hóa học, sinh học, hoặc tự nhiên). Phản hồi bằng tiếng Việt và sử dụng markdown để định dạng câu trả lời cho đẹp hơn.`;
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent([prompt, { inlineData: { data: base64Image, mimeType } }]);
            const response = await result.response;
            const text = response.text();

            setMessages((prev) => [...prev, { text: <Markdown>{text}</Markdown>, sender: "bot" }]);
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            setMessages((prev) => [
                ...prev,
                { text: "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.", sender: "bot" },
            ]);
        } finally {
            setLoading(false);
            setImage(null);
            setImagePreview(null);
        }
    };
    

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-gray-50">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-inner p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'bot' ? '' : 'justify-end'}`}>
                            {msg.sender === 'bot' && (
                                <img src={botAvatar} alt="Bot Avatar" className="w-10 h-10 rounded-full" />
                            )}
                            <div className={`max-w-lg p-3 rounded-lg shadow ${msg.sender === 'bot' ? 'bg-green-100 text-gray-800' : 'bg-blue-500 text-white'}`}>
                                <div className="prose prose-sm max-w-none">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex flex-col items-center justify-center p-4">
                            <span className="mt-2 text-gray-600 text-base animate-pulse">
                              <Loading/> Trợ lý thông minh đang xử lý...
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Image Upload and Actions */}
            <div className="w-1/3 flex flex-col p-4 space-y-4">
                <div 
                    {...getRootProps()} 
                    className={`flex-1 border-4 border-dashed rounded-lg transition-colors duration-300 flex justify-center items-center text-center p-4 ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}
                >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Xem trước" className="max-h-full max-w-full object-contain rounded-lg" />
                    ) : (
                        <div className="text-gray-500">
                            <FaImage className="mx-auto text-5xl mb-2" />
                            <p className="font-semibold">Kéo thả ảnh vào đây</p>
                            <p className="text-sm">hoặc nhấn để chọn ảnh</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => handleSendMessage(false)}
                        disabled={!image || loading}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                        <FaLeaf />
                        <span>Nhận diện cây</span>
                    </button>
                    <button
                        onClick={() => handleSendMessage(true)}
                        disabled={!image || loading}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-white text-green-700 border-2 border-green-700 font-bold rounded-lg shadow-md hover:bg-green-700 hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                        <FaStethoscope />
                        <span>Chẩn đoán bệnh</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
