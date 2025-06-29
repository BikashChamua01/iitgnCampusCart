import React, { useState, useRef } from "react";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const validImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages = [...images, ...validImages].slice(0, 5);
    setImages(newImages);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, index) => index !== indexToRemove);
    setImages(updated);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-md">
      <label className="block text-gray-700 font-bold mb-2">
        Upload Images (Max 5)
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed border-gray-400 p-6 rounded-lg text-center text-gray-500 cursor-pointer transition-colors ${
          images.length >= 5 ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"
        }`}
        onClick={() => images.length < 5 && fileInputRef.current.click()}
      >
        <p className="text-sm mb-2">
          Drag & drop images here or click to browse
        </p>
        <p className="text-xs">Only image files are accepted</p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleInputChange}
          disabled={images.length >= 5}
          className="hidden"
        />
      </div>

      {/* Image preview */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                className="w-full h-24 object-cover rounded"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full opacity-90 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer status */}
      <p className="mt-3 text-sm text-gray-500">
        {images.length}/5 images uploaded
      </p>
    </div>
  );
};

export default ImageUploader;
