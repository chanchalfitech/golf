import React, { useState } from 'react';
import { PupilModel } from '../model/PupilModel';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import PupilForm from '../components/forms/PupilForm';
import { fireDate } from '../utils/fireDate';

export default function Pupils() {
  const { 
    data, 
    loading, 
    addItem, 
    updateItem,
    fetchNextPage,
    hasMore
   } = useFirestore<PupilModel>('pupils', [], 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PupilModel | null>(null);



  const handleEdit = (item: PupilModel) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };



  const handleSubmit = async (fireDate: Omit<PupilModel, 'id' | 'createdAt'>) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id!, fireDate);
      } else {
        await addItem(fireDate);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save PupilModel');
    }
  };



  const columns = [
    { key: 'name' as keyof PupilModel, label: 'Name' },
    { key: 'selectedClubName' as keyof PupilModel, label: 'Club Name' },

    {
      key: 'dateOfBirth' as keyof PupilModel,
      label: 'Date of Birth',
      render: (value: unknown) => formatDisplayDate(value, false), // e.g., 10/23/2009
    },

    {
      key: 'clubAssignmentStatus' as keyof PupilModel,
      label: 'Assignment Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'approved'
            ? 'bg-green-100 text-green-800'
            : value === 'intermediate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {value}
        </span>
      ),
    },

    { key: 'assignedCoachName' as keyof PupilModel, label: 'Coach Name' },

    {
      key: 'createdAt' as keyof PupilModel,
      label: 'Registered At',
      render: (value: unknown) => formatDisplayDate(value, true), // e.g., 10/23/2009, 3:45:12 PM
    },
  ];


  return (
    <div>
      <CrudTable
        title="Pupils"
        data={data}
        columns={columns}
        // onAdd={handleAdd}
        onEdit={handleEdit}
        // onDelete={handleDelete}
        loading={loading}
      />

      <div className="flex justify-center my-4">
        {hasMore && (
          <button
            onClick={fetchNextPage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Pupil' : 'Add Pupil'}
        size="lg"
      >
        <PupilForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

// Put this above `export default function Pupils() { ... }`
function formatDisplayDate(input: unknown, withTime = false): string {
  if (!input) return '—';

  const asAny = input as any;
  const sec =
    typeof asAny?.seconds === 'number'
      ? asAny.seconds
      : typeof asAny?._seconds === 'number'
        ? asAny._seconds
        : null;

  if (sec !== null) {
    const nsec =
      typeof asAny?.nanoseconds === 'number'
        ? asAny.nanoseconds
        : typeof asAny?._nanoseconds === 'number'
          ? asAny._nanoseconds
          : 0;
    const date = new Date(sec * 1000 + Math.floor(nsec / 1e6));
    return withTime
      ? date.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
  }

  if (typeof (input as any)?.toDate === 'function') {
    const d = (input as any).toDate();
    return withTime
      ? d.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : d.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
  }

  const parsed = new Date(String(input));
  if (!isNaN(parsed.getTime())) {
    return withTime
      ? parsed.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : parsed.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
  }

  return String(input);
}

