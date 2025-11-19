import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game } from '../types/models';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import GameForm from '../components/forms/GameForm';
import Header from '../components/Header';

export default function Games() {
  const { levelId } = useParams<{ levelId: string }>();
  const { data: games, loading, addItem, updateItem, deleteItem } = useFirestore<Game>('games');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Game | null>(null);

  const data = React.useMemo(
    () =>
      levelId
        ? games.filter((q) => q.levelId === levelId)
        : games,
    [games, levelId]
  )
  const navigate = useNavigate();
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Game) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Game) => {
    if (confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteItem(item.id!);
      } catch (error) {
        alert('Failed to delete game');
      }
    }
  };

  const handleSubmit = async (formData: Omit<Game, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        ...formData,
        levelId: levelId ? String(levelId) : "",
      } as Omit<Game, 'id' | 'createdAt'>;

      if (editingItem) {
        await updateItem(editingItem.id!, payload);
      } else {
        await addItem(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save game');
    }
  };

  const columns = [
    { key: 'title' as keyof Game, label: 'Title' },
    { key: 'accessTier' as keyof Game, label: 'Access Tier' },
    { key: 'category' as keyof Game, label: 'category' },
    // {
    //   key: 'difficulty' as keyof Game,
    //   label: 'Difficulty',
    //   render: (value: string) => (
    //     <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'easy' ? 'bg-green-100 text-green-800' :
    //       value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
    //         'bg-red-100 text-red-800'
    //       }`}>
    //       {value}
    //     </span>
    //   )
    // },
    // { key: 'maxScore' as keyof Game, label: 'Max Score' },
    { key: 'videoDurationSeconds' as keyof Game, label: 'Video Duration (seconds)' },  
    {
      key: 'isActive' as keyof Game,
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
    <div>
      <Header
        title="Games"
        onBack={() => navigate(-1)}
        onAdd={handleAdd}
        // disableAdd={data && data.length > 0}
      />
      <CrudTable
        title="Games"
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
        title={editingItem ? 'Edit Game' : 'Add Game'}
        size="lg"
      >
        <GameForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          levelId={levelId}
        />
      </Modal>
    </div>
  );
}