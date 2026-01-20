import React from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut 
} from 'react-feather';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem = 'employees' }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'files', icon: FileText, label: 'Files' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Navigation Items */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <div
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {isActive && <div className={styles.activeIndicator} />}
              <button
                className={styles.navButton}
                title={item.label}
              >
                <Icon size={24} />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button className={styles.logoutButton} title="Logout">
        <LogOut size={24} />
      </button>
    </div>
  );
}
