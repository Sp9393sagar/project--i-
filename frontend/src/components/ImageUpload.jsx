import { useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';

const ImageUpload = ({ onChange, value, label = 'Upload Photo' }) => {
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Pass file to parent
            onChange(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>

            {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-blue-50 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="text-6xl text-gray-400 mb-4" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
