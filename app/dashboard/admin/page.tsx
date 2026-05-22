'use client';

import { useMemo, useState, type ComponentType } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area as ReArea,
  AreaChart as ReAreaChart,
  CartesianGrid as ReCartesianGrid,
  Cell as ReCell,
  Line as ReLine,
  LineChart as ReLineChart,
  Pie as RePie,
  PieChart,
  ResponsiveContainer as ReResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
} from 'recharts';
import {
  sampleAppointments,
  sampleBookableServices,
  sampleOccupancyData,
  sampleTransactions,
} from '@/lib/mock-data';

type TooltipPayload = {
  name?: string;
  value?: number | string;
};

type DonutDatum = {
  name: string;
  value: number;
  color: string;
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

const dashboardData = {
  week: {
    directBookings: 8,
    onlineBookings: 36,
    totalBookings: 44,
    onlineRate: 81.8,
    activeServices: 8,
    totalRevenue: 23000,
    avgRevenue: 3285,
    peakDay: 'Saturday',
    appointmentsTrend: [
      { day: '01', direct: 1, online: 2 },
      { day: '02', direct: 0, online: 4 },
      { day: '03', direct: 1, online: 3 },
      { day: '04', direct: 2, online: 6 },
      { day: '05', direct: 1, online: 8 },
      { day: '06', direct: 2, online: 7 },
      { day: '07', direct: 1, online: 6 },
    ],
    revenueData: [
      { name: 'Mon', value: 2400 },
      { name: 'Tue', value: 2800 },
      { name: 'Wed', value: 3200 },
      { name: 'Thu', value: 2900 },
      { name: 'Fri', value: 3800 },
      { name: 'Sat', value: 4200 },
      { name: 'Sun', value: 3600 },
    ],
  },
  month: {
    directBookings: 32,
    onlineBookings: 156,
    totalBookings: 188,
    onlineRate: 83,
    activeServices: 8,
    totalRevenue: 68300,
    avgRevenue: 2276,
    peakDay: 'Friday',
    appointmentsTrend: [
      { day: '01', direct: 1, online: 2 },
      { day: '02', direct: 0, online: 3 },
      { day: '03', direct: 0, online: 4 },
      { day: '04', direct: 2, online: 5 },
      { day: '05', direct: 1, online: 3 },
      { day: '06', direct: 0, online: 6 },
      { day: '07', direct: 1, online: 7 },
      { day: '08', direct: 2, online: 8 },
      { day: '09', direct: 1, online: 4 },
      { day: '10', direct: 0, online: 5 },
      { day: '11', direct: 1, online: 6 },
      { day: '12', direct: 2, online: 6 },
      { day: '13', direct: 0, online: 8 },
      { day: '14', direct: 1, online: 9 },
      { day: '15', direct: 2, online: 10 },
      { day: '16', direct: 1, online: 5 },
      { day: '17', direct: 1, online: 8 },
      { day: '18', direct: 0, online: 7 },
      { day: '19', direct: 2, online: 9 },
      { day: '20', direct: 1, online: 11 },
      { day: '21', direct: 1, online: 8 },
      { day: '22', direct: 2, online: 7 },
      { day: '23', direct: 0, online: 5 },
      { day: '24', direct: 1, online: 4 },
      { day: '25', direct: 2, online: 8 },
      { day: '26', direct: 1, online: 9 },
      { day: '27', direct: 2, online: 7 },
      { day: '28', direct: 0, online: 6 },
      { day: '29', direct: 2, online: 8 },
      { day: '30', direct: 1, online: 6 },
    ],
    revenueData: [
      { name: 'S1', value: 12400 },
      { name: 'S2', value: 15800 },
      { name: 'S3', value: 18200 },
      { name: 'S4', value: 21900 },
    ],
  },
  year: {
    directBookings: 392,
    onlineBookings: 1842,
    totalBookings: 2234,
    onlineRate: 82.5,
    activeServices: 8,
    totalRevenue: 704300,
    avgRevenue: 58691,
    peakDay: 'August',
    appointmentsTrend: [
      { day: 'Jan', direct: 28, online: 145 },
      { day: 'Feb', direct: 26, online: 152 },
      { day: 'Mar', direct: 31, online: 148 },
      { day: 'Apr', direct: 29, online: 156 },
      { day: 'May', direct: 25, online: 162 },
      { day: 'Jun', direct: 30, online: 158 },
      { day: 'Jul', direct: 35, online: 168 },
      { day: 'Aug', direct: 34, online: 172 },
      { day: 'Sep', direct: 33, online: 165 },
      { day: 'Oct', direct: 38, online: 159 },
      { day: 'Nov', direct: 35, online: 155 },
      { day: 'Dec', direct: 48, online: 156 },
    ],
    revenueData: [
      { name: 'Jan', value: 45200 },
      { name: 'Feb', value: 48800 },
      { name: 'Mar', value: 52400 },
      { name: 'Apr', value: 55900 },
      { name: 'May', value: 58200 },
      { name: 'Jun', value: 61800 },
      { name: 'Jul', value: 65400 },
      { name: 'Aug', value: 68900 },
      { name: 'Sep', value: 63200 },
      { name: 'Oct', value: 59800 },
      { name: 'Nov', value: 56400 },
      { name: 'Dec', value: 68300 },
    ],
  },
};

const directVsOnlineData: DonutDatum[] = [
  { name: 'Walk-in / direct', value: 40, color: '#10b981' },
  { name: 'Online', value: 60, color: '#d1d5db' },
];

const serviceBookingData: DonutDatum[] = [
  { name: 'Table VIP - Le Jardin', value: 31, color: '#3B82F6' },
  { name: 'Brunch signature', value: 22, color: '#EC4899' },
  { name: 'Suite deluxe', value: 17, color: '#8B5CF6' },
  { name: 'Day pass rooftop pool', value: 15, color: '#10B981' },
  { name: 'Rituel hammam & massage', value: 9, color: '#F59E0B' },
  { name: 'Premium airport transfer', value: 6, color: '#EF4444' },
];

function formatMoney(value: number) {
  return `${value.toLocaleString()} MAD`;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
        <p className="text-sm font-medium text-gray-900">{payload[0].value}</p>
      </div>
    );
  }

  return null;
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  tone = 'up',
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  trend: string;
  tone?: 'up' | 'down';
}) {
  const TrendIcon = tone === 'up' ? TrendingUp : ArrowDownRight;

  return (
    <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-gray-100">
          <Icon size={18} className="text-gray-400" />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${tone === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          <TrendIcon size={12} />
          <span className="text-[10px] font-medium">{trend}</span>
        </div>
      </div>
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="text-3xl font-light text-gray-900">{value}</p>
    </div>
  );
}

function DonutChartCard({
  chartId,
  data,
  getView,
  subtitle,
  title,
  toggleView,
}: {
  chartId: string;
  data: DonutDatum[];
  getView: (chartId: string) => 'graphe' | 'tableau';
  subtitle: string;
  title: string;
  toggleView: (chartId: string) => void;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const currentView = getView(chartId);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 transition-all">
      <div className="mb-4">
        <h3 className="mb-1 text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {currentView === 'graphe' ? (
        <>
          <div className="relative">
            <ReResponsiveContainer width="100%" height={220}>
              <PieChart>
                <RePie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" startAngle={90} endAngle={450}>
                  {data.map((entry) => (
                    <ReCell key={entry.name} fill={entry.color} />
                  ))}
                </RePie>
                <ReTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
                          <p className="text-xs font-medium text-gray-900">{payload[0].name}</p>
                          <p className="text-xs text-gray-500">{payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ReResponsiveContainer>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-light text-gray-900">{total.toFixed(0)}%</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="ml-2 text-xs font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="px-3 py-3">
                  <span className="text-xs text-gray-900">Total</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-sm font-medium text-gray-900">{total.toFixed(1)}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-6 border-t border-gray-100 pt-4">
        <button
          onClick={() => toggleView(chartId)}
          className={`text-xs font-medium transition-colors ${currentView === 'graphe' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Graphe
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => toggleView(chartId)}
          className={`text-xs font-medium transition-colors ${currentView === 'tableau' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Tableau
        </button>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartViews, setChartViews] = useState<Record<string, 'graphe' | 'tableau'>>({});

  const currentData = dashboardData[timeFilter];

  const metrics = useMemo(() => {
    const activeServices = sampleBookableServices.filter((service) => service.visibility !== 'hidden').length;
    const totalRevenue = sampleTransactions
      .filter((transaction) => transaction.type === 'Sale' || transaction.type === 'Deposit')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const cancelled = sampleAppointments.filter((appointment) => appointment.status === 'cancelled').length;
    const noShows = sampleAppointments.filter((appointment) => appointment.status === 'no_show').length;
    const occupancyValues = Object.values(sampleOccupancyData).flatMap((day) => Object.values(day));
    const averageOccupancy = Math.round(
      occupancyValues.reduce((sum, value) => sum + value, 0) / Math.max(occupancyValues.length, 1),
    );

    return {
      activeServices,
      averageOccupancy,
      cancelled,
      noShows,
      totalRevenue,
    };
  }, []);

  const serviceData = useMemo(
    () =>
      sampleBookableServices
        .map((service, index) => ({
          name: service.name,
          value: sampleAppointments.filter((appointment) => appointment.service === service.name).length,
          color: ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index] ?? '#64748B',
        }))
        .filter((service) => service.value > 0),
    [],
  );

  const totalServiceVolume = serviceData.reduce((sum, service) => sum + service.value, 0);

  const toggleView = (chartId: string) => {
    setChartViews((current) => ({
      ...current,
      [chartId]: current[chartId] === 'tableau' ? 'graphe' : 'tableau',
    }));
  };

  const getView = (chartId: string) => chartViews[chartId] ?? 'graphe';

  return (
    <div className="min-h-screen p-0">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .accent-color { color: #0A0A0A; }
      `}</style>

      <div className="mb-12 pt-20 animate-slideUp">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Admin overview</h1>
            <p className="text-sm text-gray-400">Overview des performances</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedMonth((current) => (current === 0 ? 11 : current - 1))}
                className="p-1.5 text-gray-400 transition-colors hover:text-gray-900"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-[180px] text-center text-lg font-light text-gray-900">
                {monthNames[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => setSelectedMonth((current) => (current === 11 ? 0 : current + 1))}
                className="p-1.5 text-gray-400 transition-colors hover:text-gray-900"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedMonth(new Date().getMonth());
                  setSelectedYear(new Date().getFullYear());
                }}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-2">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-4 py-2 text-xs font-medium transition-all ${timeFilter === period ? 'accent-color' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {period === 'week' ? '7j' : period === 'month' ? '30j' : '1an'}
                </button>
              ))}
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:text-gray-900">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5 animate-fadeIn">
        <KpiCard icon={Calendar} label="Online bookings" value={currentData.onlineBookings.toString()} trend="+12%" />
        <KpiCard icon={Users} label="Total bookings" value={currentData.totalBookings.toString()} trend="+8%" />
        <KpiCard icon={BarChart3} label="Online rate" value={`${currentData.onlineRate}%`} trend="+15%" />
        <KpiCard icon={Store} label="Active services" value={metrics.activeServices.toString()} trend="+5%" />
        <KpiCard icon={CreditCard} label="Revenue" value={formatMoney(metrics.totalRevenue)} trend="+9%" />
      </div>

      <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 animate-fadeIn">
        <div className="mb-6">
          <h2 className="mb-1 text-xl font-light text-gray-900">Bookings over time</h2>
          <p className="text-xs text-gray-400">Daily trend</p>
        </div>
        <ReResponsiveContainer width="100%" height={320}>
          <ReLineChart data={currentData.appointmentsTrend}>
            <ReCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <ReXAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} />
            <ReYAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <ReTooltip content={<CustomTooltip />} />
            <ReLine type="monotone" dataKey="direct" stroke="#1f2937" strokeWidth={2} dot={{ fill: '#1f2937', strokeWidth: 0, r: 3 }} name="Walk-in / direct" />
            <ReLine type="monotone" dataKey="online" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }} name="Online" />
          </ReLineChart>
        </ReResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-8 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-900" />
            <span className="text-xs text-gray-600">Walk-in / direct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-600">Online</span>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-3 animate-fadeIn">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 xl:col-span-2">
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-medium text-gray-900">Revenue</h3>
            <p className="text-xs text-gray-400">Financial performance</p>
          </div>
          <ReResponsiveContainer width="100%" height={240}>
            <ReAreaChart data={currentData.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC900" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FFC900" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ReCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <ReXAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} />
              <ReYAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip content={<CustomTooltip />} />
              <ReArea type="monotone" dataKey="value" stroke="#FFC900" strokeWidth={2} fill="url(#colorRevenue)" />
            </ReAreaChart>
          </ReResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
            <div>
              <p className="mb-1 text-xs text-gray-400">Total</p>
              <p className="text-lg font-medium text-gray-900">{currentData.totalRevenue.toLocaleString()} MAD</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400">Average</p>
              <p className="text-lg font-medium text-gray-900">{currentData.avgRevenue.toLocaleString()} MAD</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400">Peak day</p>
              <p className="text-lg font-medium text-gray-900">{currentData.peakDay}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-medium text-gray-900">Services populaires</h3>
            <p className="text-xs text-gray-400">Breakdown by service</p>
          </div>
          <div className="space-y-4">
            {serviceData.map((service) => (
              <div key={service.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600">{service.name}</span>
                  <span className="text-sm font-medium text-gray-900">{service.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(service.value / Math.max(totalServiceVolume, 1)) * 100}%`,
                      backgroundColor: service.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-3 animate-fadeIn">
        <DonutChartCard
          chartId="rdv-pris"
          data={directVsOnlineData}
          getView={getView}
          subtitle="By channel"
          title="Bookings taken"
          toggleView={toggleView}
        />
        <DonutChartCard
          chartId="service-total"
          data={serviceBookingData}
          getView={getView}
          subtitle="Complete service distribution"
          title="Total bookings by service"
          toggleView={toggleView}
        />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-fadeIn">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Cancellation rate</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowDownRight size={12} />
              <span className="text-[10px] font-medium">-2.1%</span>
            </div>
          </div>
          <p className="mb-1 text-2xl font-light text-gray-900">{metrics.cancelled}</p>
          <p className="text-xs text-gray-500">Canceled reservations</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">No-shows</p>
            <div className="flex items-center gap-1 text-red-500">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+1</span>
            </div>
          </div>
          <p className="mb-1 text-2xl font-light text-gray-900">{metrics.noShows}</p>
          <p className="text-xs text-gray-500">Clients absent</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Average order value</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+8.5%</span>
            </div>
          </div>
          <p className="mb-1 text-2xl font-light text-gray-900">{formatMoney(currentData.avgRevenue)}</p>
          <p className="text-xs text-gray-500">Per booking</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Occupancy rate moyen</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+12%</span>
            </div>
          </div>
          <p className="mb-1 text-2xl font-light text-gray-900">{metrics.averageOccupancy}%</p>
          <p className="text-xs text-gray-500">Across service hours</p>
        </div>
      </div>

    </div>
  );
}
