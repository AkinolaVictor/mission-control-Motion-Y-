import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import NavBar from './NavBar';
import HomeNav from './HomeNav';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import { toggleMenu } from '../store/slices/generalSlice';
import { MAIN_ROUTES } from '@/constants/routes';

const DashboardLayout = ({ children, activePill, where }) => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.general.isMenuOpen);
  const conRef = useRef(null)

  useEffect(()=>{
    const ch1 = conRef.current?.querySelector('.homenav')?.getBoundingClientRect()?.height || 36
    const ch2 = conRef.current?.querySelector('.navbar')?.getBoundingClientRect()?.height || 88
    const h = ch1 + ch2
    dispatch({ type: 'general/updateNavHeight', payload: h || 124 });
  }, [dispatch])

  return (
    <div ref={conRef} className="font-sans text-foreground bg-background min-h-screen">
      {/* Top Navigation */}
      <NavBar where={where}/>

      {/* Main Content */}
      {/* <main className="py-4 px-4 space-y-8x max-w-[1260px] mx-auto flex flex-col justify-center items-center gap-4"> */}
      <main className="py-4 px-4 space-y-5.5 max-w-[1260px] mx-auto">
        {/* Quick Action Pills */}
        <HomeNav activePill={activePill} where={where} />
        {children}
      </main>

      {/* Site Menu Modal */}
      <Modal
        isOpen={isMenuOpen}
        onClose={() => dispatch(toggleMenu())}
        title="Main Menu"
      >
        <div className="flex flex-col gap-3 py-2">
          {MAIN_ROUTES.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => dispatch(toggleMenu())}
              className="w-full py-4 px-4 rounded-2xl bg-layer border border-border-subtle text-white font-medium hover:bg-zinc-800 transition-colors flex justify-between items-center"
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
