'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
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

type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'all';

const periodOptions: { value: PeriodFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: '7 days' },
  { value: 'month', label: '1 month' },
  { value: 'year', label: '1 year' },
  { value: 'all', label: 'All time' },
];

const dashboardData = {
  today: {
    directBookings: 1,
    onlineBookings: 6,
    totalBookings: 7,
    onlineRate: 85.7,
    activeServices: 8,
    totalRevenue: 3200,
    avgRevenue: 3200,
    peakDay: 'Today',
    appointmentsTrend: [
      { day: '08', direct: 0, online: 1 },
      { day: '10', direct: 1, online: 2 },
      { day: '12', direct: 0, online: 1 },
      { day: '14', direct: 0, online: 2 },
      { day: '16', direct: 0, online: 0 },
      { day: '18', direct: 0, online: 0 },
      { day: '20', direct: 0, online: 0 },
    ],
    revenueData: [
      { name: 'AM', value: 1200 },
      { name: 'PM', value: 2000 },
    ],
  },
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
  all: {
    directBookings: 1240,
    onlineBookings: 5820,
    totalBookings: 7060,
    onlineRate: 82.4,
    activeServices: 8,
    totalRevenue: 2840000,
    avgRevenue: 4020,
    peakDay: 'August',
    appointmentsTrend: [
      { day: '2022', direct: 280, online: 1320 },
      { day: '2023', direct: 360, online: 1680 },
      { day: '2024', direct: 420, online: 1920 },
      { day: '2025', direct: 180, online: 900 },
    ],
    revenueData: [
      { name: '2022', value: 520000 },
      { name: '2023', value: 680000 },
      { name: '2024', value: 820000 },
      { name: '2025', value: 820000 },
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
    <div className="group rounded-xl border border-neutral-200 bg-white p-4 md:p-6 transition-all">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-gray-100">
          <Icon size={18} className="text-gray-400" />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${tone === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          <TrendIcon size={12} />
          <span className="text-[10px] font-medium">{trend}</span>
        </div>
      </div>
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="text-2xl md:text-3xl font-light text-gray-900">{value}</p>
    </div>
  );
}

function PeriodSegmentedControl({
  value,
  onChange,
}: {
  value: PeriodFilter;
  onChange: (value: PeriodFilter) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(`[data-period="${value}"]`);
    if (!activeButton) return;
    setIndicatorStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [value]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex h-10 max-w-full items-center overflow-x-auto rounded-full bg-neutral-200 p-1"
      role="tablist"
      aria-label="Time period"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white transition-[left,width] duration-300 ease-out"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
      {periodOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          data-period={option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 flex h-8 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors ${
            value === option.value ? 'text-gray-900' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function DonutChartCard({ data, subtitle, title }: { data: DonutDatum[]; subtitle: string; title: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6 transition-all">
      <div className="mb-4">
        <h3 className="mb-1 text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>

      <div className="relative h-[180px] md:h-[220px] min-h-0">
        <ReResponsiveContainer width="100%" height="100%" minHeight={180}>
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
          <p className="text-2xl md:text-3xl font-light text-gray-900">{total.toFixed(0)}%</p>
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
    </div>
  );
}

export default function AdminOverviewPage() {
  const [timeFilter, setTimeFilter] = useState<PeriodFilter>('month');
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

  return (
    <div className="min-h-screen p-0">
      <style>{`.accent-color { color: #0A0A0A; }`}</style>

      <div className="mb-5 md:mb-8 pt-32 md:pt-20">
        <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-6">
          <div>
            <h1 className="mb-2 text-2xl md:text-5xl font-light tracking-tight text-gray-900">Admin overview</h1>
            <p className="text-xs md:text-sm text-neutral-500">Performance overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 max-w-full">
            <div className="max-w-full overflow-x-auto">
              <PeriodSegmentedControl value={timeFilter} onChange={setTimeFilter} />
            </div>
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-3 sm:px-4 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard icon={Calendar} label="Online bookings" value={currentData.onlineBookings.toString()} trend="+12%" />
        <KpiCard icon={Users} label="Total bookings" value={currentData.totalBookings.toString()} trend="+8%" />
        <KpiCard icon={BarChart3} label="Online rate" value={`${currentData.onlineRate}%`} trend="+15%" />
        <KpiCard icon={Store} label="Active services" value={metrics.activeServices.toString()} trend="+5%" />
        <KpiCard icon={CreditCard} label="Revenue" value={formatMoney(metrics.totalRevenue)} trend="+9%" />
      </div>

      <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
        <div className="mb-6">
          <h2 className="mb-1 text-xl font-light text-gray-900">Bookings over time</h2>
          <p className="text-xs text-gray-400">Daily trend</p>
        </div>
        <div className="h-[260px] md:h-[320px] min-h-0">
        <ReResponsiveContainer width="100%" height="100%" minHeight={260}>
          <ReLineChart data={currentData.appointmentsTrend}>
            <ReCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <ReXAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} />
            <ReYAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <ReTooltip content={<CustomTooltip />} />
            <ReLine type="monotone" dataKey="direct" stroke="#1f2937" strokeWidth={2} dot={{ fill: '#1f2937', strokeWidth: 0, r: 3 }} name="Walk-in / direct" />
            <ReLine type="monotone" dataKey="online" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }} name="Online" />
          </ReLineChart>
        </ReResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-gray-100 pt-4">
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

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6 md:col-span-2 xl:col-span-2">
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-medium text-gray-900">Revenue</h3>
            <p className="text-xs text-gray-400">Financial performance</p>
          </div>
          <div className="h-[200px] md:h-[240px] min-h-0">
          <ReResponsiveContainer width="100%" height="100%" minHeight={200}>
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
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
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

        <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-medium text-gray-900">Popular services</h3>
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

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <DonutChartCard data={directVsOnlineData} subtitle="By channel" title="Bookings taken" />
        <DonutChartCard data={serviceBookingData} subtitle="Complete service distribution" title="Total bookings by service" />
      </div>

      <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
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
        <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
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
        <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
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
        <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Average occupancy rate</p>
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
