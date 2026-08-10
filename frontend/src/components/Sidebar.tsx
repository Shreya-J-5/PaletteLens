import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings, Palette, Globe, Image, FileText } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Analysis', path: '/analyze', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </h2>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Analysis Types
          </h2>
          <div className="mt-3 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-slate-50 text-slate-700">
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              Website Crawling
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-slate-50 text-slate-700">
              <Image className="w-3.5 h-3.5 text-indigo-500" />
              Image Downsampling & LAB
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-slate-50 text-slate-700">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              PDF Rendering
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            PL
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 truncate">PaletteLens Engine</p>
            <p className="text-[11px] text-slate-500 truncate">Status: Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
