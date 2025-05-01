
    import React, { useState } from 'react';
    import { Outlet, Link, useLocation } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { cn } from "@/lib/utils";
    import { Button } from "@/components/ui/button";
    import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
    import { LayoutDashboard, Users, UserCheck, ClipboardList, Utensils, Bus, ThumbsUp, CalendarOff, LogOut, Phone, Stethoscope, Building, Menu, X, Bell, Settings, AlarmClock as CalendarClock } from 'lucide-react';

    const sidebarVariants = {
      open: { width: 250, transition: { type: "spring", stiffness: 300, damping: 30 } },
      closed: { width: 60, transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    const navItemVariants = {
      open: { opacity: 1, x: 0, transition: { delay: 0.1 } },
      closed: { opacity: 0, x: -10 }
    };

    const iconVariants = {
       hover: { scale: 1.2, rotate: 5 },
       tap: { scale: 0.9 }
    };

    const navItems = [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/staff", icon: Users, label: "Staff Management" },
      { path: "/students", icon: UserCheck, label: "Student Management" },
      { path: "/complaints", icon: ClipboardList, label: "Complaints" },
      { path: "/meetings", icon: CalendarClock, label: "Meetings" },
      { path: "/attendance", icon: CalendarOff, label: "Attendance" },
      { path: "/mess", icon: Utensils, label: "Mess Management" },
      { path: "/food-feedback", icon: ThumbsUp, label: "Food Feedback" },
      { path: "/leaves", icon: CalendarOff, label: "Leaves" },
      { path: "/outing-permissions", icon: LogOut, label: "Outing Permissions" },
      { path: "/reception-log", icon: Phone, label: "Reception Log" },
      { path: "/health-log", icon: Stethoscope, label: "Health Log" },
      { path: "/infrastructure", icon: Building, label: "Infrastructure" },
      { path: "/transport", icon: Bus, label: "Transport Tracking" },
    ];

    const Sidebar = ({ isOpen, toggleSidebar }) => {
      const location = useLocation();

      return (
        <motion.div
          variants={sidebarVariants}
          initial={false}
          animate={isOpen ? "open" : "closed"}
          className={cn(
            "hidden md:flex flex-col h-screen bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-lg overflow-hidden",
            isOpen ? "p-4" : "p-2 items-center"
          )}
        >
          <div className={cn("flex items-center mb-8", isOpen ? "justify-between" : "justify-center")}>
             {isOpen && <h1 className="text-2xl font-bold">Hostel HQ</h1>}
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-primary-foreground hover:bg-primary/80">
               {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </Button>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  className={cn(
                    "flex items-center p-2 rounded-md cursor-pointer transition-colors",
                    location.pathname === item.path
                      ? "bg-primary-foreground/20 text-white font-semibold"
                      : "hover:bg-primary-foreground/10 text-primary-foreground/80",
                    !isOpen && "justify-center"
                  )}
                >
                  <motion.div variants={iconVariants}>
                     <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
                  </motion.div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        variants={navItemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>
          {isOpen && (
             <div className="mt-auto border-t border-primary-foreground/20 pt-4">
                <Button variant="ghost" className="w-full justify-start text-primary-foreground/80 hover:bg-primary-foreground/10">
                   <Settings className="mr-3 h-5 w-5" /> Settings
                </Button>
             </div>
          )}
        </motion.div>
      );
    };

    const MobileSidebar = ({ navItems }) => {
      const location = useLocation();
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground border-none">
            <h2 className="text-2xl font-bold mb-6">Hostel HQ</h2>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div
                    className={cn(
                      "flex items-center p-2 rounded-md cursor-pointer transition-colors",
                      location.pathname === item.path
                        ? "bg-primary-foreground/20 text-white font-semibold"
                        : "hover:bg-primary-foreground/10 text-primary-foreground/80"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
             <div className="mt-auto border-t border-primary-foreground/20 pt-4 absolute bottom-4 left-4 right-4">
                <Button variant="ghost" className="w-full justify-start text-primary-foreground/80 hover:bg-primary-foreground/10">
                   <Settings className="mr-3 h-5 w-5" /> Settings
                </Button>
             </div>
          </SheetContent>
        </Sheet>
      );
    };

    const Header = ({ toggleSidebar }) => {
      return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 shadow-sm">
          <div className="flex items-center">
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:inline-flex mr-2 text-foreground">
               <Menu className="h-5 w-5" />
             </Button>
             <MobileSidebar navItems={navItems} />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>
      );
    };


    const Layout = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);

      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

      return (
        <div className="flex min-h-screen">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-1">
            <Header toggleSidebar={toggleSidebar} />
            <main className="flex-1 p-4 md:p-6 bg-muted/40 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      );
    };

    export default Layout;
  