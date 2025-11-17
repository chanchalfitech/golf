import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

// Pages
import Books from "./pages/Books";
import Challenges from "./pages/Challenges";
import GolfClubs from "./pages/GolfClubs";
import Coaches from "./pages/Coaches";
import Games from "./pages/Games";
import CoachClubRequests from "./pages/CoachClubRequests";
import CoachVerification from "./pages/CoachVerification";
import PupilCoachRequests from "./pages/PupilCoachRequests";
import Lessons from "./pages/Lessons";
import Pupils from "./pages/Pupils";
import Quizzes from "./pages/Quizzes";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Levels from "./pages/Levels"; 
import Level from "./pages/Level";   

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route  
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Levels list */}
          <Route
            path="/levels"
            element={
              <ProtectedRoute>
                <Layout>
                  <Levels />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Level detail */}
          <Route
            path="/levels/:levelId"
            element={
              <ProtectedRoute>
                <Layout>
                  <Level />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Subpages inside a level */}
          <Route
            path="/level/:levelId/books"
            element={
              <ProtectedRoute>
                <Layout>
                  <Books />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/level/:levelId/quizzes"
            element={
              <ProtectedRoute>
                <Layout>
                  <Quizzes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/level/:levelId/lessons"
            element={
              <ProtectedRoute>
                <Layout>
                  <Lessons />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/level/:levelId/challenges"
            element={
              <ProtectedRoute>
                <Layout>
                  <Challenges />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/level/:levelId/games"
            element={
              <ProtectedRoute>
                <Layout>
                  <Games />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Other dashboard routes */}
          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <Layout>
                  <GolfClubs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coaches"
            element={
              <ProtectedRoute>
                <Layout>
                  <Coaches />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach-club-requests"
            element={
              <ProtectedRoute>
                <Layout>
                  <CoachClubRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach-verification"
            element={
              <ProtectedRoute>
                <Layout>
                  <CoachVerification />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pupil-coach-requests"
            element={
              <ProtectedRoute>
                <Layout>
                  <PupilCoachRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pupils"
            element={
              <ProtectedRoute>
                <Layout>
                  <Pupils />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
