import React, { useState } from "react";
import { FaLeaf, FaImage } from "react-icons/fa";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Lấy phần base64
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Xin chào! Tải ảnh cây để nhận diện hoặc chẩn đoán nhé!", sender: "bot" },
  ]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setMessages((prev) => [
        ...prev,
        { text: "[Hình ảnh]", sender: "user", image: file },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Vui lòng chọn file ảnh hợp lệ!", sender: "bot" },
      ]);
    }
  };

  const handlePlantIdentification = async (file, isDiagnosis) => {
    if (!file) {
      setMessages((prev) => [
        ...prev,
        { text: "Vui lòng tải ảnh trước khi thực hiện!", sender: "bot" },
      ]);
      return;
    }

    if (!GEMINI_API_KEY) {
        setMessages((prev) => [
            ...prev,
            { text: "⚠️ Vui lòng cung cấp API key cho Gemini!", sender: "bot" },
        ]);
        return;
    }

    setLoading(true);

    try {
      const base64Image = await fileToBase64(file);
      const mimeType = file.type;

      let prompt = "";
      if (!isDiagnosis) {
        prompt = `Đây là hình ảnh của một cây. Hãy nhận diện chính xác tên giống cây, sau đó mô tả ngắn gọn và cung cấp thông tin chi tiết về điều kiện trồng tối ưu: điều kiện ánh sáng, loại đất, nhiệt độ, và độ ẩm tốt nhất cho cây. Phản hồi bằng tiếng Việt.`;
      } else {
        prompt = `Đây là hình ảnh của một cây. Dựa vào hình ảnh, hãy chẩn đoán xem cây có khỏe mạnh không. Nếu có dấu hiệu bệnh, hãy nêu tên bệnh, mô tả triệu chứng và đề xuất phương pháp điều trị/phòng ngừa phù hợp (hóa học, sinh học, hoặc tự nhiên). Phản hồi bằng tiếng Việt.`;
      }
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType
        }
      };
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const geminiText = response.text();

      setMessages((prev) => [
        ...prev,
        {
          text: `Phân tích Gemini (Chức năng ${isDiagnosis ? "Chẩn đoán" : "Nhận diện"}):`,
          sender: "bot",
        },
        { text: <pre className="whitespace-pre-wrap text-sm">{geminiText}</pre>, sender: "bot" },
      ]);

    } catch (error) {
      const errorMessage =
        error.message || "Không thể kết nối đến server. Vui lòng kiểm tra mạng!";
      setMessages((prev) => [
        ...prev,
        { text: `⚠️ Lỗi: ${errorMessage}. Vui lòng thử lại!`, sender: "bot" },
      ]);
      console.error("Gemini API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-green-100 ">
      <div className="bg-green-500 text-white py-6 px-6 text-2xl font-bold flex items-center justify-center gap-3 shadow-lg">
        <FaLeaf className="text-3xl" />
        Plant ChatBot (Gemini)
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-md shadow-md ${
                msg.sender === "user"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.image ? (
                <img
                  src={URL.createObjectURL(msg.image)}
                  alt="Uploaded"
                  className="w-48 h-48 rounded-lg shadow-md"
                />
              ) : typeof msg.text === "string" ? (
                <pre className="whitespace-pre-wrap text-sm">{msg.text}</pre>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center">
            <span className="text-gray-600 text-base animate-pulse">
              ⏳ Đang xử lý...
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-6 p-6 bg-green-100 shadow-inner border-t border-gray-100">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="upload"
        />
        <label
          htmlFor="upload"
          className="cursor-pointer bg-gray-100 p-4 rounded-full shadow-md hover:bg-gray-200 transition flex items-center justify-center"
        >
          <FaImage className="text-2xl text-gray-600" />
        </label>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-green-600 hover:to-green-700  transition disabled:bg-gray-400 text-sm font-semibold"
          onClick={() => handlePlantIdentification(image, false)}
          disabled={loading}
        >
          Nhận diện cây
        </button>
        <button
          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gradient-to-r from-teal-600 hover:to-teal-700 transition disabled:bg-gray-400 text-sm font-semibold"
          onClick={() => handlePlantIdentification(image, true)}
          disabled={loading}
        >
          Chẩn đoán bệnh cây
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
