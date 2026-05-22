'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Trash2, Users, File, BarChart3, LogOut, Settings2, Calendar, Clock, Filter, UserCheck, Building, TrendingUp, FileText, ChevronDown, Bell, CreditCard, X } from 'lucide-react';
import { useAuth } from '@/lib/mock-auth';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const menuItems = [
	{ name: 'Agenda', href: '/dashboard/agenda', icon: Home },
	{ name: 'Clients', href: '/dashboard/clients/guests', icon: Users },
	{ name: 'Cash Desk', href: '/dashboard/cash-desk', icon: CreditCard },
	{ name: 'Admin', href: '/dashboard/admin', icon: Settings2 },
];

const AgendaSidebar = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [statusFilter, setStatusFilter] = useState('all');
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		const now = new Date();
		setCurrentTime(now);

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		setSelectedDate(today);

		// Listen for main calendar date changes
		const handleMainCalendarDateChange = (event: CustomEvent) => {
			setSelectedDate(new Date(event.detail));
		};
		const timer = window.setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		window.addEventListener('mainCalendarDateChange', handleMainCalendarDateChange as EventListener);

		return () => {
			window.clearInterval(timer);
			window.removeEventListener('mainCalendarDateChange', handleMainCalendarDateChange as EventListener);
		};
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

	const handleDayClick = (day: number | null) => {
		if (!day || !selectedDate) return;
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();
		const newDate = new Date(year, month, day);
		newDate.setHours(0, 0, 0, 0);
		setSelectedDate(newDate);
		window.dispatchEvent(new CustomEvent('sidebarDateChange', { detail: newDate }));
	};

	const changeMonth = (delta: number) => {
		if (!selectedDate) return;
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + delta, 1));
	};

	// Don't render until client-side state is initialized
	if (!selectedDate || !currentTime) {
		return (
			<>
				<div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6" />
				<div className="px-4 pb-5 pt-4 border-t border-white/10" />
			</>
		);
	}

	const monthYear = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	return (
		<>
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
								const isSelected = day === selectedDate.getDate();

								return day ? (
									<button
										key={i}
										onClick={() => handleDayClick(day)}
										className={`aspect-square rounded-full text-xs font-medium transition-all cursor-pointer ${
											isSelected
												? 'bg-primary text-primary-foreground'
												: 'text-white/70 hover:bg-white/10 hover:text-white cursor-pointer'
										}`}
									>
										{day}
									</button>
								) : (
									<div key={i} className="aspect-square"></div>
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
								{ value: 'all', label: 'All', color: 'gray' },
								{ value: 'pending', label: 'Pending', color: 'yellow' },
								{ value: 'confirmed', label: 'Confirmed', color: 'green' },
								{ value: 'completed', label: 'Completed', color: 'blue' },
								{ value: 'cancelled', label: 'Cancelled', color: 'red' },
								{ value: 'no_show', label: 'No Show', color: 'purple' }
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

			<div className="px-4 pb-5 pt-4 border-t border-white/10">
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
			</div>
		</>
	);
};

const ClientsSidebar = () => {
	const pathname = usePathname();

	const linkClass = (active: boolean) =>
		`flex w-full items-center gap-2 cursor-pointer px-3 py-2 text-left text-sm font-medium rounded-full transition-all ${
			active ? 'bg-primary text-primary-foreground' : 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
		}`;

	return (
		<div className="sidebar-scrollbar flex-1 overflow-y-auto px-4 py-6">
			<div className="space-y-3">
				<Link href="/dashboard/clients/guests" className={linkClass(pathname === '/dashboard/clients/guests')}>
					<FileText size={14} />
					Guests
				</Link>
				<Link href="/dashboard/clients/reviews" className={linkClass(pathname === '/dashboard/clients/reviews')}>
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
				<Link href="/dashboard/admin/reservation-trash/cancelled" className={linkClass(pathname === '/dashboard/admin/reservation-trash/cancelled')}>
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

const CashDeskSidebar = ({
  methodFilter,
  setMethodFilter,
  typeFilter,
  setTypeFilter,
  selectedPeriod,
  setSelectedPeriod
}: {
  methodFilter: string;
  setMethodFilter: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (v: string) => void;
}) => {
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
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mt-2">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mt-2">
                  <SelectValue placeholder="Select le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Refund">Refund</SelectItem>
                  <SelectItem value="Deposit">Deposit</SelectItem>
                  <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mt-2">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
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
	const [caisseMethodFilter, setCashDeskMethodFilter] = useState('all');
	const [caisseTypeFilter, setCashDeskTypeFilter] = useState('all');
	const [caissePeriod, setCashDeskPeriod] = useState('all');

	// Notification sidebar state
	const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
	const [notificationTab, setNotificationTab] = useState<'all' | 'unread'>('all');
	const notificationSidebarRef = useRef<HTMLDivElement>(null);

	const [profileImage, setProfileImage] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!showNotificationSidebar) return;
		function handleClickOutside(event: MouseEvent) {
			if (notificationSidebarRef.current && !notificationSidebarRef.current.contains(event.target as Node)) {
				setShowNotificationSidebar(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showNotificationSidebar]);

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	const getSidebarContent = () => {
		if (pathname?.startsWith('/dashboard/admin')) {
			return <AdminSidebar />;
		} else if (pathname === '/dashboard' || pathname === '/dashboard/agenda') {
			return <AgendaSidebar />;
		} else if (pathname?.startsWith('/dashboard/clients')) {
			return <ClientsSidebar />;
		} else if (pathname?.startsWith('/dashboard/cash-desk')) {
			return (
				<CashDeskSidebar
					methodFilter={caisseMethodFilter}
					setMethodFilter={setCashDeskMethodFilter}
					typeFilter={caisseTypeFilter}
					setTypeFilter={setCashDeskTypeFilter}
					selectedPeriod={caissePeriod}
					setSelectedPeriod={setCashDeskPeriod}
				/>
			);
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
								(item.href === '/dashboard/clients/guests' && pathname?.startsWith('/dashboard/clients')) ||
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
						<button className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer" title="Support">
							<span className="w-5 h-5 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-help-circle">
								  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
								  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
								  <path d="M12 16v.01" />
								  <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
								</svg>
							</span>
						</button>
						{/* Notifications */}
						<button className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer" onClick={() => setShowNotificationSidebar(true)}>
							<Bell size={20} strokeWidth={2} />
							<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
						</button>

						{/* Divider */}
						<div className="w-px h-8 bg-gray-200"></div>

						{/* User Profile */}
						<div className="flex items-center gap-3 pl-2">
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
								<input
									type="file"
									accept="image/*"
									className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
									title="Changer la photo de profil"
									onChange={e => {
										const file = e.target.files?.[0];
										if (file) {
											const reader = new FileReader();
											reader.onload = (ev) => {
												setProfileImage(ev.target?.result as string);
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
								<div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
							</div>
						</div>

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
			</aside>

			{/* Notification Sidebar (right) */}
	{showNotificationSidebar && (
		<>


			<div ref={notificationSidebarRef} className="fixed top-0 right-0 h-screen w-[480px] bg-white  z-50 transition-transform duration-300 animate-slideIn flex flex-col">
				{/* Header - Ultra Minimalist */}
				<div className="px-8 py-8 border-b border-gray-100">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-3xl font-light text-gray-900 tracking-tight">Notifications</h2>
							<p className="text-sm text-gray-400 mt-1 font-light">3 non lues</p>
						</div>
						<button
							onClick={() => setShowNotificationSidebar(false)}
							className="p-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
						>
							<X size={20} />
						</button>
					</div>

					{/* Tabs */}
					<div className="flex items-center gap-1">
						<button
							className={`px-4 py-1.5 text-xs font-medium transition-colors ${notificationTab === 'all' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
							onClick={() => setNotificationTab('all')}
						>
							All
						</button>
						<span className="text-gray-300">/</span>
						<button
							className={`px-4 py-1.5 text-xs font-medium transition-colors ${notificationTab === 'unread' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
							onClick={() => setNotificationTab('unread')}
						>
							No lues
						</button>
					</div>
				</div>

				{/* Notifications List */}
				<div className="flex-1 overflow-y-auto">
					{/* Today Section */}
					<div className="px-8 py-6">
						<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Today</p>
						{/* Only show unread if tab is 'unread', else show all */}
						{(notificationTab === 'all' || notificationTab === 'unread') && (
							<>
								{notificationTab === 'all' && (
									<>
										{/* Notification Item - Unread */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">New reservation confirmed</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Yasmine Alaoui confirmed a table at Le Jardin tomorrow at 8:30 PM.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 2 minutes</span>
												</div>
											</div>
										</div>
										{/* Notification Item - Unread */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<UserCheck size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">New reviews guest</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Ahmed Benali left a 5-star review for your VIP experience.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 15 minutes</span>
												</div>
											</div>
										</div>
										{/* Notification Item - Unread */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Reservation canceled</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Leila Tazi canceled her day pass scheduled for today at 4:00 PM.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 1 heure</span>
												</div>
											</div>
										</div>
										{/* Read Notification */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer opacity-60 hover:opacity-100">
											<div className="flex gap-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<CreditCard size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Payment received</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">450 MAD deposit received for Fatima Zahra's reservation.</p>
													<span className="text-xs text-gray-400 font-light">3 hours ago</span>
												</div>
											</div>
										</div>
									</>
								)}
								{notificationTab === 'unread' && (
									<>
										{/* Only show unread notifications (those with blue dot) */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">New reservation confirmed</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Yasmine Alaoui confirmed a table at Le Jardin tomorrow at 8:30 PM.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 2 minutes</span>
												</div>
											</div>
										</div>
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<UserCheck size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">New reviews guest</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Ahmed Benali left a 5-star review for your VIP experience.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 15 minutes</span>
												</div>
											</div>
										</div>
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Reservation canceled</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Leila Tazi canceled her day pass scheduled for today at 4:00 PM.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 1 heure</span>
												</div>
											</div>
										</div>
									</>
								)}
							</>
						)}
					</div>
					{/* Yesterday Section */}
					{notificationTab === 'all' && (
						<div className="px-8 py-6 border-t border-gray-100">
							<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Hier</p>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<TrendingUp size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Monthly report available</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">Your November statistics report is now available.</p>
										<span className="text-xs text-gray-400 font-light">Hier at 18:30</span>
									</div>
								</div>
							</div>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<Users size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">New guest saved</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">Karim Alami booked an experience through Reserva.</p>
										<span className="text-xs text-gray-400 font-light">Hier at 14:15</span>
									</div>
								</div>
							</div>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<Bell size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Demandes at confirmer</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">5 reservations demandent une validation avant tomorrow.</p>
										<span className="text-xs text-gray-400 font-light">Hier at 09:00</span>
									</div>
								</div>
							</div>
						</div>
					)}
					{/* This Week Section */}
					{notificationTab === 'all' && (
						<div className="px-8 py-6 border-t border-gray-100">
							<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">This week</p>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<FileText size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">New statement available</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">The Reserva payment statement was generated automatically.</p>
										<span className="text-xs text-gray-400 font-light">Il y a 3 jours</span>
									</div>
								</div>
							</div>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200  transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<Building size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">System update</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">News options disponibles dans la section Admin.</p>
										<span className="text-xs text-gray-400 font-light">Il y a 5 jours</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer Actions */}
				<div className="border-t border-gray-100 p-6">
					<button className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
						Tuequer tout comme lu
					</button>
				</div>
			</div>
		</>
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
  );
}
