'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Trash2, Users, File, BarChart3, LogOut, Settings2, Calendar, Clock, Filter, UserCheck, Building, TrendingUp, FileText, ChevronDown, Bell, CreditCard, X, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '@/lib/mock-auth';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { CashDeskFiltersProvider, useCashDeskFilters, type CashDeskMethodFilter, type CashDeskPeriodFilter, type CashDeskTypeFilter } from '@/lib/cash-desk-filters';
import {
	dashboardNotifications,
	notificationSections,
	sectionLabels,
	type DashboardNotification,
	type NotificationIcon,
} from '@/lib/data/notifications';

const notificationIconMap: Record<NotificationIcon, typeof Calendar> = {
	calendar: Calendar,
	'user-check': UserCheck,
	'credit-card': CreditCard,
	'trending-up': TrendingUp,
	users: Users,
	bell: Bell,
	'file-text': FileText,
	building: Building,
};

const menuItems = [
	{ name: 'Agenda', href: '/dashboard/agenda', icon: Home },
	{ name: 'Bookings', href: '/dashboard/bookings', icon: Users },
	{ name: 'Cash Desk', href: '/dashboard/cash-desk', icon: CreditCard },
	{ name: 'Admin', href: '/dashboard/admin', icon: Settings2 },
];

const AgendaSidebar = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [statusFilter, setStatusFilter] = useState('all');

	useEffect(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		setSelectedDate(today);
	}, []);

	const getDaysInMonth = () => {
		if (!selectedDate) return [];
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

		const days = [];
		for (let i = 0; i < adjustedFirstDay; i++) {
			days.push(null);
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}
		return days;
	};

	const changeMonth = (delta: number) => {
		if (!selectedDate) return;
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + delta, 1));
	};

	// Don't render until client-side state is initialized
	if (!selectedDate) {
		return (
			<div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6" />
		);
	}

	const monthYear = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	return (
		<div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6" suppressHydrationWarning>
			<div className="space-y-6">
				<div className="bg-transparent">
					<div className="flex items-center justify-between mb-4">
						<button
							onClick={() => changeMonth(-1)}
							className="p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
						>
							<ChevronDown size={16} className="rotate-90 text-white/70" />
						</button>
						<h3 className="text-sm font-medium text-white">
							{monthYear}
						</h3>
						<button
							onClick={() => changeMonth(1)}
							className="p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
						>
							<ChevronDown size={16} className="-rotate-90 text-white/70" />
						</button>
					</div>
					<div className="grid grid-cols-7 gap-1 mb-2">
						{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
							<div key={i} className="text-center text-xs font-medium text-white/50 py-1">
								{day}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-1">
						{getDaysInMonth().map((day, i) => {
							const today = new Date();
							const isToday =
								!!day &&
								selectedDate.getFullYear() === today.getFullYear() &&
								selectedDate.getMonth() === today.getMonth() &&
								day === today.getDate();

							return day ? (
								<div
									key={i}
									className={`flex aspect-square items-center justify-center rounded-full text-xs font-medium ${
										isToday ? 'bg-primary text-primary-foreground' : 'text-white/70'
									}`}
								>
									{day}
								</div>
							) : (
								<div key={i} className="aspect-square" />
							);
						})}
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="text-xs font-medium text-white/60 flex items-center gap-2">
						<Filter size={14} />
						Status
					</h3>
					<div className="flex flex-wrap gap-2">
						{[
							{ value: 'all', label: 'All' },
							{ value: 'pending', label: 'Pending' },
							{ value: 'confirmed', label: 'Confirmed' },
							{ value: 'completed', label: 'Completed' },
							{ value: 'cancelled', label: 'Cancelled' },
							{ value: 'no_show', label: 'No Show' }
						].map((status) => (
							<button
								key={status.value}
								onClick={() => {
									setStatusFilter(status.value);
									window.dispatchEvent(new CustomEvent('statusFilterChange', { detail: status.value }));
								}}
								className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer ${
									statusFilter === status.value
										? 'bg-primary text-primary-foreground'
										: 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer'
								}`}
							>
								{status.label}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const SidebarClock = () => {
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		setCurrentTime(new Date());
		const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
		return () => window.clearInterval(timer);
	}, []);

	return (
		<div className="px-4 pb-5 pt-4 border-t border-white/10">
			{currentTime ? (
				<div className="flex items-center justify-center gap-2 text-center">
					<Clock size={15} className="text-primary" />
					<div className="flex items-baseline gap-1">
						<span className="text-2xl font-medium text-white tabular-nums tracking-tight">
							{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
						</span>
						<span className="text-xs font-medium text-white/60 tabular-nums">
							:{currentTime.toLocaleTimeString('en-US', { second: '2-digit', hour12: false })}
						</span>
					</div>
				</div>
			) : (
				<div className="h-8" />
			)}
		</div>
	);
};

const BookingsSidebar = () => {
	const pathname = usePathname();

	const linkClass = (active: boolean) =>
		`flex w-full items-center gap-2 cursor-pointer px-3 py-2 text-left text-sm font-medium rounded-full transition-all ${
			active ? 'bg-primary text-primary-foreground' : 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
		}`;

	return (
		<div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6">
			<div className="space-y-3">
				<Link href="/dashboard/bookings" className={linkClass(pathname === '/dashboard/bookings')}>
					<Calendar size={14} />
					All bookings
				</Link>
				<Link href="/dashboard/bookings/clients" className={linkClass(pathname === '/dashboard/bookings/clients')}>
					<FileText size={14} />
					Clients
				</Link>
				<Link href="/dashboard/bookings/reviews" className={linkClass(pathname === '/dashboard/bookings/reviews')}>
					<UserCheck size={14} />
					Reviews
				</Link>
			</div>
		</div>
	);
};

const AdminSidebar = () => {
	const pathname = usePathname();

	const linkClass = (active: boolean) =>
		`flex w-full items-center gap-2 cursor-pointer px-3 py-2 text-left text-sm font-medium rounded-full transition-all ${
			active ? 'bg-primary text-primary-foreground' : 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
		}`;

	return (
		<div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6">
			<div className="space-y-3">
				<Link href="/dashboard/admin" className={linkClass(pathname === '/dashboard/admin')}>
					<BarChart3 size={14} />
					Overview
				</Link>
				<Link href="/dashboard/admin/profile" className={linkClass(pathname === '/dashboard/admin/profile')}>
					<UserCheck size={14} />
					Profile
				</Link>
				<Link href="/dashboard/admin/establishment" className={linkClass(pathname === '/dashboard/admin/establishment')}>
					<Settings2 size={14} />
					Establishment
				</Link>
				<Link href="/dashboard/admin/services" className={linkClass(pathname === '/dashboard/admin/services')}>
					<FileText size={14} />
					Services
				</Link>
				<Link href="/dashboard/admin/occupancy" className={linkClass(pathname === '/dashboard/admin/occupancy')}>
					<TrendingUp size={14} />
					Occupancy
				</Link>
				<Link href="/dashboard/admin/cancellations" className={linkClass(pathname === '/dashboard/admin/cancellations')}>
					<Trash2 size={14} />
					Cancellations
				</Link>
				<Link href="/dashboard/admin/invoices" className={linkClass(pathname === '/dashboard/admin/invoices')}>
					<File size={14} />
					Invoices
				</Link>
			</div>
		</div>
	);
};

const CashDeskSidebar = () => {
  const {
    methodFilter,
    setMethodFilter,
    typeFilter,
    setTypeFilter,
    selectedPeriod,
    setSelectedPeriod,
  } = useCashDeskFilters();

  const handleMethodFilterChange = (value: string) => {
    const nextMethodFilter = value as CashDeskMethodFilter;
    setMethodFilter(nextMethodFilter);
  };

  const handleTypeFilterChange = (value: string) => {
    const nextTypeFilter = value as CashDeskTypeFilter;
    setTypeFilter(nextTypeFilter);
  };

  const handlePeriodFilterChange = (value: string) => {
    const nextPeriodFilter = value as CashDeskPeriodFilter;
    setSelectedPeriod(nextPeriodFilter);
  };

  return (
    <div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
            <CreditCard size={14} />
            Cash Desk filters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Method</label>
              <Select value={methodFilter} onValueChange={handleMethodFilterChange}>
                <SelectTrigger className="mt-2 flex h-10 w-full cursor-pointer items-center rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium text-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">All</SelectItem>
                  <SelectItem value="Cash" className="cursor-pointer">Cash</SelectItem>
                  <SelectItem value="Card" className="cursor-pointer">Card</SelectItem>
                  <SelectItem value="Transfer" className="cursor-pointer">Transfer</SelectItem>
                  <SelectItem value="Check" className="cursor-pointer">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="mt-2 flex h-10 w-full cursor-pointer items-center rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">All</SelectItem>
                  <SelectItem value="Sale" className="cursor-pointer">Sale</SelectItem>
                  <SelectItem value="Refund" className="cursor-pointer">Refund</SelectItem>
                  <SelectItem value="Deposit" className="cursor-pointer">Deposit</SelectItem>
                  <SelectItem value="Withdrawal" className="cursor-pointer">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Period</label>
              <Select value={selectedPeriod} onValueChange={handlePeriodFilterChange}>
                <SelectTrigger className="mt-2 flex h-10 w-full cursor-pointer items-center rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day" className="cursor-pointer">Today</SelectItem>
                  <SelectItem value="week" className="cursor-pointer">This week</SelectItem>
                  <SelectItem value="month" className="cursor-pointer">This month</SelectItem>
                  <SelectItem value="all" className="cursor-pointer">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function DashboardSidebar() {
	const pathname = usePathname();
	const { logout, user } = useAuth();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	const [showNotificationModal, setShowNotificationModal] = useState(false);
	const [notificationTab, setNotificationTab] = useState<'all' | 'unread'>('all');
	const [notifications, setNotifications] = useState<DashboardNotification[]>(dashboardNotifications);

	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [showSupportModal, setShowSupportModal] = useState(false);

	const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

	const visibleNotifications = useMemo(() => {
		if (notificationTab === 'unread') return notifications.filter((n) => !n.read);
		return notifications;
	}, [notifications, notificationTab]);

	const handleMarkAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	useEffect(() => {
		setMounted(true);
		try {
			const storedProfile = localStorage.getItem('admin_profile_settings');
			if (storedProfile) {
				const parsed = JSON.parse(storedProfile) as { avatarPreview?: string };
				if (parsed.avatarPreview) setProfileImage(parsed.avatarPreview);
			}
		} catch {
			setProfileImage(null);
		}
	}, []);

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	const getSidebarContent = () => {
		if (pathname?.startsWith('/dashboard/admin')) {
			return <AdminSidebar />;
		} else if (pathname === '/dashboard' || pathname === '/dashboard/agenda') {
			return <AgendaSidebar />;
		} else if (pathname?.startsWith('/dashboard/bookings') || pathname?.startsWith('/dashboard/clients')) {
			return <BookingsSidebar />;
		} else if (pathname?.startsWith('/dashboard/cash-desk')) {
			return <CashDeskSidebar />;
		}
		return <AgendaSidebar />;
	};

	return (
		<>
			{/* Modern Top Bar */}
			<header className="fixed top-0 left-68 right-0 h-16 backdrop-blur-lg border-b border-gray-200/50 z-40">
				<div className="h-full ml-0 px-8 flex items-center justify-between">
					{/* Left Section - Navigation */}
					<nav className="flex items-center gap-1">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive =
								(item.href === '/dashboard/agenda' && (pathname === '/dashboard' || pathname?.startsWith('/dashboard/agenda'))) ||
								(item.href === '/dashboard/bookings' && (pathname?.startsWith('/dashboard/bookings') || pathname?.startsWith('/dashboard/clients'))) ||
								(item.href === '/dashboard/cash-desk' && pathname?.startsWith('/dashboard/cash-desk')) ||
								(item.href === '/dashboard/admin' && pathname?.startsWith('/dashboard/admin')) ||
								pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									aria-current={isActive ? 'page' : undefined}
									className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold cursor-pointer ${
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-gray-600 hover:bg-white hover:text-gray-900'
									}`}
								>
									<Icon size={18} strokeWidth={2.5} />
									<span>{item.name}</span>
								</Link>
							);
						})}
					</nav>

					{/* Right Section - Actions & Profile */}
					<div className="flex items-center gap-3">
						{/* Support */}
						<button
							type="button"
							onClick={() => setShowSupportModal(true)}
							className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer"
							title="Support"
						>
							<span className="w-5 h-5 flex items-center justify-center">
								<HelpCircle size={20} strokeWidth={2} />
							</span>
						</button>
						{/* Notifications */}
						<button
							type="button"
							className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer"
							onClick={() => setShowNotificationModal(true)}
						>
							<Bell size={20} strokeWidth={2} />
							{unreadCount > 0 && (
								<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden />
							)}
						</button>

						{/* Divider */}
						<div className="w-px h-8 bg-gray-200"></div>

						{/* User Profile */}
						<Link href="/dashboard/admin/profile" className="flex items-center gap-3 pl-2 rounded-full p-1 transition-all hover:bg-gray-100">
							<div className="text-right">
								<p className="text-sm font-semibold text-gray-900 leading-tight">
									{mounted ? user?.name || 'User' : ''}
								</p>
								<p className="text-xs text-gray-500 leading-tight mt-0.5">
									{mounted ? user?.email || 'admin@example.com' : ''}
								</p>
							</div>
							<div className="relative">
								{profileImage ? (
									<img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
								) : (
									<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
										<span className="text-white font-semibold text-sm">
											{mounted ? user?.name?.charAt(0) || 'U' : ''}
										</span>
									</div>
								)}
								<div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border border-white"></div>
							</div>
						</Link>

						{/* Logout */}
						{mounted && (
							<button
								onClick={handleLogout}
								className="p-2.5 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all ml-1 cursor-pointer"
								title="Sign out"
							>
								<LogOut size={20} strokeWidth={2} />
							</button>
						)}
					</div>
				</div>
			</header>

			{/* Sidebar */}
			<aside className="fixed left-0 top-0 w-66 bg-[#0a0a0a] h-screen flex flex-col border-r border-white/10 z-50">
				<div className="px-4 pb-4 pt-6">
					<div className="flex items-center justify-center w-full">
						<img src="/logo.png" alt="Reserva" className="h-9 w-auto object-contain brightness-0 invert" />
					</div>
				</div>

				{getSidebarContent()}
				<SidebarClock />
			</aside>

			{showSupportModal && (
				<div
					className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4"
					onClick={() => setShowSupportModal(false)}
					role="presentation"
				>
					<div
						className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-labelledby="support-modal-title"
					>
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-gray-400">
									<HelpCircle size={14} />
									Support
								</p>
								<h2 id="support-modal-title" className="text-2xl font-light text-gray-900">
									Reserva help desk
								</h2>
							</div>
							<button
								type="button"
								onClick={() => setShowSupportModal(false)}
								className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
							>
								<X size={18} />
							</button>
						</div>

						<div className="space-y-3">
							{[
								{ icon: Mail, label: 'Email', value: 'support@reserva.ma', href: 'mailto:support@reserva.ma' },
								{ icon: Phone, label: 'Phone', value: '+212 5 22 00 00 00', href: 'tel:+212522000000' },
								{
									icon: MessageCircle,
									label: 'WhatsApp',
									value: '+212 6 00 00 00 00',
									href: 'https://wa.me/212600000000',
									external: true,
								},
								{ icon: Clock, label: 'Hours', value: 'Mon–Fri, 09:00–18:00' },
								{
									icon: UserCheck,
									label: 'Account',
									value: mounted ? user?.email || 'admin@example.com' : 'admin@example.com',
								},
							].map((item) => {
								const Icon = item.icon;
								const rowContent = (
									<>
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-primary/20">
												<Icon size={16} className="text-gray-500 transition-colors group-hover:text-primary" />
											</div>
											<span className="text-sm text-gray-500 transition-colors group-hover:text-primary">{item.label}</span>
										</div>
										<span className="text-right text-sm font-medium text-gray-900 transition-colors group-hover:text-primary">{item.value}</span>
									</>
								);

								if (item.href) {
									return (
										<a
											key={item.label}
											href={item.href}
											target={item.external ? '_blank' : undefined}
											rel={item.external ? 'noopener noreferrer' : undefined}
											className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-200 p-3 transition-colors hover:border-primary hover:bg-primary/10"
										>
											{rowContent}
										</a>
									);
								}

								return (
									<div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-3">
										{rowContent}
									</div>
								);
							})}
						</div>

						<button
							type="button"
							onClick={() => setShowSupportModal(false)}
							className="mt-5 w-full cursor-pointer rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
						>
							Close
						</button>
					</div>
				</div>
			)}

			{showNotificationModal && (
				<div
					className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4"
					onClick={() => setShowNotificationModal(false)}
					role="presentation"
				>
					<div
						className="flex w-full max-w-lg max-h-[min(85vh,640px)] flex-col rounded-xl border border-neutral-200 bg-white shadow-xl"
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-labelledby="notifications-modal-title"
					>
						<div className="border-b border-gray-100 p-6 pb-4">
							<div className="mb-4 flex items-start justify-between gap-4">
								<div>
									<p className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-gray-400">
										<Bell size={14} />
										Notifications
									</p>
									<h2 id="notifications-modal-title" className="text-2xl font-light text-gray-900">
										Activity
									</h2>
									<p className="mt-1 text-sm text-gray-400">
										{unreadCount === 0
											? 'All caught up'
											: `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setShowNotificationModal(false)}
									className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
								>
									<X size={18} />
								</button>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setNotificationTab('all')}
									className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
										notificationTab === 'all'
											? 'border border-primary bg-primary/15 text-gray-900'
											: 'border border-neutral-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
									}`}
								>
									All
								</button>
								<button
									type="button"
									onClick={() => setNotificationTab('unread')}
									className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
										notificationTab === 'unread'
											? 'border border-primary bg-primary/15 text-gray-900'
											: 'border border-neutral-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
									}`}
								>
									Unread
								</button>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto px-6 py-4">
							{visibleNotifications.length === 0 ? (
								<p className="py-8 text-center text-sm text-gray-400">No notifications in this view.</p>
							) : (
								notificationSections.map((section) => {
									const sectionItems = visibleNotifications.filter((n) => n.section === section);
									if (sectionItems.length === 0) return null;

									return (
										<div key={section} className="mb-4 last:mb-0">
											<p className="mb-3 text-xs font-medium tracking-wide text-gray-400">{sectionLabels[section]}</p>
											<div className="space-y-2">
												{sectionItems.map((notification) => {
													const Icon = notificationIconMap[notification.icon];
													return (
														<div
															key={notification.id}
															className={`group relative cursor-pointer rounded-xl border border-neutral-200 p-3 transition-all hover:border-primary/40 hover:bg-primary/5 ${
																notification.read ? 'opacity-60 hover:opacity-100' : ''
															}`}
														>
															{!notification.read && (
																<div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-primary" />
															)}
															<div className={`flex gap-3 ${notification.read ? '' : 'pr-3'}`}>
																<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-50">
																	<Icon size={16} className="text-gray-600" />
																</div>
																<div className="min-w-0 flex-1">
																	<p className="mb-0.5 text-sm font-medium text-gray-900">{notification.title}</p>
																	<p className="mb-1 text-xs leading-relaxed text-gray-500">{notification.message}</p>
																	<span className="text-xs font-light text-gray-400">{notification.timeAgo}</span>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									);
								})
							)}
						</div>

						<div className="border-t border-gray-100 p-6 pt-4">
							<button
								type="button"
								onClick={handleMarkAllRead}
								disabled={unreadCount === 0}
								className="w-full cursor-pointer rounded-full border border-primary/30 bg-primary/10 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Mark all as read
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Main Content Wrapper to prevent overlap */}
			<div className="ml-66">
			</div>
		</>
	);
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CashDeskFiltersProvider>
      <div className="flex min-h-screen bg-[var(--reserva-neutral-15)]">
        <DashboardSidebar />
        <style>{`
          @media print {
            .sidebar { display: none !important; }
          }
        `}</style>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </CashDeskFiltersProvider>
  );
}
