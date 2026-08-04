import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import {
  Search,
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  Calendar,
  LineChart,
  Settings,
  User,
  ChevronDown,
  Building,
  Book,
  UserCircle,
  UserPlus,
  Key,
  MonitorPlay,
  Activity,
  FileEdit,
  FileSpreadsheet,
  Palmtree,
  PieChart,
  ShieldAlert,
  Wrench,
  MoreHorizontal,
  View,
  BarChart3,
  FileText,
  Star,
  BarChart2,
  TrendingUp,
  Moon,
  Sun,
  Fingerprint,
  Clock,
  CalendarDays
} from "lucide-react";

/** ======================= Local SVG paths (inline) ======================= */
const svgPaths = {
  p36880f80:
    "M0.32 0C0.20799 0 0.151984 0 0.109202 0.0217987C0.0715695 0.0409734 0.0409734 0.0715695 0.0217987 0.109202C0 0.151984 0 0.20799 0 0.32V6.68C0 6.79201 0 6.84801 0.0217987 6.8908C0.0409734 6.92843 0.0715695 6.95902 0.109202 6.9782C0.151984 7 0.207989 7 0.32 7L3.68 7C3.79201 7 3.84802 7 3.8908 6.9782C3.92843 6.95903 3.95903 6.92843 3.9782 6.8908C4 6.84801 4 6.79201 4 6.68V4.32C4 4.20799 4 4.15198 4.0218 4.1092C4.04097 4.07157 4.07157 4.04097 4.1092 4.0218C4.15198 4 4.20799 4 4.32 4L19.68 4C19.792 4 19.848 4 19.8908 4.0218C19.9284 4.04097 19.959 4.07157 19.9782 4.1092C20 4.15198 20 4.20799 20 4.32V6.68C20 6.79201 20 6.84802 20.0218 6.8908C20.041 6.92843 20.0716 6.95903 20.1092 6.9782C20.152 7 20.208 7 20.32 7L23.68 7C23.792 7 23.848 7 23.8908 6.9782C23.9284 6.95903 23.959 6.92843 23.9782 6.8908C24 6.84802 24 6.79201 24 6.68V0.32C24 0.20799 24 0.151984 23.9782 0.109202C23.959 0.0715695 23.9284 0.0409734 23.8908 0.0217987C23.848 0 23.792 0 23.68 0H0.32Z",
  p355df480:
    "M0.32 16C0.20799 16 0.151984 16 0.109202 15.9782C0.0715695 15.959 0.0409734 15.9284 0.0217987 15.8908C0 15.848 0 15.792 0 15.68V9.32C0 9.20799 0 9.15198 0.0217987 9.1092C0.0409734 9.07157 0.0715695 9.04097 0.109202 9.0218C0.151984 9 0.207989 9 0.32 9H3.68C3.79201 9 3.84802 9 3.8908 9.0218C3.92843 9.04097 3.95903 9.07157 3.9782 9.1092C4 9.15198 4 9.20799 4 9.32V11.68C4 11.792 4 11.848 4.0218 11.8908C4.04097 11.9284 4.07157 11.959 4.1092 11.9782C4.15198 12 4.20799 12 4.32 12L19.68 12C19.792 12 19.848 12 19.8908 11.9782C19.9284 11.959 19.959 11.9284 19.9782 11.8908C20 11.848 20 11.792 20 11.68V9.32C20 9.20799 20 9.15199 20.0218 9.1092C20.041 9.07157 20.0716 9.04098 20.1092 9.0218C20.152 9 20.208 9 20.32 9H23.68C23.792 9 23.848 9 23.8908 9.0218C23.9284 9.04098 23.959 9.07157 23.9782 9.1092C24 9.15199 24 9.20799 24 9.32V15.68C24 15.792 24 15.848 23.9782 15.8908C23.959 15.9284 23.9284 15.959 23.8908 15.9782C23.848 16 23.792 16 23.68 16H0.32Z",
  pfa0d600:
    "M6.32 10C6.20799 10 6.15198 10 6.1092 9.9782C6.07157 9.95903 6.04097 9.92843 6.0218 9.8908C6 9.84802 6 9.79201 6 9.68V6.32C6 6.20799 6 6.15198 6.0218 6.1092C6.04097 6.07157 6.07157 6.04097 6.1092 6.0218C6.15198 6 6.20799 6 6.32 6L17.68 6C17.792 6 17.848 6 17.8908 6.0218C17.9284 6.04097 17.959 6.07157 17.9782 6.1092C18 6.15198 18 6.20799 18 6.32V9.68C18 9.79201 18 9.84802 17.9782 9.8908C17.959 9.92843 17.9284 9.95903 17.8908 9.9782C17.848 10 17.792 10 17.68 10H6.32Z",
};
/** ======================================================================= */

// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ----------------------------- Brand / Logos ----------------------------- */

function InterfacesLogoSquare() {
  return (
    <div className="aspect-[24/24] grow min-h-px min-w-px overflow-clip relative shrink-0">
      <div className="absolute aspect-[24/16] left-0 right-0 top-1/2 -translate-y-1/2">
        <svg className="block size-full" fill="none" viewBox="0 0 24 16">
          <g>
            <path d={svgPaths.p36880f80} fill="#10B981" />
            <path d={svgPaths.p355df480} fill="#10B981" />
            <path d={svgPaths.pfa0d600} fill="#10B981" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function BrandBadge() {
  return (
    <div className="relative shrink-0 w-full mb-4">
      <div className="flex items-center p-1 w-full">
        <div className="h-10 w-8 flex items-center justify-center pl-2">
          <Fingerprint className="size-6 text-emerald-500" />
        </div>
        <div className="px-2 py-1">
          <div className="font-bold text-[18px] tracking-tight text-white">
            VeriSync
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarCircle({ initials }: { initials: string }) {
  return (
    <div className="relative rounded-full shrink-0 size-8 bg-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
      {initials}
    </div>
  );
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 mb-4 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`bg-background/20 border border-border/50 h-10 relative rounded-xl flex items-center transition-all duration-500 ${
          isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all duration-500 ${
            isCollapsed ? "p-1" : "px-2"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="size-8 flex items-center justify-center">
            <Search size={16} className="text-muted-foreground" />
          </div>
        </div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="flex flex-col justify-center size-full">
            <div className="flex flex-col gap-2 items-start justify-center pr-2 py-1 w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[14px] text-foreground placeholder:text-muted-foreground"
                tabIndex={isCollapsed ? -1 : 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Types / Content Map -------------------------- */

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  badge?: string;
  hasDropdown?: boolean;
  children?: MenuItemT[];
}
interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}
interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

function getSidebarContent(activeSection: string): SidebarContent {
  const contentMap: Record<string, SidebarContent> = {
    overview: {
      title: "Dashboard",
      sections: [
        {
          title: "Main Views",
          items: [
            { icon: <View size={16} />, label: "Overview", href: "/admin" },
          ],
        },
        {
          title: "Academic Operations",
          items: [
            {
              icon: <LayoutDashboard size={16} />,
              label: "Live Operations",
              hasDropdown: true,
              children: [
                { label: "Live Class Monitoring", href: "/admin/attendance-monitor" },
                { label: "Proxy Detection Logs", href: "/admin/security" },
                { label: "Active Courses", href: "/admin/courses" },
              ],
            },
            {
              icon: <PieChart size={16} />,
              label: "Student Analytics",
              hasDropdown: true,
              children: [
                { label: "Defaulter Watchlist", href: "/admin/reports" },
                { label: "Correction Requests", href: "/admin/corrections" },
                { label: "Biometric Audits", href: "/admin/reports" },
              ],
            },
            {
              icon: <BarChart3 size={16} />,
              label: "Faculty Health",
              hasDropdown: true,
              children: [
                { label: "Teacher Availability", href: "/admin/teachers" },
                { label: "Course Assignments", href: "/admin/assignments" },
              ],
            },
          ],
        },
      ],
    },
    academic: {
      title: "Academic Setup",
      sections: [
        {
          title: "Configuration",
          items: [
            { icon: <Building size={16} />, label: "College & Session", href: "/admin/college" },
            { icon: <Book size={16} />, label: "Subjects", href: "/admin/subjects" },
          ],
        },
      ],
    },
    people: {
      title: "People",
      sections: [
        {
          title: "Directory",
          items: [
            { icon: <UserCircle size={16} />, label: "Teachers", href: "/admin/teachers" },
            { icon: <Users size={16} />, label: "Students", href: "/admin/students" },
          ],
        },
      ],
    },
    courses: {
      title: "Course Control",
      sections: [
        {
          title: "Management",
          items: [
            { icon: <UserPlus size={16} />, label: "Teacher Assignments", href: "/admin/assignments" },
            { icon: <Key size={16} />, label: "Course Authorisations", href: "/admin/authorizations" },
            { icon: <MonitorPlay size={16} />, label: "Active Courses", href: "/admin/courses" },
          ],
        },
      ],
    },
    attendance: {
      title: "Attendance",
      sections: [
        {
          title: "Operations",
          items: [
            { icon: <Activity size={16} />, label: "Attendance Monitor", href: "/admin/attendance-monitor" },
            { icon: <FileEdit size={16} />, label: "Correction Requests", href: "/admin/corrections", badge: "1" },
            { icon: <FileSpreadsheet size={16} />, label: "Attendance Sheets", href: "/admin/sheets" },
          ],
        },
      ],
    },
    calendar: {
      title: "Calendar",
      sections: [
        {
          title: "Schedules",
          items: [
            { icon: <Palmtree size={16} />, label: "Holidays & Breaks", href: "/admin/holidays" },
            { icon: <CalendarDays size={16} />, label: "Academic Calendar", href: "/admin/academic-calendar" },
            { icon: <Clock size={16} />, label: "Daily Time Table", href: "/admin/time-table" },
          ],
        },
      ],
    },
    insights: {
      title: "Insights",
      sections: [
        {
          title: "Analytics",
          items: [
            { icon: <PieChart size={16} />, label: "Reports & Analytics", href: "/admin/reports" },
          ],
        },
      ],
    },
    system: {
      title: "System",
      sections: [
        {
          title: "Settings",
          items: [
            { icon: <ShieldAlert size={16} />, label: "Security & Audit", href: "/admin/security" },
            { icon: <Wrench size={16} />, label: "System Settings", href: "/admin/settings" },
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.overview;
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */

function IconNavButton({
  children,
  isActive = false,
  onClick,
  title,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`flex items-center justify-center rounded-xl size-12 min-w-12 transition-all duration-300
        ${isActive ? "bg-emerald-500/10 text-emerald-500 shadow-sm border border-emerald-500/20" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"}`}
      style={{ transitionTimingFunction: softSpringEasing }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const theme = useAppStore(state => state.theme);
  
  const navItems = [
    { id: "overview", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { id: "academic", icon: <GraduationCap size={20} />, label: "Academic Setup" },
    { id: "people", icon: <Users size={20} />, label: "People" },
    { id: "courses", icon: <BookOpen size={20} />, label: "Course Control" },
    { id: "attendance", icon: <ClipboardCheck size={20} />, label: "Attendance" },
    { id: "calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { id: "insights", icon: <LineChart size={20} />, label: "Insights" },
  ];

  return (
    <aside className="bg-card/50 backdrop-blur-md flex flex-col gap-2 items-center py-4 w-20 h-screen border-r border-border z-20">
      {/* Logo */}
      <div className="mb-6 size-12 flex items-center justify-center bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
        <Fingerprint className="size-6 text-white" />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-3 w-full items-center">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            title={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-3 w-full items-center mb-2">
        <IconNavButton 
          title="Toggle Theme"
          onClick={() => useAppStore.getState().toggleTheme()}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </IconNavButton>
        <IconNavButton 
          title="System"
          isActive={activeSection === "system"} 
          onClick={() => onSectionChange("system")}
        >
          <Settings size={20} />
        </IconNavButton>
      </div>
    </aside>
  );
}

/* ------------------------------ Right Sidebar ----------------------------- */

function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}) {
  if (isCollapsed) {
    return (
      <div className="w-full flex justify-center transition-all duration-500 mb-4" style={{ transitionTimingFunction: softSpringEasing }}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center rounded-xl size-10 min-w-10 transition-all duration-500 hover:bg-muted text-muted-foreground hover:text-foreground"
          style={{ transitionTimingFunction: softSpringEasing }}
          aria-label="Expand sidebar"
        >
          <span className="inline-block rotate-180">
            <ChevronDown size={18} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden transition-all duration-500 mb-4" style={{ transitionTimingFunction: softSpringEasing }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center h-10">
          <div className="px-2 py-1">
            <div className="font-bold text-[20px] text-foreground tracking-tight">
              {title}
            </div>
          </div>
        </div>
        <div className="pr-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center justify-center rounded-xl size-10 min-w-10 transition-all duration-500 hover:bg-muted text-muted-foreground hover:text-foreground"
            style={{ transitionTimingFunction: softSpringEasing }}
            aria-label="Collapse sidebar"
          >
            <ChevronDown size={18} className="-rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailSidebar({ activeSection }: { activeSection: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const content = getSidebarContent(activeSection);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore(state => state.user);

  const toggleCollapse = () => setIsCollapsed((s) => !s);
  
  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';
  };

  return (
    <aside
      className={`bg-card/30 backdrop-blur-md flex flex-col items-start p-4 border-r border-border transition-all duration-500 h-screen overflow-hidden ${
        isCollapsed ? "w-20 min-w-[80px] !px-2 justify-start items-center" : "w-72"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      {!isCollapsed && <BrandBadge />}

      <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
      <SearchContainer isCollapsed={isCollapsed} />

      <div
        className={`flex flex-col w-full overflow-y-auto flex-1 transition-all duration-500 no-scrollbar ${
          isCollapsed ? "gap-2 items-center" : "gap-6 items-start"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed={isCollapsed}
            currentPath={location.pathname}
            onNavigate={(href) => navigate(href)}
          />
        ))}
      </div>


    </aside>
  );
}

/* ------------------------------ Menu Elements ---------------------------- */

function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
  isCollapsed,
  isActive,
}: {
  item: MenuItemT;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
  isActive?: boolean;
}) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) onToggle();
    else onItemClick?.();
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 mb-1 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`rounded-xl cursor-pointer transition-all duration-300 flex items-center relative ${
          isActive && !item.hasDropdown
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${isCollapsed ? "w-12 min-w-[48px] h-12 justify-center p-2" : "w-full h-11 px-3"}`}
        style={{ transitionTimingFunction: softSpringEasing }}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center justify-center shrink-0">
          {item.icon}
        </div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="text-[14px] font-medium leading-[20px] truncate">
            {item.label}
          </div>
        </div>

        {item.badge && !isCollapsed && (
          <div className={`ml-2 shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-orange-500 text-white shadow-sm'}`}>
            {item.badge}
          </div>
        )}

        {item.hasDropdown && (
          <div
            className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"
            }`}
            style={{ transitionTimingFunction: softSpringEasing }}
          >
            <ChevronDown
              size={16}
              className="text-muted-foreground transition-transform duration-500"
              style={{
                transitionTimingFunction: softSpringEasing,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div className="w-full pl-8 pr-1 py-[1px]">
      <div
        className="h-10 w-full rounded-lg cursor-pointer transition-colors hover:bg-muted flex items-center px-3 py-1"
        onClick={onItemClick}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-muted-foreground hover:text-foreground leading-[18px] truncate">
            {item.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
  currentPath,
  onNavigate,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
  currentPath: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0 mb-0" : "h-8 opacity-100 mb-1"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex items-center h-8 px-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 w-full">
        {section.items.map((item, index) => {
          const itemKey = `${section.title}-${index}`;
          const isActive = item.href ? currentPath.startsWith(item.href) : false;
          const isExpanded = expandedItems.has(itemKey);
          
          return (
            <div key={itemKey} className="w-full flex flex-col">
              <MenuItem
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                onToggle={() => onToggleExpanded(itemKey)}
                onItemClick={() => {
                  if (item.href) onNavigate(item.href);
                }}
                isCollapsed={isCollapsed}
              />
              {isExpanded && item.children && !isCollapsed && (
                <div className="flex flex-col gap-1 mb-2">
                  {item.children.map((child, childIndex) => (
                    <SubMenuItem
                      key={`${itemKey}-${childIndex}`}
                      item={child}
                      onItemClick={() => {
                        if (child.href) onNavigate(child.href);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- Layout -------------------------------- */

export function TwoLevelSidebar() {
  const location = useLocation();
  
  const getInitialSection = () => {
    const path = location.pathname;
    if (path.includes('/admin/college') || path.includes('/admin/subjects')) return 'academic';
    if (path.includes('/admin/teachers') || path.includes('/admin/students')) return 'people';
    if (path.includes('/admin/assignments') || path.includes('/admin/authorizations') || path.includes('/admin/courses')) return 'courses';
    if (path.includes('/admin/attendance') || path.includes('/admin/corrections') || path.includes('/admin/sheets')) return 'attendance';
    if (path.includes('/admin/holidays') || path.includes('/admin/academic-calendar') || path.includes('/admin/time-table')) return 'calendar';
    if (path.includes('/admin/reports')) return 'insights';
    if (path.includes('/admin/security') || path.includes('/admin/settings')) return 'system';
    return 'overview';
  };

  const [activeSection, setActiveSection] = useState(getInitialSection());

  // Keep sidebar section in sync with URL changes when navigating via links
  useEffect(() => {
    setActiveSection(getInitialSection());
  }, [location.pathname]);

  return (
    <div className="flex h-screen shrink-0">
      <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <DetailSidebar activeSection={activeSection} />
    </div>
  );
}

export default TwoLevelSidebar;
