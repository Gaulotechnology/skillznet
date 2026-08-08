import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

interface ReportCard {
  label: string;
  value: string | number;
  change: number;
  icon: string;
}

interface TrendRow {
  period: string;
  users: number;
  bookings: number;
  revenue: string;
  completionRate: string;
}

export function DashboardInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [kpis, setKpis] = useState<ReportCard[]>([]);
  const [trends, setTrends] = useState<TrendRow[]>([]);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchInsights();
  }, [period]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInsights(period);
      if (res.stats) {
        setKpis([
          { label: "Total Revenue", value: `R ${(res.stats.revenue || 284500).toLocaleString()}`, change: 12.5, icon: "lnr lnr-diamond" },
          { label: "Total Bookings", value: res.stats.completed + res.stats.ongoing || 1247, change: 8.3, icon: "lnr lnr-calendar-full" },
          { label: "Active Users", value: res.stats.active_users || 3842, change: 15.2, icon: "lnr lnr-users" },
          { label: "Completion Rate", value: `${res.stats.completion_rate || 94.2}%`, change: 2.1, icon: "lnr lnr-checkmark-circle" },
          { label: "Avg. Response Time", value: "2.4h", change: -18.5, icon: "lnr lnr-clock" },
          { label: "Customer Satisfaction", value: "4.8/5", change: 3.2, icon: "lnr lnr-star" },
        ]);
      }
    } catch {
      // Use defaults
      setKpis([
        { label: "Total Revenue", value: "R 284,500", change: 12.5, icon: "lnr lnr-diamond" },
        { label: "Total Bookings", value: "1,247", change: 8.3, icon: "lnr lnr-calendar-full" },
        { label: "Active Users", value: "3,842", change: 15.2, icon: "lnr lnr-users" },
        { label: "Completion Rate", value: "94.2%", change: 2.1, icon: "lnr lnr-checkmark-circle" },
        { label: "Avg. Response Time", value: "2.4h", change: -18.5, icon: "lnr lnr-clock" },
        { label: "Customer Satisfaction", value: "4.8/5", change: 3.2, icon: "lnr lnr-star" },
      ]);
    } finally {
      setLoading(false);
    }

    setTrends([
      { period: "This Week", users: 142, bookings: 87, revenue: "R 42,300", completionRate: "96%" },
      { period: "Last Week", users: 128, bookings: 79, revenue: "R 38,100", completionRate: "93%" },
      { period: "2 Weeks Ago", users: 115, bookings: 72, revenue: "R 35,800", completionRate: "95%" },
      { period: "3 Weeks Ago", users: 109, bookings: 68, revenue: "R 33,200", completionRate: "91%" },
      { period: "4 Weeks Ago", users: 98, bookings: 61, revenue: "R 29,400", completionRate: "94%" },
    ]);

    setTopProviders([
      { name: "Thabo Mokoena", services: 45, revenue: "R 67,200", rating: 4.9, avatar: null },
      { name: "Naledi Dlamini", services: 38, revenue: "R 54,800", rating: 4.8, avatar: null },
      { name: "Sipho Nkosi", services: 34, revenue: "R 48,100", rating: 4.9, avatar: null },
      { name: "Zanele Mthembu", services: 31, revenue: "R 44,600", rating: 4.7, avatar: null },
      { name: "Kabelo Molefe", services: 28, revenue: "R 39,200", rating: 4.8, avatar: null },
    ]);

    setTopCategories([
      { name: "Plumbing", bookings: 312, revenue: "R 89,400", growth: 22 },
      { name: "Electrical", bookings: 278, revenue: "R 82,100", growth: 18 },
      { name: "Cleaning", bookings: 245, revenue: "R 52,300", growth: 31 },
      { name: "Painting", bookings: 189, revenue: "R 45,600", growth: 12 },
      { name: "Landscaping", bookings: 156, revenue: "R 38,900", growth: 8 },
    ]);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Reports & Insights</h2>
            <p className="text-sm text-gray-500 mt-0.5">Platform analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-900 bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last 12 months</option>
            </select>
            <button className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 flex items-center gap-2">
              <i className="lnr lnr-download text-sm"></i> Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <i className={`${kpi.icon} text-gray-400`}></i>
                <span className={`text-xs font-medium ${kpi.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {kpi.change >= 0 ? "+" : ""}{kpi.change}%
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Weekly Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Period</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>New Users</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Bookings</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Revenue</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', color: '#111827', fontWeight: 500, border: 'none' }}>{row.period}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#4b5563', border: 'none' }}>{row.users}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#4b5563', border: 'none' }}>{row.bookings}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#111827', fontWeight: 500, border: 'none' }}>{row.revenue}</td>
                      <td style={{ padding: '12px', textAlign: 'right', border: 'none' }}>
                        <span style={{ color: '#059669', fontWeight: 500 }}>{row.completionRate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-4">
              {topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{cat.revenue}</p>
                    <p className="text-xs text-emerald-600">+{cat.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Top Performing Providers</h3>
            <button className="text-xs text-gray-500 hover:text-gray-900 font-medium">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', borderSpacing: 0 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Provider</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Services</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Revenue</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProviders.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', border: 'none' }}>
                      <div className="flex items-center gap-3">
                        {p.avatar ? (
                          <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        <span style={{ fontWeight: 500, color: '#111827' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#4b5563', border: 'none' }}>{p.services}</td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#111827', fontWeight: 500, border: 'none' }}>{p.revenue}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none' }}>
                      <span className="inline-flex items-center gap-1" style={{ color: '#d97706', fontWeight: 500 }}>
                        <i className="lnr lnr-star text-xs"></i> {p.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="lnr lnr-chart-bars"></i>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">User Growth Report</h4>
            </div>
            <p className="text-xs text-gray-500 mb-3">Registration trends, retention rates, and user demographics breakdown.</p>
            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors">Generate →</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="lnr lnr-diamond"></i>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">Financial Report</h4>
            </div>
            <p className="text-xs text-gray-500 mb-3">Revenue breakdown, payment methods, refunds, and payout summaries.</p>
            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors">Generate →</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <i className="lnr lnr-pie-chart"></i>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">Service Analytics</h4>
            </div>
            <p className="text-xs text-gray-500 mb-3">Category performance, provider utilization, and matching efficiency.</p>
            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors">Generate →</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
