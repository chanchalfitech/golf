// src/components/pupils/PupilForm.tsx
import React, { useState } from "react";
import {
  PupilModel,
  AssignmentStatus,
} from "../../models/pupil/PupilModel";

export interface PupilFormValues {
  name: string;
  clubName: string;
  coachName: string;
  dateOfBirth: Date | null;
  assignmentStatus: AssignmentStatus;
}

interface PupilFormProps {
  initialData?: PupilModel | null;
  onSubmit: (data: PupilFormValues) => void;
  onCancel: () => void;
}

const PupilForm: React.FC<PupilFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formState, setFormState] = useState({
    name: initialData?.name ?? "",
    clubName: initialData?.selectedClubName ?? "",
    coachName: initialData?.selectedCoachName ?? "",
    dobStr: initialData?.dateOfBirth
      ? initialData.dateOfBirth.toISOString().slice(0, 10)
      : "",
    assignmentStatusStr:
      (initialData?.assignmentStatus as AssignmentStatus) ?? "pending",
  });

  const registeredAt: Date | null = initialData?.createdAt ?? null; // read-only

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateOfBirth =
      formState.dobStr && formState.dobStr.trim() !== ""
        ? new Date(formState.dobStr)
        : null;

    const assignmentStatus: AssignmentStatus =
      formState.assignmentStatusStr === ""
        ? null
        : (formState.assignmentStatusStr as AssignmentStatus);

    onSubmit({
      name: formState.name.trim(),
      clubName: formState.clubName.trim(),
      coachName: formState.coachName.trim(),
      dateOfBirth,
      assignmentStatus,
    });
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleString(); // simple readable format
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Club + Coach */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Name
          </label>
          <input
            type="text"
            name="clubName"
            value={formState.clubName}
            onChange={handleChange}
            placeholder="e.g., Falcon Golf Club"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coach Name
          </label>
          <input
            type="text"
            name="coachName"
            value={formState.coachName}
            onChange={handleChange}
            placeholder="e.g., John Smith"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* DOB + Assignment Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dobStr"
            value={formState.dobStr}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Status
          </label>
          <select
            name="assignmentStatusStr"
            value={formState.assignmentStatusStr}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">None</option>
          </select>
        </div>
      </div>

      {/* Registered At (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registered At
        </label>
        <input
          type="text"
          value={formatDateTime(registeredAt)}
          readOnly
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
        />
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
          {initialData ? "Update Pupil" : "Create Pupil"}
        </button>
      </div>
    </form>
  );
};

export default PupilForm;
