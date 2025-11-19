// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { BookModel } from "../../model/BookModel";
// import { storage } from "../../config/firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


// interface BookFormProps {
//   initialData?: BookModel;
//   onSubmit: (data: Omit<BookModel, "id" | "createdAt">) => void;
//   onCancel: () => void;
// }

// const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit, onCancel }) => {
//   const [title, setTitle] = useState(initialData?.title || "");
//   const [description, setDescription] = useState(initialData?.description || "");
//   // const [estimatedReadTime, setEstimatedReadTime] = useState(initialData?.estimatedReadTime || 0);
//   // const [currentLevelNumber, setLevelNumber] = useState(initialData?.levelNumber || 1);
//   const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
//   const [uploadProgress, setUploadProgress] = useState<number>(0);  // 🔥
//   const [isUploading, setIsUploading] = useState<boolean>(false);   // 🔥 
//   const [accessTier, setAccessTier] = useState<"free" | "premium">(initialData?.accessTier || "free");
//   const [totalPages, setTotalPages] = useState(initialData?.totalPages || 0);
//   const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
//   const [publishedAt, setPublishedAt] = useState(initialData?.publishedAt ?? '');
//   // const levelNum = levelNumber; 
//   const { levelId } = useParams<{ levelId: string }>();
//   const levelNumber = levelId ? Number(levelId.split('_')[1]) : null;


//   const handleFileUpload = (file: File) => {
//     if (!file) return;
//     const storageRef = ref(storage, `books/${Date.now()}_${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     setIsUploading(true);
//     setUploadProgress(0);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setUploadProgress(Math.round(progress));
//       },
//       (error) => {
//         console.error("🔥 Upload error details:", error.code, error.message);
//         alert(`Upload failed: ${error.code}`);
//         setIsUploading(false);
//       },
//       async () => {
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         setPdfUrl(downloadURL);
//         setIsUploading(false);
//         alert("PDF uploaded successfully!");
//       }
//     );
//   };


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!title.trim() || !pdfUrl.trim() || totalPages <= 0) {
//       alert("Please fill all required fields correctly.");
//       return;
//     }

//     const submitData: Omit<BookModel, "id" | "createdAt"> = {
//       title,
//       description,
//       // estimatedReadTime,
//       levelNumber: levelNumber || 1,
//       pdfUrl,
//       accessTier,
//       totalPages,
//       isActive,
//       sortOrder: initialData?.sortOrder || 0,
//       createdBy: initialData?.createdBy || "admin",
//       // UI sends Date|null; page converts to Firestore Timestamp and timestamps
//       updatedAt: new Date(),
//       publishedAt: publishedAt ? new Date(publishedAt) : null,
//     };

//     onSubmit(submitData);
//     console.log("Form submitted with data:", submitData);
//     console.log(title, description, pdfUrl, accessTier, totalPages, isActive, publishedAt, levelNumber);
//     console.log(submitData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block font-medium">Title</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label className="block font-medium">Description</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* <div>
//           <label className="block font-medium">Estimated Read Time (minutes)</label>
//           <input
//             type="number"
//             value={estimatedReadTime}
//             onChange={(e) => setEstimatedReadTime(Number(e.target.value))}
//             className="w-full border px-3 py-2 rounded"
//             min={0}
//           />
//         </div> */}

//         {/* <div>
//           <label className="block font-medium">Level Number</label>
//           <input
//             type="number"
//             value={levelNumber}
//             onChange={(e) => setLevelNumber(Number(e.target.value))}
//             className="w-full border px-3 py-2 rounded"
//             min={1}
//             max={10}
//           />
//         </div> */}
//       </div>

//       {/* <div>
//         <label className="block font-medium">Upload PDF File</label>
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) handleFileUpload(file);
//           }}
//           className="w-full border px-3 py-2 rounded"
//         />
//         {isUploading && (
//           <div className="mt-2 text-sm text-blue-600">
//             Uploading... {uploadProgress}%
//           </div>
//         )}
//         {pdfUrl && !isUploading && (
//           <div className="mt-2 text-green-600 text-sm">
//             ✅ File uploaded. <a href={pdfUrl} target="_blank" className="underline">View PDF</a>
//           </div>
//         )}
//       </div> */}


//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Access Tier</label>
//           <select
//             value={accessTier}
//             onChange={(e) => setAccessTier(e.target.value as "free" | "premium")}
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="free">Free</option>
//             <option value="premium">Premium</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Total Pages</label>
//           <input
//             type="number"
//             value={totalPages}
//             onChange={(e) => setTotalPages(Number(e.target.value))}
//             className="w-full border px-3 py-2 rounded"
//             min={1}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="flex items-center gap-2">
//           <input
//             id="isActive"
//             type="checkbox"
//             checked={isActive}
//             onChange={(e) => setIsActive(e.target.checked)}
//           />
//           <label htmlFor="isActive" className="font-medium">Active</label>
//         </div>

//         <div>
//           <label className="block font-medium">Publish Date</label>
//           <input
//             type="datetime-local"
//             value={publishedAt}
//             onChange={(e) => setPublishedAt(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>
//       </div>

//       <div className="flex items-center space-x-4 mt-4">
//         <button
//           type="submit"
//           disabled={isUploading}
//           className={`px-4 py-2 rounded text-white ${isUploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//             }`}
//         >
//           {isUploading
//             ? "Uploading..."
//             : initialData
//               ? "Update Book"
//               : "Create Book"}
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default BookForm;





import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BookModel } from "../../model/BookModel";

import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface BookFormProps {
  initialData?: BookModel;
  onSubmit: (data: Omit<BookModel, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");

  const [accessTier, setAccessTier] = useState<"free" | "premium">(
    initialData?.accessTier || "free"
  );
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ?? ""
  );

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = levelId ? Number(levelId.split("_")[1]) : null;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setPdfFile(file);
  };

  const handleUploadPdf = async () => {
    if (!pdfFile) {
      alert("Please choose a PDF file first.");
      return;
    }

    try {
      setUploading(true);

      const storageRef = ref(
        storage,
        `books/${Date.now()}_${pdfFile.name}`
      );

      await uploadBytes(storageRef, pdfFile);

      const downloadURL = await getDownloadURL(storageRef);

      setPdfUrl(downloadURL);

      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Error uploading PDF. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !pdfUrl.trim() || totalPages <= 0) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const submitData: Omit<BookModel, "id" | "createdAt"> = {
      title,
      description,
      levelNumber: levelNumber || 1,
      pdfUrl, 
      accessTier,
      totalPages,
      isActive,
      sortOrder: initialData?.sortOrder || 0,
      createdBy: initialData?.createdBy || "admin",
      updatedAt: new Date(),
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    };

    onSubmit(submitData);
    console.log("Form submitted with data:", submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium ">Upload PDF</label>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          />

          <button
            type="button"
            onClick={handleUploadPdf}
            disabled={!pdfFile || uploading}
            className={`px-4 py-2 rounded text-white ${
              uploading || !pdfFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>

        {pdfUrl && (
          <p className="text-sm text-green-600 mt-2">
            PDF uploaded.{" "}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              View PDF
            </a>
          </p>
        )}

        <input
          type="text"
          value={pdfUrl}
          readOnly
          placeholder="PDF URL will appear here after upload"
          className="w-full border px-3 py-2 rounded mt-2 text-sm bg-gray-50"
        />
      </div>

      {/* Access tier + pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Access Tier</label>
          <select
            value={accessTier}
            onChange={(e) =>
              setAccessTier(e.target.value as "free" | "premium")
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Total Pages</label>
          <input
            type="number"
            value={totalPages}
            onChange={(e) => setTotalPages(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            min={1}
            required
          />
        </div>
      </div>

      {/* Active + publish date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="isActive" className="font-medium">
            Active
          </label>
        </div>

        <div>
          <label className="block font-medium">Publish Date</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {initialData ? "Update" : "Create"} Book
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BookForm;
