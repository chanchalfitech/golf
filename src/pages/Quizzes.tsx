import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuizModel, QuizQuestionModel } from '../model/QuizModel';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import QuizForm from '../components/forms/QuizForm';

export default function Quizzes({ initialData }: { initialData?: QuizModel }) {
  const { levelId } = useParams<{ levelId: string }>();
  const { data: quizzes, loading, addItem, updateItem, deleteItem } = useFirestore<QuizModel>('quizzes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuizModel | null>(null);

  const data = React.useMemo(
    () =>
      levelId
        ? quizzes.filter((q) => q.levelId === levelId)
        : quizzes,
    [quizzes, levelId]
  )

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: QuizModel) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: QuizModel) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteItem(item.id!);
      } catch (error) {
        alert('Failed to delete quiz');
      }
    }
  };

  const handleSubmit = async (formData: Omit<QuizModel, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        ...formData,
        levelId: levelId ? String(levelId) : "",
      } as Omit<QuizModel, 'id' | 'createdAt'>;
      if (editingItem) {
        await updateItem(editingItem.id!, payload);
        console.log('updated successfully');
      } else {
        await addItem(payload);
        console.log('item added successfully'); 
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save quiz');
    }
  };


  const columns = [
    { key: 'title' as keyof QuizModel, label: 'Title' },
    { key: 'category' as keyof QuizModel, label: 'Category' },
    {
      key: 'difficulty' as keyof QuizModel,
      label: 'Difficulty',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'easy' ? 'bg-green-100 text-green-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      )
    },
    {
      key: 'questions' as keyof QuizQuestionModel,
      label: 'Questions',
      render: (value: any[]) => value.length
    },
    { key: 'passingScore' as keyof QuizModel, label: 'Passing Score (%)' },
    {
      key: 'isActive' as keyof QuizModel,
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizes</h1>
        <button
          onClick={handleAdd}
          // onClick={initialData ? handleEdit : handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Add Quizes
        </button>
      </div>
      <CrudTable
        title="Quizzes"
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
        title={editingItem ? 'Edit Quiz' : 'Add Quiz'}
        size="xl"
      >
        <QuizForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          levelId={levelId}
        />
      </Modal>
    </div>
  );
}


// match /quizzes/{quizId} {
//       allow read: if true; // public read (change to auth != null if needed)
//       allow create, update: if request.auth != null && isValidQuiz(request.resource.data);
//       allow delete: if request.auth != null;
//     }

// access Tier: free/subsription