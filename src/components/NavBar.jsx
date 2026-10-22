import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../store/slices/generalSlice';
import { MAIN_ROUTES } from '../constants/routes';
import { ChevronDown, ListFilter } from 'lucide';

export default function NavBar({where}) {
  const dispatch = useDispatch();
  // const isMenuOpen = useSelector((state) => state.general.isMenuOpen);

  return (
    <nav className="flex items-center navbar justify-between px-4 md:px-8 py-6">
      {/* Brand Identity */}
      <Link href={"/"}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-[16px] w-[100px] bp7:w-auto font-semibold tracking-tight">Mission Control</span>
        </div>
      </Link>

      {/* Navigation Links - Visible on screens >= 900px */}
      <div className="hidden bp9:flex items-center gap-6 mr-4">
        {MAIN_ROUTES.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="text-sm font-medium text-white hover:text-white transition-colors"
          >
            <div>
              {item.label}
              <div className={`w-full h-0.5 rounded-full mt-1 ${item.label === where ? 'bg-white' : ''}`}/>
            </div>
          </Link>
        ))}
      </div>

      {/* Utility Icons */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button className="w-10 h-10 rounded-full bg-surface flex opacity-0 items-center justify-center hover:bg-zinc-800 transition-colors">
          <span className="text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon preview-icon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
          </span>
        </button>
        {/* Settings */}
        <button className="w-10 h-10 rounded-full bg-surface flex opacity-0 items-center justify-center hover:bg-zinc-800 transition-colors">
          <span className="text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings preview-icon"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>
          </span>
        </button>
        {/* Menu Icon - Visible only on screens < 900px */}
        <button
          onClick={() => dispatch(toggleMenu())}
          className="bp9:hidden w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-zinc-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            stroke-width="2" strokeLinecap="round" strokeLinejoin="round" 
            className="lucide lucide-list-filter preview-icon"
          >
            <path d="M2 5h20"/>
            <path d="M6 12h12"/>
            <path d="M9 19h6"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
