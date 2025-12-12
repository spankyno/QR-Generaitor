import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm text-center md:text-left">
          Aitor Sánchez Gutiérrez &copy; 2026 - Reservados todos los derechos
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Privacidad</a>
          <a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Términos</a>
          <a href="https://github.com/aitorsanchez" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};