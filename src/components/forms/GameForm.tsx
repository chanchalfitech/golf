// import React, { useState } from 'react';
// import { Game } from '../../types/models';

// interface GameFormProps {
//   initialData?: Game | null;
//   onSubmit: (data: Omit<Game, 'id' | 'createdAt'>) => void;
//   onCancel: () => void;
// }

// export default function GameForm({ initialData, onSubmit, onCancel }: GameFormProps) {
//   const [formData, setFormData] = useState({
//     title: initialData?.title || '',
//     type: initialData?.type || '',
//     difficulty: initialData?.difficulty || 'easy' as const,
//     description: initialData?.description || '',
//     instructions: initialData?.instructions || '',
//     maxScore: initialData?.maxScore || 0,
//     timeLimit: initialData?.timeLimit || undefined,
//     isActive: initialData?.isActive ?? true,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
//                type === 'number' ? (value === '' ? undefined : Number(value)) : value
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//           <input
//             type="text"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
//           <select
//             name="difficulty"
//             value={formData.difficulty}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           rows={3}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
//         <textarea
//           name="instructions"
//           value={formData.instructions}
//           onChange={handleChange}
//           rows={4}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
//           <input
//             type="number"
//             name="maxScore"
//             value={formData.maxScore}
//             onChange={handleChange}
//             min="0"
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
//           <input
//             type="number"
//             name="timeLimit"
//             value={formData.timeLimit || ''}
//             onChange={handleChange}
//             min="0"
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           name="isActive"
//           checked={formData.isActive}
//           onChange={handleChange}
//           className="mr-2"
//         />
//         <label className="text-sm font-medium text-gray-700">Active</label>
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
//         >
//           {initialData ? 'Update' : 'Create'} Game
//         </button>
//       </div>
//     </form>
//   );
// }

import React, { useState } from "react";
import { useParams } from "react-router-dom";

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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : type === "number" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* TITLE */}
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

      {/* DESCRIPTION */}
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

      {/* CATEGORY + TIP TEXT */}
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

      {/* VIDEO URL + THUMBNAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium">Thumbnail URL</label>
          <input
            type="text"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* ESTIMATED TIME + VIDEO DURATION */}
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

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Level Number</label>
          <input
            type="number"
            name="levelNumber"
            value={formData.levelNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sort Order</label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div> */}

      {/* ACCESS TIER */}
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

      {/* ACTIVE SWITCH */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">Active</label>
      </div>

      {/* BUTTONS */}
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