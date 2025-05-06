import React, { useState, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from "react-konva";
import useImage from "use-image";
import "./ImageEditor.css";
import { useLocation, useNavigate } from "react-router-dom";

function ImageEditor() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ state (nếu có)
  const { powerpoint, image } = location.state || {};

  // State để quản lý các phần tử trên canvas
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  // Tải hình ảnh nền ở cấp cao nhất
  const [backgroundImage] = useImage(image?.duong_dan_anh_nho || powerpoint?.duong_dan_anh_nho || "https://via.placeholder.com/800x400");

  // Thêm văn bản vào canvas
  const addText = () => {
    const newText = {
      id: `text-${elements.length}`,
      text: "Chỉnh sửa văn bản",
      x: 50,
      y: 50,
      fontSize: 20,
      fill: "black",
      draggable: true,
    };
    setElements([...elements, newText]);
  };

  // Xử lý khi chọn một phần tử
  const handleSelect = (e) => {
    const id = e.target.id();
    setSelectedId(id);
  };

  // Xử lý thay đổi văn bản
  const handleTextChange = (id, newText) => {
    setElements(elements.map((el) =>
      el.id === id ? { ...el, text: newText } : el
    ));
  };

  // Xử lý thay đổi màu sắc
  const handleColorChange = (color) => {
    if (selectedId) {
      setElements(elements.map((el) =>
        el.id === selectedId ? { ...el, fill: color } : el
      ));
    }
  };

  // Lưu thiết kế
  const saveDesign = () => {
    const dataUrl = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = dataUrl;
    link.click();
  };

  // Quay lại trang trước
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="image-editor-container top-categories-1">
      {/* Thanh công cụ bên trái */}
      <div className="sidebar">
        <h2>Chỉnh sửa thiết kế</h2>
        <button onClick={addText}>Thêm văn bản</button>
        <div className="color-picker">
          <label>Chọn màu:</label>
          <input
            type="color"
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={!selectedId}
          />
        </div>
        <button onClick={saveDesign}>Lưu thiết kế</button>
        <button onClick={goBack}>Quay lại</button>
      </div>

      {/* Canvas chỉnh sửa */}
      <div className="canvas-container">
        <Stage
          width={800}
          height={600}
          ref={stageRef}
          onMouseDown={(e) => {
            // Bỏ chọn nếu click ra ngoài
            if (e.target === e.target.getStage()) {
              setSelectedId(null);
            }
          }}
        >
          <Layer>
            {/* Hình ảnh nền */}
            <KonvaImage image={backgroundImage} width={800} height={600} />

            {/* Các phần tử trên canvas */}
            {elements.map((el) => {
              if (el.text) {
                return (
                  <Text
                    key={el.id}
                    id={el.id}
                    text={el.text}
                    x={el.x}
                    y={el.y}
                    fontSize={el.fontSize}
                    fill={el.fill}
                    draggable={el.draggable}
                    onClick={handleSelect}
                    onDblClick={() => {
                      const newText = prompt("Nhập văn bản mới:", el.text);
                      if (newText) handleTextChange(el.id, newText);
                    }}
                    onDragEnd={(e) => {
                      setElements(elements.map((element) =>
                        element.id === el.id
                          ? { ...element, x: e.target.x(), y: e.target.y() }
                          : element
                      ));
                    }}
                  />
                );
              }
              return null;
            })}

            {/* Transformer để thay đổi kích thước và xoay */}
            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Giới hạn kích thước tối thiểu
                  if (newBox.width < 20 || newBox.height < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
                nodes={
                  stageRef.current
                    ? [stageRef.current.findOne(`#${selectedId}`)]
                    : []
                }
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default ImageEditor;