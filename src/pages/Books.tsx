import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookModel } from "../model/BookModel";
import CrudTable from "../components/CrudTable";
import Modal from "../components/Modal";
import BookForm from "../components/forms/BookForm";
import Header from "../components/Header";
import { fireDate } from "../utils/fireDate";

// Firestore (v9 modular) – use the db you export from firebase.ts
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from '../config/firebase';
// Reads come from your existing hook
import { useFirestore } from "../hooks/useFirestore";

export default function Books({ initialData }: { initialData?: BookModel }
) {
  const { levelId } = useParams<{ levelId: string }>();
  const { data: books, loading } = useFirestore<BookModel>("books");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BookModel | null>(null);
  const navigate = useNavigate();


  const data = React.useMemo(
    () =>
      levelId
        ? books.filter((b) => b.levelId === levelId)
        : books,
    [books, levelId]
  )


  // Open modal to edit a book
  const handleEdit = (item: BookModel) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Open modal to create new book
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // CREATE
  const addBook = async (payload: Omit<BookModel, "id" | "createdAt">) => {
    const colRef = collection(db, "books");
    const ref = doc(colRef); // pre-generate id
    const dataToSave = {
      ...payload,
      id: ref.id,
      title: String(payload.title).trim(),
      description: String(payload.description ?? ""),
      // estimatedReadTime: Number(payload.estimatedReadTime ?? 0),
      levelId: levelId ? String(levelId) : "",
      // levelNumber: Number(payload.levelNumber),
      pdfUrl: String(payload.pdfUrl).trim(),
      accessTier: (payload.accessTier ?? "free") as "free" | "premium",
      totalPages: Number(payload.totalPages ?? 0),
      isActive: Boolean(payload.isActive ?? true),
      sortOrder: Number(payload.sortOrder ?? 0),
      createdBy: payload.createdBy ?? "admin",
      publishedAt: payload.publishedAt ? Timestamp.fromDate(payload.publishedAt as Date) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, dataToSave);
  };

  // UPDATE
  const updateBook = async (id: string, payload: Omit<BookModel, "id" | "createdAt">) => {
    const ref = doc(db, "books", id);
    const dataToSave = {
      ...payload, // previous data
      id,
      title: String(payload.title).trim(),
      description: String(payload.description ?? ""),
      // estimatedReadTime: Number(payload.estimatedReadTime ?? 0),
      levelId: levelId ? String(levelId) : "",
      // levelNumber: Number(payload.levelNumber ?? 1),
      pdfUrl: String(payload.pdfUrl).trim(),
      accessTier: (payload.accessTier ?? "free") as "free" | "premium",
      totalPages: Number(payload.totalPages ?? 0),
      isActive: Boolean(payload.isActive ?? true),
      // isBook: Boolean(payload.isBook ?? true),
      sortOrder: Number(payload.sortOrder ?? 0),
      createdBy: payload.createdBy ?? "admin",
      publishedAt: payload.publishedAt ? Timestamp.fromDate(payload.publishedAt as Date) : null,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(ref, dataToSave);
  };

  // Submit from modal form
  const handleSubmit = async (bookData: Omit<BookModel, "id" | "createdAt">) => {
    try {
      if (editingItem?.id) {
        await updateBook(editingItem.id, bookData);
        console.log("Updating book with ID:", editingItem.id);
      } else {
        await addBook(bookData);
        console.log("Adding new book");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save book:", err);
      alert("Failed to save book. Check console for details.");
    }
  };

  // Table columns (only fields that exist in the model)
  const columns = [
    { key: "title" as keyof BookModel, label: "Title" },
    {
      key: "publishedAt" as keyof BookModel,
      label: "Publish Date",
      render: (value: Date | null | undefined) => (value ? fireDate(value) : "—"),
    },
    {
      key: "isActive" as keyof BookModel,
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "updatedAt" as keyof BookModel,
      label: "Updated At",
      render: (value: Date | null | undefined) => (value ? fireDate(value) : "—"),
    },
  ];

  return (
    <div className="p-6">
      <Header
        title="Books"
        onBack={() => navigate(-1)}
        onAdd={handleAdd}
        disableAdd={data && data.length > 0}
      />

      <CrudTable
        title="Books"
        data={data}
        columns={columns}
        onEdit={handleEdit}
        loading={loading}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Book" : "Create Book"}
        size="lg"
      >
        <BookForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          levelId={levelId}
        />
      </Modal>
    </div>
  );
}
