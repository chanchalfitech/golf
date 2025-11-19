import React, { useState } from "react";
import { Lesson } from "../../types/models";
import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface LessonFormProps {
  initialData?: Lesson;
  onSubmit: (data: Omit<Lesson, "id" | "createdAt">) => void;
  onCancel: () => void;
  levelId?: string;
}

export default function LessonForm({
  initialData,
  onSubmit,
  onCancel,
  levelId
}: LessonFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "beginner");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);

  // PDF URL saved in Firestore
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");

  // For upload control
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // When user picks PDF
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    setPdfFile(file);
  };

  // Upload PDF to Firebase Storage
  const handleUploadPdf = async () => {
    if (!pdfFile) return alert("Please select a PDF file first");

    try {
      setUploading(true);

      const storageRef = ref(storage, `lessons/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(storageRef, pdfFile);

      const downloadURL = await getDownloadURL(storageRef);
      setPdfUrl(downloadURL);

      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");

    const payload: Omit<Lesson, "id" | "createdAt"> = {
      title,
      description,
      difficulty,
      isPublished,
      pdfUrl,
      levelId: levelId || "",
      updatedAt: new Date()
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <div>
        <label className="font-medium">Title</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="font-medium">Difficulty</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* PDF Upload Section */}
      <div>
        <label className="font-medium">Upload Lesson PDF</label>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">

          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="border px-3 py-2 rounded"
          />

          <button
            type="button"
            disabled={!pdfFile || uploading}
            onClick={handleUploadPdf}
            className={`px-4 py-2 text-white rounded ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>

        {pdfUrl && (
          <p className="text-green-600 text-sm mt-2">
            PDF uploaded —{" "}
            <a href={pdfUrl} target="_blank" className="underline">
              View File
            </a>
          </p>
        )}

        {/* Read-only URL field */}
        <input
          readOnly
          value={pdfUrl}
          placeholder="PDF URL appears here after upload"
          className="w-full mt-2 border px-3 py-2 rounded bg-gray-50"
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={e => setIsPublished(e.target.checked)}
        />
        <label>Published</label>
      </div>

      {/* Submit */}
      <div className="flex gap-4 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {initialData ? "Update Lesson" : "Create Lesson"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>

    </form>
  );
}
