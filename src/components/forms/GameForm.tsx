import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface GameFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function GameForm({ initialData, onSubmit, onCancel }: GameFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    tipText: initialData?.tipText || "",
    videoUrl: initialData?.videoUrl || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    estimatedTime: initialData?.estimatedTime || 0,
    videoDurationSeconds: initialData?.videoDurationSeconds || 0,
    levelNumber: initialData?.levelNumber || 1,
    accessTier: initialData?.accessTier || "free",
    sortOrder: initialData?.sortOrder || 0,
    isActive: initialData?.isActive ?? true,
  });

  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = levelId ? Number(levelId.split("_")[1]) : initialData?.levelNumber || 1;

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Select a valid image (PNG, JPG, JPEG)");
      return;
    }

    setThumbnailFile(file);
  };

  const uploadImage = async () => {
    if (!thumbnailFile) return alert("Please choose an image first");

    try {
      setUploadingImage(true);

      const storageRef = ref(
        storage,
        `game_thumbnails/${Date.now()}_${thumbnailFile.name}`
      );

      await uploadBytes(storageRef, thumbnailFile);
      const downloadURL = await getDownloadURL(storageRef);

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: downloadURL,
      }));

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      updatedAt: new Date(),
      createdAt: initialData?.createdAt || new Date(),
      createdBy: initialData?.createdBy || "admin",
      levelNumber,
      sortOrder: initialData?.sortOrder || 0,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tip Text</label>
          <input
            type="text"
            name="tipText"
            value={formData.tipText}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Video URL</label>
        <input
          type="text"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail Image</label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="border px-3 py-2 rounded"
          />

          <button
            type="button"
            onClick={uploadImage}
            disabled={!thumbnailFile || uploadingImage}
            className={`px-4 py-2 rounded text-white ${
              uploadingImage || !thumbnailFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {uploadingImage ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        {formData.thumbnailUrl && (
          <p className="text-green-600 text-sm mt-2">
            Image Uploaded —{" "}
            <a href={formData.thumbnailUrl} target="_blank" className="underline">
              View Thumbnail
            </a>
          </p>
        )}

        <input
          type="text"
          value={formData.thumbnailUrl}
          readOnly
          className="w-full mt-2 border px-3 py-2 rounded bg-gray-50"
          placeholder="Image URL will appear here after upload"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Estimated Time (mins)</label>
          <input
            type="number"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Video Duration (seconds)</label>
          <input
            type="number"
            name="videoDurationSeconds"
            value={formData.videoDurationSeconds}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Access Tier</label>
        <select
          name="accessTier"
          value={formData.accessTier}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">Active</label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialData ? "Update" : "Create"} Game
        </button>
      </div>
    </form>
  );
}
