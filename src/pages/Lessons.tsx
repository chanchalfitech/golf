import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson } from '../types/models';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import LessonForm from '../components/forms/LessonForm';
import Header from '../components/Header';

export default function Lessons() {
  const { levelId } = useParams<{ levelId: string }>();
  const { data: lessons, loading, addItem, updateItem, deleteItem } = useFirestore<Lesson>('lessons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Lesson | null>(null);

  const data = React.useMemo(
    () =>
      levelId
        ? lessons.filter((q) => q.levelId === levelId)
        : lessons,
    [lessons, levelId]
  )
  const navigate = useNavigate();
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Lesson) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Lesson) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteItem(item.id!);
      } catch (error) {
        alert('Failed to delete lesson');
      }
    }
  };

  const handleSubmit = async (formData: Omit<Lesson, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        ...formData,
        levelId: levelId ? String(levelId) : "",
      } as Omit<Lesson, 'id' | 'createdAt'>;
      if (editingItem) {
        await updateItem(editingItem.id!, payload);
      } else {
        await addItem(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save lesson');
    }
  };

  const columns = [
    { key: 'title' as keyof Lesson, label: 'Title' },
    // { key: 'coachId' as keyof Lesson, label: 'Coach ID' },
    // { key: 'category' as keyof Lesson, label: 'Category' },
    // { key: 'duration' as keyof Lesson, label: 'Duration (min)' },
    {
      key: 'difficulty' as keyof Lesson,
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
    {
      key: 'isPublished' as keyof Lesson,
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      )
    }
  ];

  return (
    <div>
      <Header
        title="Lessons"
        onBack={() => navigate(-1)}
        onAdd={handleAdd}
        disableAdd={data && data.length > 0}
      />
      <CrudTable
        title="Lessons"
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
        title={editingItem ? 'Edit Lesson' : 'Add Lesson'}
        size="xl"
      >
        <LessonForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          levelId={levelId}
        />
      </Modal>
    </div>
  );
}