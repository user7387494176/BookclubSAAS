import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Recommendations from './pages/Recommendations';
import FocusMode from './pages/FocusMode';
import Notes from './pages/Notes';
import Books from './pages/Books';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="survey" element={<Survey />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="focus" element={<FocusMode />} />
              <Route path="notes" element={<Notes />} />
              <Route path="books" element={<Books />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;