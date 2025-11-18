import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface QuizFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "");
  const [accessTier, setAccessTier] = useState(
    initialData?.accessTier || "free"
  );
  const [passingScore, setPassingScore] = useState(
    initialData?.passingScore || 0
  );
  const [maxAttempts, setMaxAttempts] = useState(
    initialData?.maxAttempts || 1
  );
  const [timeLimit, setTimeLimit] = useState<number>(
    initialData?.timeLimit || 0
  );
  const [estimatedTime, setEstimatedTime] = useState<number>(
    initialData?.estimatedTime || 0
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);

  const [questions, setQuestions] = useState<any[]>([]);

  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = levelId
    ? Number(levelId.split("_")[1])
    : initialData?.levelNumber || 1;

  // Normalize questions from initialData
  useEffect(() => {
    if (!initialData?.questions) {
      setQuestions([]);
      return;
    }

    const normalized = initialData.questions.map(
      (q: any, qIndex: number) => {
        const optionObjects = (q.options || []).map(
          (op: any, oIndex: number) =>
            typeof op === "string"
              ? {
                id: `${q.questionId || qIndex}-${oIndex}`,
                text: op,
              }
              : {
                id: op.id || `${q.questionId || qIndex}-${oIndex}`,
                text: op.text ?? "",
              }
        );

        // convert numeric correctAnswer index -> option text if needed
        let correctAnswer = q.correctAnswer;
        if (
          typeof correctAnswer === "number" &&
          optionObjects[correctAnswer]
        ) {
          correctAnswer = optionObjects[correctAnswer].text;
        }

        return {
          ...q,
          options: optionObjects,
          points: q.points ?? 1,
          correctAnswer: correctAnswer ?? "",
        };
      }
    );

    setQuestions(normalized);
  }, [initialData]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
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

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) {
      updated[qIndex].options = [];
    }
    updated[qIndex].options.push({
      id: Date.now().toString(),
      text: "",
    });
    setQuestions(updated);
  };

  const updateOption = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    if (!updated[qIndex].options) {
      updated[qIndex].options = [];
    }
    updated[qIndex].options[oIndex] = {
      ...updated[qIndex].options[oIndex],
      text: value,
    };
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options) {
      updated[qIndex].options.splice(oIndex, 1);
    }
    setQuestions(updated);
  };

  const removeQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || questions.length === 0) {
      alert("Please fill all required fields and add at least one question.");
      return;
    }

    const cleanedQuestions = questions.map((q: any) => ({
      ...q,
      // store options as array of strings
      options: (q.options || []).map((op: any) =>
        typeof op === "string" ? op : op.text
      ),
      points: Number(q.points) || 0,
      correctAnswer: q.correctAnswer || "",
    }));

    const submitData = {
      title,
      description,
      difficulty,
      accessTier,
      passingScore: Number(passingScore) || 0,
      maxAttempts: Number(maxAttempts) || 1,
      timeLimit: Number(timeLimit) || 0,
      estimatedTime: Number(estimatedTime) || 0,
      isActive,
      sortOrder: Number(sortOrder) || 0,
      totalQuestions: cleanedQuestions.length,
      totalPoints: cleanedQuestions.reduce(
        (acc: number, q: any) => acc + (Number(q.points) || 0),
        0
      ),
      levelNumber,
      questions: cleanedQuestions,
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

      {/* CATEGORY + DIFFICULTY (category optional, kept in state if you need later) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Uncomment if you want category input visible
        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        */}

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
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Estimated Time (mins)</label>
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

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
      </div>


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
        <h2 className="text-xl font-semibold">Questions</h2>

        {questions.map((q, qIndex) => (
          <div
            key={q.questionId || qIndex}
            className="border rounded p-4 mt-4 space-y-3 bg-gray-50"
          >
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

            {/* QUESTION TEXT */}
            <input
              className="w-full border p-2 rounded"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
            />

            {/* TYPE + POINTS IN ONE ROW, SEPARATE LABELS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block font-medium mb-1">
                  Question Type
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(qIndex, "type", e.target.value)
                  }
                >
                  <option value="single">Single</option>
                  <option value="multiple">Multiple</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Points</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border p-2 rounded"
                  value={q.points ?? 1}
                  onChange={(e) =>
                    updateQuestion(
                      qIndex,
                      "points",
                      Number(e.target.value) || 1
                    )
                  }
                  placeholder="Points"
                />
              </div>
            </div>

            {/* OPTIONS WITH RADIO FOR CORRECT ANSWER */}
            <div>
              <p className="font-medium mb-1">Options</p>

              {(q.options || []).map((op: any, oIndex: number) => (
                <div
                  key={op.id || oIndex}
                  className="flex gap-2 items-center mb-2"
                >
                  {/* Radio = select which option is correct */}
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === op.text}
                    onChange={() =>
                      updateQuestion(qIndex, "correctAnswer", op.text)
                    }
                  />

                  <input
                    className="w-full border p-2 rounded"
                    placeholder={`Option ${oIndex + 1}`}
                    value={op.text}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
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

            {/* EXPLANATION */}
            <div>
              <label className="font-medium">Explanation</label>
              <textarea
                className="w-full border p-2 rounded"
                value={q.explanation}
                onChange={(e) =>
                  updateQuestion(qIndex, "explanation", e.target.value)
                }
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
