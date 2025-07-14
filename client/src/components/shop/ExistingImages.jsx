import DeleteImageButton from "./DeleteImageButton";

const ExistingImages = ({ images, handleImageDelete }) => {
  return (
    <div className="flex gap-1 sm:gap-3 shadow-lg shadow-fuchsia-200 items-center justify-evenly max-w-3xl flex-wrap object-center m-2 p-2 sm:m-4 sm:p-4 rounded-2xl">
      {images.map((image) => (
        <div key={image._id} className="relative">
          <img
            src={image.url}
            alt="image"
            className=" w-20 h-20 sm:w-25 sm:h-25 rounded shadow-cyan-50"
          />
          <div className="absolute top-1 right-1 cursor-pointer">
            <DeleteImageButton
              onDelete={() => handleImageDelete(image._id)}
              image={image.url}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExistingImages;
