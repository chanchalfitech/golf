import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Book,
  Trophy,
  MapPin,
  Users,
  Gamepad2,
  GraduationCap,
  User,
  HelpCircle,
} from "lucide-react";

interface DashboardStats {
  books: number;
  challenges: number;
  clubs: number;
  coaches: number;
  games: number;
  lessons: number;
  pupils: number;
  quizzes: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    books: 0,
    challenges: 0,
    clubs: 0,
    coaches: 0,
    games: 0,
    lessons: 0,
    pupils: 0,
    quizzes: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const collections = [
          "books",
          "challenges",
          "clubs",
          "coaches",
          "games",
          "lessons",
          "pupils",
          "quizzes",
        ];

        const promises = collections.map(async (collectionName) => {
          const querySnapshot = await getDocs(collection(db, collectionName));
          return { [collectionName]: querySnapshot.size };
        });

        const results = await Promise.all(promises);
        const newStats = results.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {} as DashboardStats
        );

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Book, label: "Books", value: stats.books, color: "bg-blue-500" },
    {
      icon: Trophy,
      label: "Challenges",
      value: stats.challenges,
      color: "bg-yellow-500",
    },
    {
      icon: MapPin,
      label: "Golf Clubs",
      value: stats.clubs,
      color: "bg-green-500",
    },
    {
      icon: Users,
      label: "Coaches",
      value: stats.coaches,
      color: "bg-purple-500",
    },
    { icon: Gamepad2, label: "Games", value: stats.games, color: "bg-red-500" },
    {
      icon: GraduationCap,
      label: "Lessons",
      value: stats.lessons,
      color: "bg-indigo-500",
    },
    { icon: User, label: "Pupils", value: stats.pupils, color: "bg-pink-500" },
    {
      icon: HelpCircle,
      label: "Quizzes",
      value: stats.quizzes,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the Golf Admin Panel. Monitor and manage your platform.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Activity */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <div className="font-medium text-blue-700">Add New Coach</div>
              <div className="text-sm text-blue-600">
                Register a new golf coach
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <div className="font-medium text-green-700">Create Challenge</div>
              <div className="text-sm text-green-600">
                Set up a new golf challenge
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <div className="font-medium text-purple-700">Add Lesson</div>
              <div className="text-sm text-purple-600">
                Create educational content
              </div>
            </button>
          </div>
        </div>


      </div> */}
    </div>
  );
}
