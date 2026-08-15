import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi } from "../../../services/api";

interface KnowledgeStats {
  documents: number;
  chunks: number;
  vectors: number;
  last_sync: string | null;
}

interface KnowledgeDocument {
  title: string;
  source: string;
  chunks: number;
  vectors: number;
}

export function DashboardKnowledgeBasePage() {
  const [stats, setStats] = useState<KnowledgeStats>({ documents: 0, chunks: 0, vectors: 0, last_sync: null });
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchData = () => {
    setLoading(true);
    setError("");
    adminApi.getKnowledgeBase()
      .then((data) => {
        setStats(data.stats || { documents: 0, chunks: 0, vectors: 0, last_sync: null });
        setDocuments(data.documents || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load knowledge base:", err);
        setError("Failed to load knowledge base. Please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const rebuild = () => {
    setRebuilding(true);
    setNotice("");
    adminApi.rebuildKnowledgeBase()
      .then((res) => {
        setNotice(`${res.message} (${res.chunks_indexed} chunks indexed)`);
        fetchData();
      })
      .catch((err) => {
        console.error("Failed to rebuild knowledge base:", err);
        setNotice("Rebuild failed. Please try again.");
      })
      .finally(() => setRebuilding(false));
  };

  const columns: Column<KnowledgeDocument>[] = [
    { key: "title", label: "Document", render: (row) => <span className="text-sm font-medium text-[var(--text-primary)]">{row.title}</span> },
    { key: "source", label: "Source", render: (row) => <span className="text-xs font-mono text-[var(--text-secondary)]">{row.source || "-"}</span> },
    { key: "chunks", label: "Chunks", render: (row) => <span className="text-sm text-[var(--text-primary)]">{row.chunks}</span> },
    { key: "vectors", label: "Vectors", render: (row) => <span className="text-sm text-[var(--text-primary)]">{row.vectors}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}
        {notice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">{notice}</div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Knowledge Base</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Vector data the AI assistant retrieves answers from (RAG)
            </p>
          </div>
          <button
            onClick={rebuild}
            disabled={rebuilding}
            className="px-4 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <i className={`lnr lnr-sync ${rebuilding ? "animate-spin" : ""}`}></i>
            {rebuilding ? "Rebuilding…" : "Rebuild Index"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Documents</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{stats.documents}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Chunks</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{stats.chunks}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Vectors</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{stats.vectors}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Last Sync</p>
            <p className="text-lg font-semibold text-[var(--text-primary)] mt-1">
              {stats.last_sync ? new Date(stats.last_sync).toLocaleString() : "—"}
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={documents}
          loading={loading}
          title="Indexed Documents"
          exportFileName="knowledge-base"
          emptyIcon="lnr lnr-book"
          emptyMessage="No documents indexed yet. Click 'Rebuild Index' to generate the knowledge base."
        />

      </div>
    </DashboardLayout>
  );
}
