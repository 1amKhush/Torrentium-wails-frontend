import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import { Download } from './pages/Download';
import { LocalFiles } from './pages/LocalFiles';
import { History } from './pages/History';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="download" element={<Download />} />
            <Route path="files" element={<LocalFiles />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;