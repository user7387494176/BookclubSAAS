import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import Layout from './components/Layout/Layout';
import PomodoroWidget from './components/Pomodoro/PomodoroWidget';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Recommendations from './pages/Recommendations';
import BookSample from './pages/BookSample';
import FocusMode from './pages/FocusMode';
import Notes from './pages/Notes';
import Books from './pages/Books';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PomodoroProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="survey" element={<Survey />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="book-sample/:id" element={<BookSample />} />
                <Route path="focus" element={<FocusMode />} />
                <Route path="notes" element={<Notes />} />
                <Route path="books" element={<Books />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <PomodoroWidget />
          </Router>
        </PomodoroProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;