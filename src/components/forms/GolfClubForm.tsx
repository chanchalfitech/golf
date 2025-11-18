// src/components/clubs/ClubForm.tsx
import React, { useState } from 'react';
import { ClubModel } from '../../model/ClubModel';

interface GolfClubFormProps {
  initialData?: ClubModel | null;
  onSubmit: (data: Omit<ClubModel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function GolfClubForm({
  initialData,
  onSubmit,
  onCancel,
}: GolfClubFormProps) {
  const [formData, setFormData] = useState<
    Omit<ClubModel, 'id' | 'createdAt' | 'updatedAt'>
  >({
    name: initialData?.name ?? '',
    location: initialData?.location ?? '',
    description: initialData?.description ?? '',
    contactEmail: initialData?.contactEmail ?? '',
    isActive: initialData?.isActive ?? true,
    totalCoaches: initialData?.totalCoaches ?? 0,
    totalPupils: initialData?.totalPupils ?? 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let newValue: string | number | boolean = value;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      totalCoaches: Number(formData.totalCoaches) || 0,
      totalPupils: Number(formData.totalPupils) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Club Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Club Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="City, Country or full address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Short description about the club"
        />
      </div>

      {/* Contact Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Email
        </label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Totals */}
      {/* <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Coaches
          </label>
          <input
            type="number"
            name="totalCoaches"
            min={0}
            value={formData.totalCoaches}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Pupils
          </label>
          <input
            type="number"
            name="totalPupils"
            min={0}
            value={formData.totalPupils}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div> */}

      {/* Active */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
        >
          {initialData ? 'Update Club' : 'Create Club'}
        </button>
      </div>
    </form>
  );
}
