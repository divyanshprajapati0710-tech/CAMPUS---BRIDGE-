import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Score from "./pages/Score";
import Assessment from "./pages/Assessment";
import AssessmentHistory from "./pages/AssessmentHistory";
import PageTransition from "./components/PageTransition";
import LoadingScreen from "./components/LoadingScreen";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/dashboard" element={
          <PageTransition>
            <PrivateRoute><Dashboard /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <PrivateRoute><Profile /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/jobs" element={
          <PageTransition>
            <PrivateRoute><Jobs /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/score" element={
          <PageTransition>
            <PrivateRoute><Score /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/assessment/history" element={
          <PageTransition>
            <PrivateRoute><AssessmentHistory /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/assessment" element={
          <PageTransition>
            <PrivateRoute><Assessment /></PrivateRoute>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      {!loading && <AnimatedRoutes />}
    </>
  );
}

export default App;