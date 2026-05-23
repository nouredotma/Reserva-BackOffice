export type NotificationIcon =
  | 'calendar'
  | 'user-check'
  | 'credit-card'
  | 'trending-up'
  | 'users'
  | 'bell'
  | 'file-text'
  | 'building';

export type NotificationSection = 'today' | 'yesterday' | 'this_week';

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  section: NotificationSection;
  icon: NotificationIcon;
}

export const dashboardNotifications: DashboardNotification[] = [
  {
    id: 'n-1',
    title: 'New reservation confirmed',
    message: 'Yasmine Alaoui confirmed a table at Le Jardin tomorrow at 8:30 PM.',
    timeAgo: '2 minutes ago',
    read: false,
    section: 'today',
    icon: 'calendar',
  },
  {
    id: 'n-2',
    title: 'New client review',
    message: 'Ahmed Benali left a 5-star review for your VIP experience.',
    timeAgo: '15 minutes ago',
    read: false,
    section: 'today',
    icon: 'user-check',
  },
  {
    id: 'n-3',
    title: 'Reservation canceled',
    message: 'Leila Tazi canceled her day pass scheduled for today at 4:00 PM.',
    timeAgo: '1 hour ago',
    read: false,
    section: 'today',
    icon: 'calendar',
  },
  {
    id: 'n-4',
    title: 'Payment received',
    message: "450 MAD deposit received for Fatima Zahra's reservation.",
    timeAgo: '3 hours ago',
    read: true,
    section: 'today',
    icon: 'credit-card',
  },
  {
    id: 'n-5',
    title: 'Monthly report available',
    message: 'Your November statistics report is now available.',
    timeAgo: 'Yesterday at 6:30 PM',
    read: true,
    section: 'yesterday',
    icon: 'trending-up',
  },
  {
    id: 'n-6',
    title: 'New client saved',
    message: 'Karim Alami booked an experience through Reserva.',
    timeAgo: 'Yesterday at 2:15 PM',
    read: true,
    section: 'yesterday',
    icon: 'users',
  },
  {
    id: 'n-7',
    title: 'Bookings awaiting confirmation',
    message: '5 reservations need validation before tomorrow.',
    timeAgo: 'Yesterday at 9:00 AM',
    read: true,
    section: 'yesterday',
    icon: 'bell',
  },
  {
    id: 'n-8',
    title: 'New statement available',
    message: 'The Reserva payment statement was generated automatically.',
    timeAgo: '3 days ago',
    read: true,
    section: 'this_week',
    icon: 'file-text',
  },
  {
    id: 'n-9',
    title: 'System update',
    message: 'New options are available in the Admin section.',
    timeAgo: '5 days ago',
    read: true,
    section: 'this_week',
    icon: 'building',
  },
];

export const sectionLabels: Record<NotificationSection, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  this_week: 'This week',
};

export const notificationSections: NotificationSection[] = ['today', 'yesterday', 'this_week'];
