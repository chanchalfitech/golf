// import React, { useState } from 'react';
// import { Quiz, QuizQuestion } from '../../types/models';
// // import { QuizModel, QuizQuestionModel } from '../../model/QuizModel';   
// import { useParams } from 'react-router-dom';
// import { Plus, Trash2 } from 'lucide-react';

// interface QuizFormProps {
//   initialData?: Quiz | null;
//   onSubmit: (data: Omit<Quiz, 'id' | 'createdAt'>) => void;
//   onCancel: () => void;
// }

// export default function QuizForm({ initialData, onSubmit, onCancel }: QuizFormProps) {
//   const { levelId } = useParams<{ levelId: string }>();
//   const levelNumber = levelId?.split('_')[1];
//   const [formData, setFormData] = useState({
//     title: initialData?.title || '',
//     description: initialData?.description || '',
//     category: initialData?.category || '',
//     difficulty: initialData?.difficulty || 'easy' as const,
//     questions: initialData?.questions || [
//       {
//         question: '',
//         options: ['', '', ''],
//         correctAnswer: 0,
//         explanation: '',
//         // points: 1,
//         // questionId: q0,
//         // type: 'multiple_choice',

//       }
//     ],
//     timeLimit: initialData?.timeLimit || undefined,
//     passingScore: initialData?.passingScore || 70,
//     isActive: initialData?.isActive ?? true,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     levelNumber
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
//         type === 'number' ? (value === '' ? undefined : Number(value)) : value
//     }));
//   };

//   const addQuestion = () => {
//     setFormData(prev => ({
//       ...prev,
//       questions: [...prev.questions, {
//         question: '',
//         options: ['', '', ''],
//         correctAnswer: 0,
//         explanation: '',
//         // points: 1,
//         // questionId: q0,
//         // type: 'multiple_choice',
//       }]
//     }));
//   };

//   const removeQuestion = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.filter((_, i) => i !== index)
//     }));
//   };

//   const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map((q, i) =>
//         i === index ? { ...q, [field]: value } : q
//       )
//     }));
//   };

//   const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map((q, i) =>
//         i === questionIndex
//           ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
//           : q
//       )
//     }));
//   };

//   return (
//     <div className="max-h-96 overflow-y-auto">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <input
//               type="text"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               // required 
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div> */}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
//             <select
//               name="difficulty"
//               value={formData.difficulty}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
//             <input
//               type="number"
//               name="timeLimit"
//               value={formData.timeLimit || ''}
//               onChange={handleChange}
//               min="0"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
//             <input
//               type="number"
//               name="passingScore"
//               value={formData.passingScore}
//               onChange={handleChange}
//               min="0"
//               max="100"
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-medium text-gray-900">Questions</h3>
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//             >
//               <Plus className="w-4 h-4 mr-1" />
//               Add Question
//             </button>
//           </div>

//           {formData.questions.map((question, questionIndex) => (
//             <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="font-medium text-gray-900">Question {questionIndex + 1}</h4>
//                 {formData.questions.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeQuestion(questionIndex)}
//                     className="p-1 text-red-600 hover:bg-red-100 rounded"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
//                   <input
//                     type="text"
//                     value={question.question}
//                     onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
//                   <div className="space-y-2">
//                     {question.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="flex items-center space-x-2">
//                         <input
//                           type="radio"
//                           name={`correct-${questionIndex}`}
//                           checked={question.correctAnswer === optionIndex}
//                           onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
//                         />
//                         <input
//                           type="text"
//                           value={option}
//                           onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
//                           placeholder={`Option ${optionIndex + 1}`}
//                           required
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
//                   <textarea
//                     value={question.explanation || ''}
//                     onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
//                     rows={2}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             name="isActive"
//             checked={formData.isActive}
//             onChange={handleChange}
//             className="mr-2"
//           />
//           <label className="text-sm font-medium text-gray-700">Active</label>
//         </div>

//         <div className="flex justify-end space-x-3 pt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
//           >
//             {initialData ? 'Update' : 'Create'} Quiz
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface QuizFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // BASIC QUIZ FIELDS
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "");
  const [accessTier, setAccessTier] = useState(initialData?.accessTier || "free");
  const [passingScore, setPassingScore] = useState(initialData?.passingScore || 0);
  const [maxAttempts, setMaxAttempts] = useState(initialData?.maxAttempts || 1);
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || "");
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimatedTime || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [questions, setQuestions] = useState(initialData?.questions || []);

  // GET LEVEL NUMBER FROM URL
  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = levelId ? Number(levelId.split("_")[1]) : initialData?.levelNumber || 1;

  // ADD QUESTION
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionId: Date.now().toString(),
        question: "",
        type: "single",
        points: 1,
        options: [],
        correctAnswer: "",
        explanation: "",
      },
    ]);
  };

  // UPDATE QUESTION
  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // ADD OPTION
  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({
      id: Date.now().toString(),
      text: "",
    });
    setQuestions(updated);
  };

  // UPDATE OPTION TEXT
  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  // REMOVE OPTION
  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  // REMOVE QUESTION
  const removeQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  // SUBMIT HANDLER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || questions.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    const submitData = {
      title,
      description,
      // category,
      difficulty,
      accessTier,
      passingScore,
      maxAttempts,
      timeLimit,
      estimatedTime,
      isActive,
      sortOrder,
      totalQuestions: questions.length,
      totalPoints: questions.reduce((acc, q) => acc + q.points, 0),
      levelNumber,
      questions,
      updatedAt: new Date(),
      createdBy: initialData?.createdBy || "admin",
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* TITLE */}
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

      {/* DESCRIPTION */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* CATEGORY + DIFFICULTY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div> */}

        <div>
          <label className="block font-medium">Difficulty</label>
          <input
            type="text"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* NUMERIC FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Passing Score</label>
          <input
            type="number"
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Max Attempts</label>
          <input
            type="number"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Time Limit (mins)</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* ACCESS TIER */}
      <div>
        <label className="block font-medium">Access Tier</label>
        <select
          value={accessTier}
          onChange={(e) => setAccessTier(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {/* ACTIVE SWITCH */}
      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label htmlFor="isActive" className="font-medium">Active</label>
      </div>

      {/* QUESTIONS SECTION */}
      <div>
        <h2 className="text-xl font-semibold">Questions</h2>

        {questions.map((q, qIndex) => (
          <div key={q.questionId} className="border rounded p-4 mt-4 space-y-3 bg-gray-50">
            <div className="flex justify-between">
              <p className="font-semibold">Question {qIndex + 1}</p>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>

            <input
              className="w-full border p-2 rounded"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
            />

            {/* TYPE */}
            <select
              className="w-full border p-2 rounded"
              value={q.type}
              onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
            >
              <option value="single">Single</option>
              <option value="multiple">Multiple</option>
            </select>

            {/* POINTS */}
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={q.points}
              onChange={(e) => updateQuestion(qIndex, "points", Number(e.target.value))}
            />

            {/* OPTIONS */}
            <div>
              <p className="font-medium">Options</p>

              {q.options.map((op, oIndex) => (
                <div key={op.id} className="flex gap-2 items-center mb-2">
                  <input
                    className="w-full border p-2 rounded"
                    placeholder={`Option ${oIndex + 1}`}
                    value={op.text}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  />

                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeOption(qIndex, oIndex)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* ADD OPTION */}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-blue-500 hover:underline mt-2"
              >
                + Add Option
              </button>
            </div>

            {/* CORRECT ANSWER */}
            <div>
              <label className="font-medium">Correct Answer</label>
              <input
                className="w-full border p-2 rounded"
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
              />
            </div>

            {/* EXPLANATION */}
            <div>
              <label className="font-medium">Explanation</label>
              <textarea
                className="w-full border p-2 rounded"
                value={q.explanation}
                onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* ADD QUESTION BUTTON */}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        >
          + Add Question
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center space-x-4 mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {initialData ? "Update Quiz" : "Create Quiz"}
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

export default QuizForm;
