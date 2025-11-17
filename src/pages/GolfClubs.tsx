import React, { useState } from "react";
import { ClubModel } from "../model/ClubModel"; 
import { useFirestore } from "../hooks/useFirestore";
import CrudTable from "../components/CrudTable";
import Modal from "../components/Modal";
import GolfClubForm from "../components/forms/GolfClubForm";
import { Timestamp } from "firebase/firestore";
import { fireDate } from '../utils/fireDate';

export default function GolfClubs() {
  const { data, loading, addItem, updateItem, deleteItem } =
    useFirestore<ClubModel>("clubs");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClubModel | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ClubModel) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: ClubModel) => {
    if (confirm(`Are you sure you want to delete club: ${item.name}?`)) {
      try {
        await deleteItem(item.id!);
      } catch (error) {
        alert("Failed to delete golf club");
      }
    }
  };

  const handleSubmit = async (
    formData: Omit<ClubModel, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id!, {
          ...formData,
         updatedAt: Timestamp.fromDate(new Date()), // ✅ Firestore Timestamp
        });
      } else {
        await addItem({
          ...formData,
          createdAt: Timestamp.fromDate(new Date()), // ✅ Firestore Timestamp
    updatedAt: Timestamp.fromDate(new Date()),
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save golf club");
    }
  };

  const formatDate = (value?: Date | null) =>
    value instanceof Date && !isNaN(value.getTime())
      ? value.toLocaleString()
      : "N/A";

  const columns: {
    key: keyof ClubModel;
    label: string;
    render?: (value: any, row: ClubModel) => React.ReactNode;
  }[] = [
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "description", label: "Description" },
    { key: "contactEmail", label: "Email" },
    { key: "totalCoaches", label: "Coaches" },
    { key: "totalPupils", label: "Pupils" },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (value: any) => fireDate(value),
    },
  ];

  return (
    <div>
      <CrudTable
        title="Golf Clubs"
        data={data}
        columns={columns}
        // onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Golf Club" : "Add Golf Club"}
        size="xl"
      >
        <GolfClubForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
