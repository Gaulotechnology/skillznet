import { DashboardLayout } from "../../../components/layout/DashboardLayout";

export function DashboardKnowledgeBasePage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">Knowledge Base</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">RAG vector data management for AI implementation</p>
          </div>
        </div>

        <div className="border border-[var(--border-color)] rounded-lg p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="lnr lnr-book"></i>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">AI Knowledge Base</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
            This section will manage RAG (Retrieval-Augmented Generation) vector data for the AI assistant. 
            Upload documents, manage embeddings, and configure knowledge retrieval.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="border border-[var(--border-color)] rounded-lg p-4">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Documents</p>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-4">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Vectors</p>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-4">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">—</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Last Sync</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-6">Coming soon — AI integration in development</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
