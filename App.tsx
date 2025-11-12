import React from 'react';
import RingSizeConverter from './components/RingSizeConverter';

const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <RingSizeConverter />
        <footer className="mt-8 text-center text-xs text-gray-500">
            <p>
            Desenvolvido para joalheiros.
            </p>
            <p>&copy; {new Date().getFullYear()} Conversor de Medidas. Todos os direitos reservados.</p>
        </footer>
    </main>
  );
};

export default App;
