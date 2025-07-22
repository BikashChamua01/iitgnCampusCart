import React from "react";

const ImageUploader = ({ images, setImages }) => {
  const handleFiles = (files) => {
    const valid = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const limited = [...images, ...valid].slice(0, 5);
    setImages(limited);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
      document.getElementById("uploadInput").onclick = false;
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };
  

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-[#7635b6] rounded-xl p-4 text-center cursor-pointer bg-white hover:bg-purple-50 transition h-full"
      onClick={() => document.getElementById("uploadInput").click()}
    >
      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={images.length >= 5}
      />
      <p className="text-sm text-[#5b0d92]">
        Drag & drop images or click to upload (max 5)
      </p>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="rounded-md h-24 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-[#6a0dad] text-white rounded-full text-xs px-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
