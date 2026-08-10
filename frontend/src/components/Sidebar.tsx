import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Globe, Image, FileText } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Analysis', path: '/analyze', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-[#F6F5F2] border-r border-[#DCDDD9] flex-shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-3.5rem)]">
      <div className="p-4 space-y-6">
        <div className="px-2 py-1">
          <h2 className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider">
            Workspace
          </h2>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                        : 'text-[#666A73] hover:text-[#111318] hover:bg-[#EBEAE5]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#666A73]" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="px-2 py-1">
          <h2 className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider">
            Analysis Engines
          </h2>
          <div className="mt-2.5 space-y-1.5 text-xs text-[#666A73]">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white border border-[#DCDDD9] text-[#111318] text-[11px]">
              <Globe className="w-3.5 h-3.5 text-[#1677FF]" />
              Website Crawling
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white border border-[#DCDDD9] text-[#111318] text-[11px]">
              <Image className="w-3.5 h-3.5 text-[#111318]" />
              Image LAB Clustering
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white border border-[#DCDDD9] text-[#111318] text-[11px]">
              <FileText className="w-3.5 h-3.5 text-[#111318]" />
              PDF Visual Extraction
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-[#DCDDD9]">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white border border-[#DCDDD9] shadow-2xs">
          <div className="w-7 h-7 rounded bg-[#111318] text-white flex items-center justify-center font-mono font-bold text-[10px]">
            PL
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-[#111318] truncate">PaletteLens Engine</p>
            <p className="text-[10px] text-[#666A73] truncate">Status: Studio Ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
