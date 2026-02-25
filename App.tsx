import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ClaudeDocs } from './pages/ClaudeDocs';
import { GeminiDocs } from './pages/GeminiDocs';
import { OpenCodeDocs } from './pages/OpenCodeDocs';
import { CodexDocs } from './pages/CodexDocs';
import { PlaybookDocs } from './pages/PlaybookDocs';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { docEntryRoutes } from './data/docEntryRoutes';
import { LanguageProvider } from './context/LanguageContext';
import { AdConsentProvider } from './context/AdConsentContext';
import { AdNetworkLoader } from './components/AdNetworkLoader';

const DocsCategoryRoute: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  if (category === 'claude') {
    return <ClaudeDocs />;
  }

  if (category === 'gemini') {
    return <GeminiDocs />;
  }

  if (category === 'opencode') {
    return <OpenCodeDocs />;
  }

  if (category === 'codex') {
    return <CodexDocs />;
  }

  if (category === 'playbook') {
    return <PlaybookDocs />;
  }

  return <Navigate to={docEntryRoutes.claude} replace />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AdConsentProvider>
        <Router>
          <AdNetworkLoader />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs/:category" element={<DocsCategoryRoute />} />
              <Route path="/docs/:category/:slug" element={<DocsCategoryRoute />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              {/* Default redirect to first tool if no ID provided in docs root, or just go home */}
              <Route path="/docs" element={<Navigate to={docEntryRoutes.claude} replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AdConsentProvider>
    </LanguageProvider>
  );
};

export default App;
