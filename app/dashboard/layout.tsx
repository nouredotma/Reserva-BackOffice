'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Trash2, Users, Settings, File, BarChart3, LogOut, Settings2, ChevronRight, LayoutPanelLeft, Calendar, Clock, Filter, UserCheck, Building, TrendingUp, FileText, ChevronDown, Bell, Menu, CreditCard, LifeBuoy, X } from 'lucide-react';
import { useAuth } from '@/lib/mock-auth';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const menuItems = [
	{ name: 'Agenda', href: '/dashboard/rendez-vous', icon: Home },
	{ name: 'Clients', href: '/dashboard/clients/fichier-client/gestion', icon: Users },
	{ name: 'Caisse', href: '/dashboard/caisse', icon: CreditCard },
	{ name: 'Admin', href: '/dashboard/admin/param-agenda/gestion-de-prestations', icon: Settings2 },
];

// Sidebar content components remain the same
const RendezVousSidebar = () => {
	const [mounted, setMounted] = useState(false);
	const [selectedDate, setSelectedDate] = useState(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	});
	const [statusFilter, setStatusFilter] = useState('all');
	const [monthYear, setMonthYear] = useState('');

	useEffect(() => {
		setMounted(true);

		// Listen for main calendar date changes
		const handleMainCalendarDateChange = (event: CustomEvent) => {
			setSelectedDate(new Date(event.detail));
		};

		window.addEventListener('mainCalendarDateChange', handleMainCalendarDateChange as EventListener);

		return () => {
			window.removeEventListener('mainCalendarDateChange', handleMainCalendarDateChange as EventListener);
		};
	}, []);

	useEffect(() => {
		if (mounted) {
			setMonthYear(selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
		}
	}, [selectedDate, mounted]);

	const getDaysInMonth = () => {
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
		if (!day) return;
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();
		const newDate = new Date(year, month, day);
		newDate.setHours(0, 0, 0, 0);
		setSelectedDate(newDate);
		window.dispatchEvent(new CustomEvent('sidebarDateChange', { detail: newDate }));
	};

	const changeMonth = (delta: number) => {
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + delta, 1));
	};

	const goToToday = () => {
		setSelectedDate(new Date());
	};

	if (!mounted) {
		return (
			<div className="flex-1 overflow-y-auto p-4">
				<div className="space-y-4">
					<div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto p-6">
			<div className="space-y-6">
				<div className="bg-transparent">
					<div className="flex items-center justify-between mb-4">
						<button
							onClick={() => changeMonth(-1)}
							className="p-1 hover:bg-white/10 rounded transition-all"
						>
							<ChevronDown size={16} className="rotate-90 text-zinc-400" />
						</button>
						<h3 className="text-sm font-semibold text-white">
							{monthYear}
						</h3>
						<button
							onClick={() => changeMonth(1)}
							className="p-1 hover:bg-white/10 rounded transition-all"
						>
							<ChevronDown size={16} className="-rotate-90 text-zinc-400" />
						</button>
					</div>
					<div className="grid grid-cols-7 gap-1 mb-2">
						{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
							<div key={i} className="text-center text-xs font-medium text-zinc-500 py-1">
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
									className={`aspect-square rounded-md text-xs font-medium transition-all ${
										isSelected
											? 'bg-primary text-primary-foreground'
											: 'text-zinc-300 hover:bg-white/10'
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
					<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
						<Filter size={14} />
						Statut
					</h3>
					<div className="flex flex-wrap gap-2">
						{[
							{ value: 'all', label: 'Tous', color: 'gray' },
							{ value: 'confirmed', label: 'ConfirmÃ©', color: 'green' },
							{ value: 'pending', label: 'En attente', color: 'yellow' },
							{ value: 'cancelled', label: 'AnnulÃ©', color: 'red' }
						].map((status) => (
							<button
								key={status.value}
								onClick={() => {
									setStatusFilter(status.value);
									// Dispatch event for the rendez-vous page to listen to
									window.dispatchEvent(new CustomEvent('statusFilterChange', { detail: status.value }));
								}}
								className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${
									statusFilter === status.value
										? status.color === 'gray'
											? 'bg-primary text-primary-foreground'
											: status.color === 'green'
											? 'bg-primary text-primary-foreground'
											: status.color === 'yellow'
											? 'bg-primary text-primary-foreground'
											: 'bg-primary text-primary-foreground'
										: 'bg-white/5 text-zinc-300 hover:bg-white/10'
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

const ClientsSidebar = () => {
	const [mounted, setMounted] = useState(false);
	const [showFichierClient, setShowFichierClient] = useState(true);
	const [showMesAvis, setShowMesAvis] = useState(false);
	const [showStatistiquesClients, setShowStatistiquesClients] = useState(false);
	const pathname = usePathname();

	const menuItems = {
		fichier: [
			{ label: 'Gestion', path: '/dashboard/clients/fichier-client/gestion' },
			{ label: 'Doublons', path: '/dashboard/clients/fichier-client/doublons' }
		],
		avis: [
			{ label: 'Avis Ã  modÃ©rer', path: '/dashboard/clients/mes-avis/avis-a-moderer' },
			{ label: 'Avis modÃ©rÃ©s', path: '/dashboard/clients/mes-avis/avis-moderes' },
			{ label: 'Avis refusÃ©s', path: '/dashboard/clients/mes-avis/avis-refuses' },
			{ label: 'RÃ¨gles de modÃ©ration', path: '/dashboard/clients/mes-avis/regles-moderation' },
			{ label: 'Statistiques avis', path: '/dashboard/clients/mes-avis/statistiques-avis' }
		],
		stats: [
			{ label: '100 meilleurs clients', path: '/dashboard/clients/statistiques/meilleurs-clients' },
			{ label: 'Nouveaux clients', path: '/dashboard/clients/statistiques/nouveaux-clients' },
			{ label: 'FrÃ©quences globales', path: '/dashboard/clients/statistiques/frequences-globales' }
		]
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-6">
					<div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto p-6">
			<div className="space-y-6">
				{/* Fichier Client */}
				<div className="space-y-3">
					<button
						onClick={() => setShowFichierClient(!showFichierClient)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<FileText size={14} />
							Fichier Client
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showFichierClient ? 'rotate-180' : ''}`} />
					</button>
					{showFichierClient && (
						<div className="space-y-1 animate-fadeIn">
							{menuItems.fichier.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${
										pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Mes Avis */}
				<div className="space-y-3">
					<button
						onClick={() => setShowMesAvis(!showMesAvis)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<UserCheck size={14} />
							Mes Avis
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showMesAvis ? 'rotate-180' : ''}`} />
					</button>
					{showMesAvis && (
						<div className="space-y-1 animate-fadeIn">
							{menuItems.avis.map((item) => (
								<Link
								key={item.path}
									href={item.path}
									className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${
										pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Statistiques Clients */}
				<div className="space-y-3">
					<button
						onClick={() => setShowStatistiquesClients(!showStatistiquesClients)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<TrendingUp size={14} />
							Statistiques Clients
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showStatistiquesClients ? 'rotate-180' : ''}`} />
					</button>
					{showStatistiquesClients && (
						<div className="space-y-1 animate-fadeIn">
							{menuItems.stats.map((item) => (
								<Link
								key={item.path}
									href={item.path}
									className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${
										pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const AdminSidebar = () => {
	const [mounted, setMounted] = useState(false);
	const [showParamAgenda, setShowParamAgenda] = useState(true);
	const [showParamEtablissement, setShowParamEtablissement] = useState(false);
	const [showFichClient, setShowFichClient] = useState(false);
	const [showStatistiquesRDV, setShowStatistiquesRDV] = useState(false);
	const [showTauxOccupation, setShowTauxOccupation] = useState(false);
	const [showCorbeilleRDV, setShowCorbeilleRDV] = useState(false);
	const [showMesFactures, setShowMesFactures] = useState(false);
	const pathname = usePathname();

	const paramAgendaLinks = [
	    { label: 'Gestion de prestations', path: '/dashboard/admin/param-agenda/gestion-de-prestations' },
		{ label: 'Gestion des agendas', path: '/dashboard/admin/param-agenda/gestion-des-agendas' },
		{ label: 'Gestion affichage RDV', path: '/dashboard/admin/param-agenda/gestion-affichage-rdv' },
	];

	const paramEtablissementLinks = [
		{ label: 'Gestion photos', path: '/dashboard/admin/param-etablissement/gestion-photos' },
		{ label: 'Descriptif Ã©tablissement', path: '/dashboard/admin/param-etablissement/descriptif-etablissement' },
		{ label: 'Notifications rdv web', path: '/dashboard/admin/param-etablissement/notifications-rdv-web' },
		{ label: 'Gestion horaires & dÃ©lais', path: '/dashboard/admin/param-etablissement/gestion-horaires-delais' },
		{ label: 'Gestion message', path: '/dashboard/admin/param-etablissement/gestion-message' },
		{ label: 'Gestion liste attente', path: '/dashboard/admin/param-etablissement/gestion-liste-attente' },
	];

	const statistiquesRDVLinks = [
	    { label: 'Indicateurs clÃ©s', path: '/dashboard/admin/statistiques-rdv/indicateurs-cles' },
	    { label: 'Autres indicateurs', path: '/dashboard/admin/statistiques-rdv/autres' },
	    { label: 'Prestations', path: '/dashboard/admin/statistiques-rdv/Prestations' },
	    { label: 'Collaborateurs', path: '/dashboard/admin/statistiques-rdv/collaborateurs' },
	    { label: 'RDV', path: '/dashboard/admin/statistiques-rdv/rdv' },
	    { label: 'RDV pas venus', path: '/dashboard/admin/statistiques-rdv/rdv-pas-venus' },
	];

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-6">
					<div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto p-6">
			<div className="space-y-6">
				{/* ParamÃ©trage Agenda */}
				<div className="space-y-3">
					<button
						onClick={() => setShowParamAgenda(!showParamAgenda)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<Settings2 size={14} />
							Agenda
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showParamAgenda ? 'rotate-180' : ''}`} />
					</button>
					{showParamAgenda && (
						<div className="space-y-1 animate-fadeIn">
							{paramAgendaLinks.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${
										pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					)}
				</div>

				{/* ParamÃ¨tre Ã‰tablissement */}
				<div className="space-y-3">
					<button
						onClick={() => setShowParamEtablissement(!showParamEtablissement)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<Settings2 size={14} />
							Ã‰tablissement
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showParamEtablissement ? 'rotate-180' : ''}`} />
					</button>
					{showParamEtablissement && (
						<div className="space-y-1 animate-fadeIn">
							{paramEtablissementLinks.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${
										pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Fich Client (now last) */}
				<div className="space-y-3">
					<button
						onClick={() => setShowFichClient(!showFichClient)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<FileText size={14} />
							Fiche Client
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showFichClient ? 'rotate-180' : ''}`} />
					</button>
					{showFichClient && (
						<div className="space-y-1 animate-fadeIn">
							<Link
								href="/dashboard/admin/fiche-clients/gestion-fiche-clients"
								className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/fiche-clients/gestion-fiche-clients' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
							>
								Gestion fiche clients
							</Link>
						</div>
					)}
				</div>

				{/* Statistiques RDV (new section at the bottom) */}
				<div className="space-y-3">
                    <button
                        onClick={() => setShowStatistiquesRDV(!showStatistiquesRDV)}
                        className="w-full flex items-center justify-between group"
                    >
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
                            <BarChart3 size={14} />
                            Statistiques RDV
                        </h3>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform ${showStatistiquesRDV ? 'rotate-180' : ''}`} />
                    </button>
                    {showStatistiquesRDV && (
                        <div className="space-y-1 animate-fadeIn">
                            {statistiquesRDVLinks.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Taux d'occupation Section */}
                <div className="space-y-3">
                    <button
                        onClick={() => setShowTauxOccupation(!showTauxOccupation)}
                        className="w-full flex items-center justify-between group"
                    >
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
                            <TrendingUp size={14} />
                            Taux d'occupation
                        </h3>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform ${showTauxOccupation ? 'rotate-180' : ''}`} />
                    </button>
                    {showTauxOccupation && (
                        <div className="space-y-1 animate-fadeIn">
                            <Link
                                href="/dashboard/admin/taux-occupation/vue-ensemble"
                                className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/taux-occupation/vue-ensemble' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
                            >
                                Vue d'ensemble
                            </Link>
                            <Link
                                href="/dashboard/admin/taux-occupation/collaborateurs"
                                className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/taux-occupation/collaborateurs' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
                            >
                                Collaborateurs
                            </Link>
                            <Link
                                href="/dashboard/admin/taux-occupation/prestations"
                                className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/taux-occupation/prestations' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
                            >
                                Prestations
                            </Link>
                        </div>
                    )}
                </div>

                {/* Corbeille RDV Section */}
                <div className="space-y-3">
                    <button
                        onClick={() => setShowCorbeilleRDV(!showCorbeilleRDV)}
                        className="w-full flex items-center justify-between group"
                    >
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
                            <Trash2 size={14} />
                            Corbeille RDV
                        </h3>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform ${showCorbeilleRDV ? 'rotate-180' : ''}`} />
                    </button>
                    {showCorbeilleRDV && (
                        <div className="space-y-1 animate-fadeIn">
                            <Link
                                href="/dashboard/admin/corbeille-rdv/rdv-annules"
                                className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/corbeille-rdv/rdv-annules' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
                            >
                                RDV annulÃ©s
                            </Link>
                        </div>
                    )}
                </div>

				{/* Mes factures Section */}
				<div className="space-y-3">
					<button
						onClick={() => setShowMesFactures && setShowMesFactures((prev: boolean) => !prev)}
						className="w-full flex items-center justify-between group"
					>
						<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2 group-hover:text-white transition-colors">
							<File size={14} />
							Mes factures
						</h3>
						<ChevronDown size={14} className={`text-zinc-400 transition-transform ${showMesFactures ? 'rotate-180' : ''}`} />
					</button>
					{showMesFactures && (
						<div className="space-y-1 animate-fadeIn">
							<Link
								href="/dashboard/admin/mes-factures/moyen-de-paiement"
								className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/mes-factures/moyen-de-paiement' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
							>
								Moyen de paiement
							</Link>
							<Link
								href="/dashboard/admin/mes-factures/liste-des-factures"
								className={`block w-full px-3 py-2 text-left text-sm rounded-full transition-all ${pathname === '/dashboard/admin/mes-factures/liste-des-factures' ? 'bg-primary text-primary-foreground' : 'text-zinc-300 hover:bg-white/10'}`}
							>
								Liste des factures
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const CaisseSidebar = ({
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
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
            <CreditCard size={14} />
            Filtres Caisse
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-2">MÃ©thode</label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm mt-2">
                  <SelectValue placeholder="SÃ©lectionner la mÃ©thode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="EspÃ¨ces">EspÃ¨ces</SelectItem>
                  <SelectItem value="Carte">Carte</SelectItem>
                  <SelectItem value="Virement">Virement</SelectItem>
                  <SelectItem value="ChÃ¨que">ChÃ¨que</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm mt-2">
                  <SelectValue placeholder="SÃ©lectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Vente">Vente</SelectItem>
                  <SelectItem value="Remboursement">Remboursement</SelectItem>
                  <SelectItem value="DÃ©pÃ´t">DÃ©pÃ´t</SelectItem>
                  <SelectItem value="Retrait">Retrait</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2">PÃ©riode</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm mt-2">
                  <SelectValue placeholder="SÃ©lectionner la pÃ©riode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
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
	const [caisseMethodFilter, setCaisseMethodFilter] = useState('all');
	const [caisseTypeFilter, setCaisseTypeFilter] = useState('all');
	const [caissePeriod, setCaissePeriod] = useState('all');

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
		} else if (pathname === '/dashboard' || pathname === '/dashboard/rendez-vous') {
			return <RendezVousSidebar />;
		} else if (pathname?.startsWith('/dashboard/clients')) {
			return <ClientsSidebar />;
		} else if (pathname?.startsWith('/dashboard/caisse')) {
			return (
				<CaisseSidebar
					methodFilter={caisseMethodFilter}
					setMethodFilter={setCaisseMethodFilter}
					typeFilter={caisseTypeFilter}
					setTypeFilter={setCaisseTypeFilter}
					selectedPeriod={caissePeriod}
					setSelectedPeriod={setCaissePeriod}
				/>
			);
		}
		return <RendezVousSidebar />;
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
								(item.href === '/dashboard/rendez-vous' && (pathname === '/dashboard' || pathname?.startsWith('/dashboard/rendez-vous'))) ||
								(item.href === '/dashboard/clients/fichier-client/gestion' && pathname?.startsWith('/dashboard/clients')) ||
								(item.href === '/dashboard/caisse' && pathname?.startsWith('/dashboard/caisse')) ||
								(item.href === '/dashboard/admin/param-agenda/gestion-de-prestations' && pathname?.startsWith('/dashboard/admin')) ||
								pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									aria-current={isActive ? 'page' : undefined}
									className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold ${
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
						<button className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all" title="Support">
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
						<button className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all" onClick={() => setShowNotificationSidebar(true)}>
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
								className="p-2.5 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all ml-1"
								title="Se dÃ©connecter"
							>
								<LogOut size={20} strokeWidth={2} />
							</button>
						)}
					</div>
				</div>
			</header>

			{/* Sidebar */}
			<aside className="fixed left-0 top-0 w-66 bg-[#0a0a0a] h-screen flex flex-col border-r border-white/10 z-50">
				<div className="p-6 pb-4">
					<div className="flex items-center justify-center w-full">
						<img src="/logo.png" alt="Reserva" className="h-9 w-auto object-contain brightness-0 invert" />
					</div>
				</div>

				{getSidebarContent()}
			</aside>

			{/* Notification Sidebar (right) */}
	{showNotificationSidebar && (
		<>


			<div ref={notificationSidebarRef} className="fixed top-0 right-0 h-screen w-[480px] bg-white shadow-lg z-50 transition-transform duration-300 animate-slideIn flex flex-col">
				{/* Header - Ultra Minimalist */}
				<div className="px-8 py-8 border-b border-gray-100">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-3xl font-light text-gray-900 tracking-tight">Notifications</h2>
							<p className="text-sm text-gray-400 mt-1 font-light">3 non lues</p>
						</div>
						<button
							onClick={() => setShowNotificationSidebar(false)}
							className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
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
							Toutes
						</button>
						<span className="text-gray-300">/</span>
						<button
							className={`px-4 py-1.5 text-xs font-medium transition-colors ${notificationTab === 'unread' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
							onClick={() => setNotificationTab('unread')}
						>
							Non lues
						</button>
					</div>
				</div>

				{/* Notifications List */}
				<div className="flex-1 overflow-y-auto">
					{/* Today Section */}
					<div className="px-8 py-6">
						<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Aujourd'hui</p>
						{/* Only show unread if tab is 'unread', else show all */}
						{(notificationTab === 'all' || notificationTab === 'unread') && (
							<>
								{notificationTab === 'all' && (
									<>
										{/* Notification Item - Unread */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Nouveau rendez-vous confirmÃ©</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Sarah Martin a confirmÃ© son rendez-vous pour une coupe femme demain Ã  14h30.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 2 minutes</span>
												</div>
											</div>
										</div>
										{/* Notification Item - Unread */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<UserCheck size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Nouvel avis client</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Ahmed Benali a laissÃ© un avis 5 Ã©toiles sur votre prestation de soin visage.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 15 minutes</span>
												</div>
											</div>
										</div>
										{/* Notification Item - Unread */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Rendez-vous annulÃ©</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Leila Tazi a annulÃ© son rendez-vous prÃ©vu pour aujourd'hui Ã  16h00.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 1 heure</span>
												</div>
											</div>
										</div>
										{/* Read Notification */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-60 hover:opacity-100">
											<div className="flex gap-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<CreditCard size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Paiement reÃ§u</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Paiement de 450 DH reÃ§u pour la prestation de Fatima Zahra.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 3 heures</span>
												</div>
											</div>
										</div>
									</>
								)}
								{notificationTab === 'unread' && (
									<>
										{/* Only show unread notifications (those with blue dot) */}
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Nouveau rendez-vous confirmÃ©</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Sarah Martin a confirmÃ© son rendez-vous pour une coupe femme demain Ã  14h30.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 2 minutes</span>
												</div>
											</div>
										</div>
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<UserCheck size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Nouvel avis client</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Ahmed Benali a laissÃ© un avis 5 Ã©toiles sur votre prestation de soin visage.</p>
													<span className="text-xs text-gray-400 font-light">Il y a 15 minutes</span>
												</div>
											</div>
										</div>
										<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
											<div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
											<div className="flex gap-4 pr-4">
												<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
													<Calendar size={16} className="text-gray-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 mb-1">Rendez-vous annulÃ©</p>
													<p className="text-xs text-gray-500 leading-relaxed mb-2">Leila Tazi a annulÃ© son rendez-vous prÃ©vu pour aujourd'hui Ã  16h00.</p>
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

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<TrendingUp size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Rapport mensuel disponible</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">Votre rapport statistique du mois de novembre est maintenant disponible.</p>
										<span className="text-xs text-gray-400 font-light">Hier Ã  18:30</span>
									</div>
								</div>
							</div>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<Users size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Nouveau client enregistrÃ©</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">Karim Alami s'est inscrit via votre plateforme de rÃ©servation en ligne.</p>
										<span className="text-xs text-gray-400 font-light">Hier Ã  14:15</span>
									</div>
								</div>
							</div>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<Bell size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Rappel de rendez-vous</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">5 rendez-vous prÃ©vus pour demain nÃ©cessitent une confirmation.</p>
										<span className="text-xs text-gray-400 font-light">Hier Ã  09:00</span>
									</div>
								</div>
							</div>
						</div>
					)}
					{/* This Week Section */}
					{notificationTab === 'all' && (
						<div className="px-8 py-6 border-t border-gray-100">
							<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Cette semaine</p>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<FileText size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Nouvelle facture gÃ©nÃ©rÃ©e</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">Facture #2024-156 d'un montant de 1,250 DH gÃ©nÃ©rÃ©e automatiquement.</p>
										<span className="text-xs text-gray-400 font-light">Il y a 3 jours</span>
									</div>
								</div>
							</div>

							<div className="group relative bg-white border border-gray-100 rounded-lg p-4 mb-2 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer opacity-60 hover:opacity-100">
								<div className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
										<Building size={16} className="text-gray-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 mb-1">Mise Ã  jour systÃ¨me</p>
										<p className="text-xs text-gray-500 leading-relaxed mb-2">Nouvelles fonctionnalitÃ©s disponibles dans la section Admin.</p>
										<span className="text-xs text-gray-400 font-light">Il y a 5 jours</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer Actions */}
				<div className="border-t border-gray-100 p-6">
					<button className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
						Marquer tout comme lu
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
