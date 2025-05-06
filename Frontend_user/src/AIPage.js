import React, { useState, useEffect } from "react";
import "./AIPage.css";

function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Không có");
  const [numImages, setNumImages] = useState(1);
  const [creativity, setCreativity] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousPrompts, setPreviousPrompts] = useState([]); // Lưu trữ các gợi ý trước đó

  useEffect(() => {
    console.log("Generated Images Updated:", generatedImages);
  }, [generatedImages]);

  // Hàm tính kích thước ảnh dựa trên tỷ lệ khung hình (không cần thiết với Craiyon, nhưng giữ lại để tương thích giao diện)
  const getDimensions = (ratio) => {
    switch (ratio) {
      case "1:1":
        return { width: 512, height: 512 };
      case "2:3":
        return { width: 512, height: 768 };
      case "3:2":
        return { width: 768, height: 512 };
      default:
        return { width: 512, height: 512 };
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Vui lòng nhập mô tả hình ảnh trước khi tạo!");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]); // Xóa các hình ảnh cũ trước khi tạo mới

    try {
      // Kết hợp style vào prompt nếu style không phải "Không có"
      const fullPrompt = style !== "Không có" ? `${prompt}, phong cách ${style}` : prompt;

      // Lưu gợi ý vào danh sách trước đó
      setPreviousPrompts((prev) => [...new Set([prompt, ...prev])]); // Tránh trùng lặp

      // Gửi yêu cầu đến Craiyon API
      const response = await fetch("https://api.craiyon.com/v3/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          negative_prompt: "", // Craiyon hỗ trợ negative prompt, để trống nếu không cần
          model: "dall-e-mini", // Mô hình mặc định của Craiyon
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Không thể tạo hình ảnh: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      let images = data.images; // Craiyon trả về một mảng các URL ảnh

      if (!images || images.length === 0) {
        throw new Error("Không nhận được hình ảnh từ API!");
      }

      // Craiyon thường trả về 9 ảnh, giới hạn số lượng theo numImages
      images = images.slice(0, numImages);

      // Chuyển kết quả thành định dạng phù hợp
      const formattedImages = images.map((url, index) => ({
        id: index,
        url: url,
      }));

      setGeneratedImages(formattedImages);
    } catch (err) {
      console.error("Lỗi khi tạo hình ảnh:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo hình ảnh. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleRandomGenerate = () => {
    const randomPrompts = [
      "ngôi sao 3D",
      "hình ảnh 3D kỳ ảo đầy màu sắc với thiên nhiên",
      "ngày lễ hội đông phong cách phim hoạt hình",
    ];
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
    handleGenerate();
  };

  const handleSimilarGenerate = () => {
    if (previousPrompts.length === 0) {
      setError("Chưa có gợi ý trước đó để tạo tương tự!");
      return;
    }
    const lastPrompt = previousPrompts[0]; // Lấy gợi ý gần nhất
    setPrompt(lastPrompt);
    handleGenerate();
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("Tính năng tải ảnh lên hiện chưa được hỗ trợ bởi API!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="ai-page-container p-4 max-w-6xl mx-auto shadow-lg rounded-lg">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2 text-center">
        Trình tạo hình ảnh AI miễn phí: Chuyển văn bản sang PNG trong suốt
      </h1>
      <p className="text-gray-500 mb-6 text-center">
        Tạo ngay tại PNG chất lượng cao hoàn toàn miễn phí. Ý tưởng của bạn sẽ được chuyển thành hình ảnh PNG trong suốt trực tiếp từ văn bản của bạn.
      </p>

      {/* Input Section */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mô tả hình ảnh hoặc ý tưởng của bạn"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 upload-button cursor-pointer bg-gray-200 px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-300"
          >
            Tải lên
          </label>
        </div>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Options Section */}
      <div className="options-section mb-6 flex flex-wrap gap-4">
        {/* Aspect Ratio */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Tỷ lệ khung hình:</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="1:1">1:1</option>
            <option value="2:3">2:3</option>
            <option value="3:2">3:2</option>
          </select>
        </div>

        {/* Style */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Phong cách:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="Không có">Không có</option>
            <option value="Anime">Anime</option>
            <option value="Hình Minh Họa">Hình Minh Họa</option>
            <option value="Nhiếp ảnh">Nhiếp ảnh</option>
            <option value="Kết cấu 3D">Kết cấu 3D</option>
            <option value="Sang trọng">Sang trọng</option>
            <option value="Môi trường">Môi trường</option>
            <option value="Tông quan">Tông quan</option>
            <option value="Cổ điển">Cổ điển</option>
            <option value="Thời trang">Thời trang</option>
            <option value="Tăng cường">Tăng cường</option>
          </select>
        </div>

        {/* Number of Images */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Số lượng hình ảnh:</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setNumImages(num)}
                className={`px-3 py-1 border rounded-full ${
                  numImages === num ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                } hover:bg-blue-100`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Creativity Toggle */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Mức độ sáng tạo:</label>
          <input
            type="checkbox"
            checked={creativity}
            onChange={() => setCreativity(!creativity)}
            className="toggle-checkbox"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="generate-button px-4 py-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo"}
        </button>
      </div>

      {/* Generated Images Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Hình ảnh đã tạo:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
          {loading && (
            <p className="col-span-full text-center text-gray-500">
              Đang tạo hình ảnh, vui lòng chờ...
            </p>
          )}
          {!loading && generatedImages.length > 0 ? (
            generatedImages.map((img) => (
              <div key={img.id} className="relative generated-image-container">
                <img
                  src={img.url}
                  alt={`Generated Image ${img.id}`}
                  className="generated-image object-cover rounded-lg w-full h-auto"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/512?text=Error+Loading+Image";
                    console.error(`Failed to load image: ${img.url}`);
                  }}
                />
                <button className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            !loading && (
              <p className="col-span-full text-center text-gray-500">
                Chưa có hình ảnh nào được tạo.
              </p>
            )
          )}
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex flex-wrap gap-4 mt-3">
        <button
          onClick={handleRandomGenerate}
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-transparent"
          disabled={loading}
        >
          Tạo ngẫu nhiên
        </button>
        <button
          onClick={handleSimilarGenerate}
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-transparent"
          disabled={loading}
        >
          Gần đúng với gợi ý bạn đã chọn trước đó
        </button>
      </div>
    </div>
  );
}

export default AIPage;