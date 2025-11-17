import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { BookOpen, HelpCircle, Target, Gamepad2, BookCheck } from "lucide-react";
import { LevelModel } from "../model/LevelModel";

// Map each level number to a Tailwind color
const colorMap: Record<number, string> = {
    1: "red-500",
    2: "orange-500",
    3: "yellow-400",
    4: "green-500",
    5: "blue-500",
    6: "purple-500",
    7: "pink-500",
    8: "indigo-500",
    9: "gray-500",
    10: "yellow-700",
};

const Level: React.FC = () => {
    const { levelId } = useParams<{ levelId: string }>();
    const [level, setLevel] = useState<LevelModel | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevel = async () => {
            if (!levelId) return;
            const ref = doc(db, "levels", levelId);
            const snap = await getDoc(ref);
            if (!snap.exists()) return;
            setLevel(LevelModel.fromFirestoreDoc(snap));
            
        };
        fetchLevel();
        console.log("Fetched levelId:", levelId);
    }, [levelId]);

    if (!level) return <div className="text-center mt-10">Loading...</div>;

    const theme = colorMap[level.levelNumber] || "gray-500";
    // console.log(level.levelNumber);
        console.log("Level Number:", levelId?.split('_')[1]);


    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div
                className={`rounded-xl p-8 shadow-xl text-white bg-${theme}`}
            >
                <h1 className="text-3xl font-bold mb-2">{level.name}</h1>
                <p className="mb-6">
                    {level.pupilDescription.replace(/<[^>]+>/g, '')}
                </p>

                {/* <div className="flex flex-col sm:flex-row gap-4"> */}
                    {/* <button className="flex-1 bg-white text-black font-bold py-3 px-6 rounded-lg shadow hover:shadow-lg transition">
                        🚀 Start {level.name}
                    </button> */}
                    {/* <button className="flex-1 border border-white py-3 px-6 rounded-lg bg-white text-black hover:bg-gray-100 transition">
                        🎥 View Media
                    </button> */}
                {/* </div> */}
            </div>

            {/* Overview Section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Books", icon: BookOpen,
                            route: "books"
                        },
                        {
                            title: "Quizzes", icon: HelpCircle,
                            route: "quizzes"
                        },
                        {
                            title: "Challenges", icon: Target,
                            route: "challenges"
                        },
                        {
                            title: "Games", icon: Gamepad2,
                            route: "games"
                        },
                        {
                            title: "Lessons", icon: BookCheck,
                            route: "lessons"
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            onClick={() => navigate(`/level/${levelId}/${item.route}`)}
                            className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1 flex-wrap"
                        >
                            <item.icon className={`text-${theme} mb-3 w-8 h-8`} />
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                            {/* <p className="text-sm text-gray-600">{item.progress}</p> */}
                            <button
                                className={`mt-3 text-sm px-3 py-2 rounded-md bg-${theme}-100 text-${theme} hover:bg-${theme}-200`}
                            >
                                 {item.title}
                                {/* {item.title === "Books"
                                    ? "Start Reading"
                                    : item.title === "Quizzes"
                                        ? "Continue Quiz"
                                        : item.title === "Challenges"
                                            ? "Start Challenges"
                                            : item.title === "Lessons"
                                                ? "Start Lessons"
                                                : "Play Games"
                                } */}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Level;

