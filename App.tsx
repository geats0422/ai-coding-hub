import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Docs } from './pages/Docs';
import { ClaudeDocs } from './pages/ClaudeDocs';
import { GeminiDocs } from './pages/GeminiDocs';
import { OpenCodeDocs } from './pages/OpenCodeDocs';
import { CodexDocs } from './pages/CodexDocs';
import { PlaybookDocs } from './pages/PlaybookDocs';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { LanguageProvider } from './context/LanguageContext';
import { AdConsentProvider } from './context/AdConsentContext';
import { AdNetworkLoader } from './components/AdNetworkLoader';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AdConsentProvider>
        <Router>
          <AdNetworkLoader />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs/claude" element={<ClaudeDocs />} />
              <Route path="/docs/gemini" element={<GeminiDocs />} />
              <Route path="/docs/opencode" element={<OpenCodeDocs />} />
              <Route path="/docs/codex" element={<CodexDocs />} />
              <Route path="/docs/playbook" element={<PlaybookDocs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/docs/:toolId" element={<Docs />} />
              {/* Default redirect to first tool if no ID provided in docs root, or just go home */}
              <Route path="/docs" element={<Navigate to="/docs/claude" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AdConsentProvider>
    </LanguageProvider>
  );
};

export default App;
