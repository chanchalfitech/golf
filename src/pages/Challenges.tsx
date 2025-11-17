import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Challenge } from '../types/models';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import ChallengeForm from '../components/forms/ChallengeForm';
import Header from '../components/Header';

const Challenges = ({ initialData }) => {
  const { levelId } = useParams<{ levelId: string }>();
  const { data: challenges, loading, addItem, updateItem, deleteItem } = useFirestore<Challenge>('challenges');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Challenge | null>(null);

  const data = React.useMemo(
    () =>
      levelId
        ? challenges.filter((q) => q.levelId === levelId)
        : challenges,
    [challenges, levelId]
  )

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Challenge) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Challenge) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteItem(item.id!);
      } catch (error) {
        alert('Failed to delete challenge');
      }
    }
  };

  const handleSubmit = async (formData: Omit<Challenge, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        ...formData,
        levelId: levelId ? String(levelId) : "",
      } as Omit<Challenge, 'id' | 'createdAt'>;

      if (editingItem) {
        await updateItem(editingItem.id!, payload);
      } else {
        await addItem(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save challenge');
    }
  };

  const columns = [
    { key: 'title' as keyof Challenge, label: 'Title' },
    {
      key: 'difficulty' as keyof Challenge,
      label: 'Difficulty',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'beginner' ? 'bg-green-100 text-green-800' :
            value === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      )
    },
    { key: 'points' as keyof Challenge, label: 'Points' },
    { key: 'startDate' as keyof Challenge, label: 'Start Date' },
    { key: 'endDate' as keyof Challenge, label: 'End Date' },
    {
      key: 'isActive' as keyof Challenge,
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className='p-6'>
      <Header
        title={initialData ? 'Edit Challenge' : 'Add Challenge'}
        onClick={handleAdd} />
      <CrudTable
        title="Challenges"
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Challenge' : 'Add Challenge'}
        size="lg"
      >
        <ChallengeForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          levelId = {levelId}
        />
      </Modal>
    </div>
  );
}

export default Challenges