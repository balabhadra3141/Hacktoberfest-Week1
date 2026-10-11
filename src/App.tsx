import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReportsProvider } from './context/ReportsContext';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { ReportForm } from './pages/ReportForm';
import { ReportDetail } from './pages/ReportDetail';

export default function App() {
  return (
    <BrowserRouter>
      <ReportsProvider>
        <div className="min-h-screen bg-[#faf9f7]">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/report/:id" element={<ReportDetail />} />
            </Routes>
          </main>
        </div>
      </ReportsProvider>
    </BrowserRouter>
  );
}
