import React, { useState, useEffect, useCallback } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import HomePage from './components/home/HomePage';
import Dashboard from './components/dashboard/Dashboard';
import AgreementList from './components/agreements/AgreementList';
import CreateAgreementForm from './components/agreements/CreateAgreementForm';
import AgreementDetailView from './components/agreements/AgreementDetailView';
import {
  getAgreements,
  getAgreementStats,
  getAgreementById,
  createAgreement,
  updateAgreement,
  checkHealth,
} from './api/agreementApi';

export function App() {
  // Navigation: 'home' | 'dashboard' | 'agreements' | 'create' | 'details'
  const [currentView, setCurrentView] = useState('home');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [createMode, setCreateMode] = useState(null); // 'camera' | 'text' | 'speech' | null

  // Data states
  const [agreements, setAgreements] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    draft: 0,
    cancelled: 0,
    totalAgreedValue: 0,
    totalAdvanceReceived: 0,
    totalPendingBalance: 0,
  });

  // UI & loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const [dbStatus, setDbStatus] = useState({ connected: false, message: '' });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Trigger toast banner with auto-dismiss
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load database and system health
  const verifyHealth = useCallback(async () => {
    try {
      const healthData = await checkHealth();
      setDbStatus({
        connected: healthData?.database?.connected || false,
        message: healthData?.database?.status || 'Unknown',
      });
    } catch (err) {
      setDbStatus({
        connected: false,
        message: 'Backend server unreachable',
      });
    }
  }, []);

  // Fetch all agreements with current filters
  const loadAgreements = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus && selectedStatus !== 'All') {
        params.status = selectedStatus;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await getAgreements(params);
      if (res?.success) {
        setAgreements(res.data);
      }
    } catch (err) {
      console.error('Error fetching agreements:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  // Fetch dashboard summary stats
  const loadStats = useCallback(async () => {
    try {
      const res = await getAgreementStats();
      if (res?.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    verifyHealth();
    loadStats();
    loadAgreements();
  }, [verifyHealth, loadStats, loadAgreements]);

  // Handler: Select an agreement to inspect details
  const handleSelectAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Form submission for new agreement
  const handleCreateAgreement = async (payload) => {
    setSubmitting(true);
    try {
      const res = await createAgreement(payload);
      if (res?.success) {
        showToast(`Agreement ${res.data.agreementId} created successfully!`, 'success');
        await loadAgreements();
        await loadStats();
        setSelectedAgreement(res.data);
        setCurrentView('details');
        setCreateMode(null);
      } else {
        showToast(res.message || 'Failed to create agreement', 'error');
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Submission failed. Please check backend connection.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: Status transition update (Pending -> Confirmed -> Completed)
  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await updateAgreement(id, { status: newStatus });
      if (res?.success) {
        showToast(`Agreement updated to "${newStatus}"`, 'success');
        setSelectedAgreement(res.data);
        await loadAgreements();
        await loadStats();
      } else {
        showToast(res.message || 'Failed to update agreement status', 'error');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update status';
      showToast(errMsg, 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handler: Jump to create with a specific mode ('camera' | 'text' | 'speech')
  const handleCreateWithMode = (mode) => {
    setCreateMode(mode);
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Floating notification toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 transition-all transform translate-y-0 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Full Width Top Bar: Extreme left Vishwas & logo, extreme right Profile Icon */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view !== 'details') setSelectedAgreement(null);
          if (view !== 'create') setCreateMode(null);
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* VIEW 1: HOMEPAGE */}
      {currentView === 'home' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <HomePage
            stats={stats}
            onNavigate={(view) => {
              setCurrentView(view);
              if (view !== 'create') setCreateMode(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : (
        /* VIEW 2: APP WORKSPACE (Side Panel + Workspace Content) */
        <div className="flex-1 flex min-w-0">
          {/* Side Panel */}
          <Sidebar
            currentView={currentView}
            setCurrentView={(view) => {
              setCurrentView(view);
              if (view !== 'details') setSelectedAgreement(null);
              if (view !== 'create') setCreateMode(null);
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            stats={stats}
            onCreateWithMode={handleCreateWithMode}
          />

          {/* Main Workspace Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
            {currentView === 'dashboard' && (
              <Dashboard
                stats={stats}
                recentAgreements={agreements}
                loading={loading}
                onNavigate={(view) => {
                  setCurrentView(view);
                  if (view !== 'create') setCreateMode(null);
                }}
                onSelectAgreement={handleSelectAgreement}
                dbStatus={dbStatus}
              />
            )}

            {currentView === 'agreements' && (
              <AgreementList
                agreements={agreements}
                loading={loading}
                onRefresh={() => {
                  loadAgreements();
                  loadStats();
                  verifyHealth();
                }}
                onSelectAgreement={handleSelectAgreement}
                onCreateNew={() => {
                  setCreateMode(null);
                  setCurrentView('create');
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
            )}

            {currentView === 'create' && (
              <CreateAgreementForm
                onSubmit={handleCreateAgreement}
                onCancel={() => {
                  setCreateMode(null);
                  setCurrentView('dashboard');
                }}
                submitting={submitting}
                initialMode={createMode}
              />
            )}

            {currentView === 'details' && selectedAgreement && (
              <AgreementDetailView
                agreement={selectedAgreement}
                onBack={() => setCurrentView('agreements')}
                onStatusUpdate={handleStatusUpdate}
                updatingStatus={updatingStatus}
              />
            )}
          </main>
        </div>
      )}

      {/* Professional Spacious Footer */}
      <Footer />
    </div>
  );
}

export default App;
