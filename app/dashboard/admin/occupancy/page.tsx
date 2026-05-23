'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  BarChart3,
} from 'lucide-react';
import { sampleOccupancyData } from '@/lib/mock-data';

type OccupancyData = {
  [key: string]: { [key: string]: number };
};

type HeatmapColumn = {
  id: string;
  label: string;
  dataKey: string;
  date: Date;
  inMonth: boolean;
};

type MonthWeek = {
  label: string;
  dates: Date[];
};

const timeSlots = [
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
];

const weekdayDataKeys = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'] as const;

const exportButtonClass =
  'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-4 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white';

const printButtonClass =
  'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-blue-500 bg-blue-50 px-4 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white';

const controlTrackClass = 'inline-flex h-10 items-center rounded-full bg-neutral-200 p-1';

const controlNavButtonClass =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-gray-900';

const controlPillClass = (active: boolean) =>
  `flex h-8 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors ${
    active ? 'bg-white text-gray-900' : 'text-neutral-500 hover:text-neutral-700'
  }`;

function dateToDataKey(date: Date) {
  return weekdayDataKeys[date.getDay()];
}

function formatDayHeader(date: Date) {
  const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
  return `${day} ${date.getDate()}`;
}

function dateId(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** Four weeks per month, seven days each. */
function getMonthWeeks(year: number, month: number): MonthWeek[] {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const ranges = [
    { label: 'Week 1', start: 1, end: Math.min(7, lastDay) },
    { label: 'Week 2', start: 8, end: Math.min(14, lastDay) },
    { label: 'Week 3', start: 15, end: Math.min(21, lastDay) },
    { label: 'Week 4', start: Math.min(22, lastDay), end: Math.min(28, lastDay) },
  ];

  return ranges
    .filter((range) => range.start <= range.end)
    .map((range) => {
      const dates: Date[] = [];
      for (let day = range.start; day <= range.end; day++) {
        dates.push(new Date(year, month, day));
      }
      return { label: range.label, dates };
    });
}

function buildColumn(date: Date, month: number, year: number): HeatmapColumn {
  return {
    id: dateId(date),
    label: formatDayHeader(date),
    dataKey: dateToDataKey(date),
    date,
    inMonth: date.getMonth() === month && date.getFullYear() === year,
  };
}

function getCurrentWeekIndex(weeks: MonthWeek[], today = new Date()) {
  const index = weeks.findIndex((week) =>
    week.dates.some(
      (date) =>
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
    ),
  );
  if (index >= 0) return index;

  const day = today.getDate();
  if (day <= 7) return 0;
  if (day <= 14) return 1;
  if (day <= 21) return 2;
  return 3;
}

function calculateStats(data: OccupancyData, columns: HeatmapColumn[], slots: string[]) {
  let total = 0;
  let count = 0;
  let max = 0;
  let maxDay = '';
  let maxTime = '';

  columns.forEach((column) => {
    slots.forEach((time) => {
      const value = data[column.dataKey]?.[time] ?? 0;
      total += value;
      count++;
      if (value > max) {
        max = value;
        maxDay = column.label;
        maxTime = time;
      }
    });
  });

  return {
    average: Math.round(total / Math.max(count, 1)),
    peak: max,
    peakDay: maxDay,
    peakTime: maxTime,
  };
}

function SlidingPillTabs<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  dataAttribute,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
  dataAttribute: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(`[data-${dataAttribute}="${value}"]`);
    if (!activeButton) return;
    setIndicatorStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [dataAttribute, value]);

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
      aria-label={ariaLabel}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white transition-[left,width] duration-300 ease-out"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          {...{ [`data-${dataAttribute}`]: option.value }}
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

const StatistiquesPage = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [weekIndex, setWeekIndex] = useState(() => {
    const now = new Date();
    const weeks = getMonthWeeks(now.getFullYear(), now.getMonth());
    return getCurrentWeekIndex(weeks, now);
  });
  const [showToday, setShowToday] = useState(false);
  const [draggedCell, setDraggedCell] = useState<{ day: string; time: string } | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyData>(sampleOccupancyData);

  const monthWeeks = useMemo(
    () => getMonthWeeks(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const currentWeek = monthWeeks[weekIndex] ?? monthWeeks[0];

  const weekOptions = useMemo(
    () => monthWeeks.map((week, index) => ({ value: String(index), label: week.label })),
    [monthWeeks],
  );

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const heatmapColumns = useMemo((): HeatmapColumn[] => {
    if (showToday) {
      const now = new Date();
      return [buildColumn(now, month, year)];
    }

    return currentWeek.dates.map((date) => buildColumn(date, month, year));
  }, [showToday, currentWeek, month, year]);

  const stats = useMemo(
    () => calculateStats(occupancyData, heatmapColumns, timeSlots),
    [occupancyData, heatmapColumns],
  );

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const heatmapTitle = useMemo(() => {
    if (showToday) {
      const dayLabel = heatmapColumns[0]?.label ?? 'Today';
      return `Average occupancy rate by time slot — ${dayLabel}`;
    }
    const startLabel = currentWeek.dates[0] ? formatDayHeader(currentWeek.dates[0]) : '';
    const endLabel = currentWeek.dates[6] ? formatDayHeader(currentWeek.dates[6]) : '';
    return `Average occupancy rate by day and time slot — ${currentWeek.label} (${startLabel} – ${endLabel})`;
  }, [showToday, heatmapColumns, monthLabel, currentWeek, month, year]);

  const navigateMonth = (direction: number) => {
    setShowToday(false);
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    setWeekIndex(0);
  };

  const goToToday = () => {
    const now = new Date();
    const weeks = getMonthWeeks(now.getFullYear(), now.getMonth());
    const index = getCurrentWeekIndex(weeks, now);
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setWeekIndex(index);
    setShowToday(true);
  };

  useEffect(() => {
    if (weekIndex >= monthWeeks.length) {
      setWeekIndex(0);
    }
  }, [monthWeeks, weekIndex]);

  const getColorClass = (value: number) => {
    if (value === 0) return 'bg-gray-100 text-gray-400';
    if (value <= 25) return 'bg-emerald-100 text-emerald-700';
    if (value <= 50) return 'bg-emerald-200 text-emerald-800';
    if (value <= 75) return 'bg-emerald-400 text-emerald-900';
    return 'bg-emerald-600 text-white';
  };

  const handleDragStart = (day: string, time: string) => {
    setDraggedCell({ day, time });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDay: string, targetTime: string) => {
    if (draggedCell) {
      const sourceValue = occupancyData[draggedCell.day][draggedCell.time];
      const targetValue = occupancyData[targetDay][targetTime];

      setOccupancyData((prev) => ({
        ...prev,
        [draggedCell.day]: {
          ...prev[draggedCell.day],
          [draggedCell.time]: targetValue,
        },
        [targetDay]: {
          ...prev[targetDay],
          [targetTime]: sourceValue,
        },
      }));

      setDraggedCell(null);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Time slot', ...heatmapColumns.map((col) => col.label)].join(','),
      ...timeSlots.map((time) =>
        [time, ...heatmapColumns.map((col) => `${occupancyData[col.dataKey]?.[time] ?? 0}%`)].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `occupancy-${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-week${weekIndex + 1}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  const gridTemplateColumns = showToday
    ? 'minmax(7rem, auto) 1fr'
    : 'minmax(7rem, auto) repeat(7, minmax(3.25rem, 1fr))';

  return (
    <div className="min-h-screen p-0 md:p-0">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mb-8 animate-slideDown pt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Occupancy</h1>
            <p className="text-sm text-neutral-500">
              Browse by month and week, or jump to today for a single-day view
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 no-print">
            <button type="button" onClick={exportData} className={exportButtonClass}>
              <Download size={14} />
              Exporter
            </button>
            <button type="button" onClick={printReport} className={printButtonClass}>
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <div className={controlTrackClass}>
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className={controlNavButtonClass}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="flex h-8 min-w-[9rem] items-center justify-center px-2 text-xs font-medium text-gray-900">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className={controlNavButtonClass}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className={controlTrackClass}>
              <button type="button" onClick={goToToday} className={controlPillClass(showToday)}>
                Today
              </button>
            </div>
          </div>

          <SlidingPillTabs
            value={String(weekIndex)}
            onChange={(value) => {
              setShowToday(false);
              setWeekIndex(Number(value));
            }}
            options={weekOptions}
            ariaLabel="Week of month"
            dataAttribute="week"
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-4 animate-fadeIn">
        <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
              <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Average</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium text-gray-500">Occupancy rate moyen</p>
          <p className="text-3xl font-light text-gray-900">{stats.average}%</p>
        </div>

        <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
              <Activity size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Peak</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium text-gray-500">Taux maximum atteint</p>
          <p className="text-3xl font-light text-gray-900">{stats.peak}%</p>
        </div>

        <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Day</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium text-gray-500">Busiest day</p>
          <p className="text-3xl font-light text-gray-900">{stats.peakDay || '—'}</p>
        </div>

        <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
              <BarChart3 size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Time</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium text-gray-500">Most requested time slot</p>
          <p className="text-3xl font-light text-gray-900">{stats.peakTime || '—'}</p>
        </div>
      </div>

      <div className="animate-slideUp overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-medium text-gray-900">{heatmapTitle}</h3>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[480px] p-6">
            <div className="mb-2 grid gap-2" style={{ gridTemplateColumns }}>
              <div />
              {heatmapColumns.map((column) => (
                <div key={column.id} className="text-center">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      column.inMonth ? 'text-gray-500' : 'text-gray-300'
                    }`}
                  >
                    {column.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {timeSlots.map((time) => (
                <div key={time} className="grid gap-2" style={{ gridTemplateColumns }}>
                  <div className="flex items-center">
                    <span className="text-xs font-light text-gray-500">{time}</span>
                  </div>
                  {heatmapColumns.map((column) => {
                    const value = occupancyData[column.dataKey]?.[time] ?? 0;
                    return (
                      <div
                        key={`${column.id}-${time}`}
                        draggable={column.inMonth}
                        onDragStart={() => column.inMonth && handleDragStart(column.dataKey, time)}
                        onDragOver={handleDragOver}
                        onDrop={() => column.inMonth && handleDrop(column.dataKey, time)}
                        className={`${getColorClass(value)} flex h-14 items-center justify-center rounded-xl text-center text-sm font-medium transition-all duration-200 ${
                          column.inMonth ? 'cursor-move' : 'opacity-40'
                        }`}
                      >
                        {column.inMonth ? `${value}%` : '—'}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <p className="text-xs leading-relaxed text-gray-500">
            * <span className="font-medium">Occupancy rate</span>: Ratio of worked hours to open hours for the
            selected {showToday ? 'day' : 'week'}.
          </p>
        </div>
      </div>

      <div className="animate-fadeIn mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 no-print">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-100" />
          <span>0%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-100" />
          <span>1-25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-200" />
          <span>26-50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-400" />
          <span>51-75%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-600" />
          <span>76-100%</span>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesPage;
