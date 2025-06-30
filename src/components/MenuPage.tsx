@@ .. @@
 import { LogOut, Volume2, VolumeX, LayoutDashboard, Briefcase, Users, DollarSign, FileText, Calendar, Wallet, BookOpen, UserCog, MessageSquare, FolderLock, Lock, FlaskRound as Flask, GraduationCap } from 'lucide-react';
 import LogoutDialog from '../components/LogoutDialog';
 import Logo from '../components/Logo';
+import UserAvatar from '../components/UserAvatar';
 import ThemeToggle from '../components/ThemeToggle';
 import MenuBackground from '../components/MenuBackground';
@@ .. @@
       <div className="menu-header">
         <div className="header-content">
           <Logo />
+          <UserAvatar showName size="md" />
           <ThemeToggle 
             isDarkMode={isDarkMode} 
             onToggle={handleThemeToggle}