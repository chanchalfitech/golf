// import React, { useState } from 'react';
// import { Lesson } from '../../types/models';
// import { useParams } from 'react-router-dom';

// interface LessonFormProps {
//   initialData?: Lesson | null;
//   onSubmit: (data: Omit<Lesson, 'id' | 'createdAt'>) => void;
//   onCancel: () => void;
// }

// export default function LessonForm({ initialData, onSubmit, onCancel }: LessonFormProps) {
//   const { levelId } = useParams<{levelId: string}>();
//   const levelNumber = levelId?.split('_')[1];
//   const [formData, setFormData] = useState({
//     title: initialData?.title || '',
//     description: initialData?.description || '',
//     content: initialData?.content || '',
//     coachId: initialData?.coachId || '',
//     duration: initialData?.duration || 0,
//     difficulty: initialData?.difficulty || 'beginner' as const,
//     category: initialData?.category || '',
//     videoUrl: initialData?.videoUrl || '',
//     isPublished: initialData?.isPublished ?? false,
//     levelNumber,
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
//                type === 'number' ? Number(value) : value
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
//         <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
//         <textarea
//           name="content"
//           value={formData.content}
//           onChange={handleChange}
//           rows={6}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Coach ID</label>
//           <input
//             type="text"
//             name="coachId"
//             value={formData.coachId}
//             onChange={handleChange}
//             // required
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
//           <input
//             type="number"
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             min="0"
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
//           <select
//             name="difficulty"
//             value={formData.difficulty}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="beginner">Beginner</option>
//             <option value="intermediate">Intermediate</option>
//             <option value="advanced">Advanced</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             // required
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (optional)</label>
//         <input
//           type="url"
//           name="videoUrl"
//           value={formData.videoUrl}
//           onChange={handleChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           name="isPublished"
//           checked={formData.isPublished}
//           onChange={handleChange}
//           className="mr-2"
//         />
//         <label className="text-sm font-medium text-gray-700">Published</label>
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
//           {initialData ? 'Update' : 'Create'} Lesson
//         </button>
//       </div>
//     </form>
//   );
// }

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Lesson } from "../../types/models";

interface LessonFormProps {
  initialData?: Lesson | null;
  onSubmit: (data: Omit<Lesson, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export default function LessonForm({ initialData, onSubmit, onCancel }: LessonFormProps) {
  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = levelId ? Number(levelId.split("_")[1]) : initialData?.levelNumber || 1;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    estimatedReadTime: initialData?.estimatedReadTime || 0,
    pdfUrl: initialData?.pdfUrl || "",
    accessTier: initialData?.accessTier || "free",
    isActive: initialData?.isActive ?? true,
    isPublished: initialData?.publishedAt ? true : false,
    sortOrder: initialData?.sortOrder || 0,
    levelNumber,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      publishedAt: formData.isPublished ? new Date() : null,
      updatedAt: new Date(),
      createdAt: initialData?.createdAt || new Date(),
      createdBy: initialData?.createdBy || "admin",
      levelNumber,
    };

    onSubmit(submitData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">

      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* ESTIMATED READ TIME + SORT ORDER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Estimated Read Time (mins)
          </label>
          <input
            type="number"
            name="estimatedReadTime"
            value={formData.estimatedReadTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sort Order</label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* PDF URL */}
      <div>
        <label className="block text-sm font-medium mb-1">PDF URL</label>
        <input
          type="text"
          name="pdfUrl"
          value={formData.pdfUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* ACCESS TIER */}
      <div>
        <label className="block text-sm font-medium mb-1">Access Tier</label>
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

      {/* ACTIVE + PUBLISHED */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
          />
          Published
        </label>
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
          {initialData ? "Update" : "Create"} Lesson
        </button>
      </div>

    </form>
  );
}
