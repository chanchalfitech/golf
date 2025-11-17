import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const colorMap: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-400",
  4: "bg-green-500",
  5: "bg-blue-500",
  6: "bg-purple-500",
  7: "bg-pink-500",
  8: "bg-indigo-500",
  9: "bg-gray-500",
  10: "bg-yellow-700",
};

const Levels: React.FC = () => {
  const [levels, setLevels] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      const snap = await getDocs(collection(db, "levels"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort ascending by levelNumber
      data.sort((a, b) => a.levelNumber - b.levelNumber);
      setLevels(data);
    };
    fetchLevels();
  }, []);

  return (
    <div className="p-6">
      {/* Heading + Create Level button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Levels</h1>

        {
          levels.length >= 10 ? null : <button
            onClick={() => navigate("/levels/create")}
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
          Create Level </button>
        }
      </div>

      {/* Levels grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {levels.map((lvl) => {
          const color = colorMap[lvl.levelNumber] || "bg-gray-400";
          return (
            <div
              key={lvl.id}
              className={`${color} text-white rounded-lg shadow-md p-4 flex flex-col justify-between`}
            >
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {lvl.name}
                </h2>
                <p className="text-sm opacity-90">{lvl.description || "No description"}</p>
              </div>

              <button
                onClick={() => navigate(`/levels/${lvl.id}`
                  , lvl.id
                )}
                className="mt-4 bg-white text-gray-800 font-medium px-4 py-2 rounded-md shadow hover:bg-gray-100"
              >
                Go to Level
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Levels;
