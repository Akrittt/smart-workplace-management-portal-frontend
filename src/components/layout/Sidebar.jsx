import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageSquare, X,  Shield, Users, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['EMPLOYEE', 'MANAGER','ADMIN'] },
    { name: 'My Leaves', path: '/leaves', icon: Calendar, roles: ['EMPLOYEE', 'MANAGER'] },
    { name: 'My Complaints', path: '/complaints', icon: MessageSquare, roles: ['EMPLOYEE', 'MANAGER'] },
    { name: 'All Leaves', path: '/leaves/all', icon: Calendar, roles: ['MANAGER', 'ADMIN'] },
    { name: 'All Complaints', path: '/complaints/all', icon: MessageSquare, roles: ['MANAGER', 'ADMIN'] },
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: Shield, roles: ['ADMIN'] },
    { name: 'User Management', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp, roles: ['ADMIN'] },
    { name: 'Settings', path: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-58 `}
      >
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-xl font-bold text-primary-600">Menu</h2>
          <button onClick={closeSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
