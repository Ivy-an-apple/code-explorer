import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LearningProvider } from './context/LearningContext';
import LearnPage from './pages/LearnPage';
import ChapterPage from './pages/ChapterPage';
import AllChaptersPage from './pages/AllChaptersPage';
import ChallengePage from './pages/ChallengePage';
import ChapterSummaryPage from './pages/ChapterSummaryPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import AchievementNotification from './components/GameUI/AchievementNotification';
import './App.css';

function App() {
  return (
    <LearningProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
          <Header />
          <AchievementNotification />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<LearnPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/chapters" element={<AllChaptersPage />} />
              <Route path="/learn/chapter/:chapterId" element={<ChapterPage />} />
              <Route path="/learn/chapter/:chapterId/summary" element={<ChapterSummaryPage />} />
              <Route path="/learn/challenge/:challengeId" element={<ChallengePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LearningProvider>
  );
}

export default App;
