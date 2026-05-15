export default function ImageSourceInputs({
  id,
  register,
  setValue,
  name = "file",
  className = "",
  cameraTour,
  galleryTour,
}) {
  const fileInput = register(name);

  const handleCameraChange = (event) => {
    setValue(name, event.target.files, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()}>
      <label
        htmlFor={`${id}-camera`}
        data-tour={cameraTour}
        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Hacer foto
      </label>
      <label
        htmlFor={`${id}-gallery`}
        data-tour={galleryTour}
        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Galería
      </label>
      <input
        id={`${id}-gallery`}
        type="file"
        accept="image/*"
        className="hidden"
        {...fileInput}
      />
      <input
        id={`${id}-camera`}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        name={name}
        onChange={handleCameraChange}
      />
    </div>
  );
}
