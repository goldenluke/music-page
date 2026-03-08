import { Link } from 'react-router-dom';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';

export default function BottomNav({ unreadCount, setAuthMode, user }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 z-[100] px-6 py-3 flex justify-between items-center text-slate-500">
      <Link to="/" className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
        <Home size={20} />
      </Link>
      
      <button className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
        <Search size={20} />
      </button>

      <button className="flex flex-col items-center gap-1 text-white bg-blue-600 p-3 rounded-2xl -mt-8 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
        <PlusCircle size={24} />
      </button>

      <div className="relative">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></span>}
      </div>

      {user ? (
        <Link to={`/profile/${user.username}`}>
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white italic">
            {user.username[0].toUpperCase()}
          </div>
        </Link>
      ) : (
        <button onClick={() => setAuthMode('login')}>
          <User size={20} />
        </button>
      )}
    </nav>
  );
}
