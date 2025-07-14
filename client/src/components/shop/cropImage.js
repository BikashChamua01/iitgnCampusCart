/**
 * Crop a base‑64 or remote image to the given pixel rectangle and
 * return a { blob, url } pair – ready to append to FormData or preview.
 */
export default function getCroppedImg(imageSrc, pixelCrop) {
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve({ blob, url: URL.createObjectURL(blob) });
        },
        "image/jpeg",
        0.92
      );
    };
    image.onerror = () => reject(new Error("Failed to load image"));
  });
}
