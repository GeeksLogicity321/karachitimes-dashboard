// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('dashboard-layout-svgrepo-com'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('user-circle-svgrepo-com'),
  },
  {
    title: 'Category',
    path: '/dashboard/category',
    icon: icon('post-svgrepo-com'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('content-email-inbox-mail-message-icon-svgrepo-com'),
  },
  // {
  //   title: 'subscription',
  //   path: '/dashboard/subscription',
  //   icon: icon('collection-email-svgrepo-com'),
  // },
  {
    title: 'Query',
    path: '/dashboard/query',
    icon: icon('notification-bell-1397-svgrepo-com'),
  },
 
  // {
  //   title: 'logout',
  //   path: '/login',
  //   icon: icon('logout-svgrepo-com'),
  // },
  
];

export default navConfig;
