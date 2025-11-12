import React, { useState, useMemo } from 'react';
import { RING_SIZE_CHART } from '../constants';
import RingVisualizer from './RingVisualizer';
import RingSizeChart from './RingSizeChart';

const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22.42l-9.9-9.9c-1.35-1.35-1.35-3.54 0-4.89l4.89-4.89c1.35-1.35 3.54-1.35 4.89 0l.11.11.11-.11c1.35-1.35 3.54-1.35 4.89 0l4.89 4.89c1.35 1.35 1.35 3.54 0 4.89L12 22.42zm0-18.36L4.24 11.8l7.76 7.76 7.76-7.76-7.76-7.76z" opacity=".4"/>
    <path d="M12.01 2.5L7.06 7.45l4.95 4.95 4.95-4.95-4.95-4.95z"/>
  </svg>
);


const RingSizeConverter: React.FC = () => {
  const [diameterStr, setDiameterStr] = useState<string>('18.7');
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and a single decimal separator (dot or comma)
    if (value === '' || /^\d*[,.]?\d*$/.test(value)) {
      setDiameterStr(value);
    }
  };
  
  const handleClear = () => {
    setDiameterStr('');
  };

  const { calculatedSize, isValid } = useMemo(() => {
    // Standardize decimal separator to a dot for parsing
    const normalizedDiameterStr = diameterStr.replace(',', '.');
    const diameter = parseFloat(normalizedDiameterStr);

    if (isNaN(diameter) || diameter <= 0) {
      return { calculatedSize: null, isValid: false };
    }

    let closestSize = null;
    let minDifference = Infinity;

    for (const entry of RING_SIZE_CHART) {
      const difference = Math.abs(entry.diameter - diameter);
      if (difference < minDifference) {
        minDifference = difference;
        closestSize = entry.size;
      }
    }

    return { calculatedSize: closestSize, isValid: true };
  }, [diameterStr]);
  
  const diameterValue = parseFloat(diameterStr.replace(',', '.')) || 0;
  
  const toggleChartVisibility = () => {
    setIsChartVisible(prev => !prev);
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 overflow-hidden ring-1 ring-white/20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <DiamondIcon className="w-8 h-8 text-amber-300"/>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Conversor de Aro
          </h1>
        </div>
        
        <p className="text-gray-400 mb-6 text-sm">
          Insira o diâmetro interno em milímetros (mm) para encontrar o tamanho de aro correspondente.
        </p>

        <div className="mb-6">
          <label htmlFor="diameter" className="block text-sm font-medium text-gray-300 mb-2">
            Diâmetro Interno (mm)
          </label>
          <div className="relative">
            <input
              type="text"
              id="diameter"
              inputMode="decimal"
              value={diameterStr}
              onChange={handleInputChange}
              placeholder="Ex: 16.5"
              className="w-full bg-gray-900/50 text-white placeholder-gray-500 border border-gray-600 rounded-lg py-3 px-4 pr-20 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
            />
            {diameterStr.length > 0 && (
              <button
                onClick={handleClear}
                aria-label="Limpar diâmetro"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-sm font-medium text-gray-400 hover:text-amber-300 transition-colors duration-200"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        
        <div className="text-center bg-gray-900/60 rounded-xl p-6 transition-all duration-300">
          <p className="text-sm font-medium text-amber-300 uppercase tracking-widest mb-2">
            Tamanho do Aro (BR)
          </p>
          <p
            key={calculatedSize}
            className={`text-6xl font-bold text-white transition-colors duration-300 ${
              isValid ? 'animate-pop-in' : ''
            }`}
          >
            {isValid ? calculatedSize : '--'}
          </p>
        </div>
      </div>
      
      <div className="bg-black/20 px-8 py-6">
          <RingVisualizer diameter={diameterValue} />
      </div>

      <div className="p-6 border-t border-white/10">
        <button
          onClick={toggleChartVisibility}
          className="w-full bg-amber-400/20 text-amber-300 font-semibold py-3 px-4 rounded-lg hover:bg-amber-400/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 transition-all duration-300 ring-1 ring-amber-400/30"
          aria-expanded={isChartVisible}
        >
          {isChartVisible ? 'Ocultar Tabela' : 'Ver Tabela de Medidas'}
        </button>

        {isChartVisible && <RingSizeChart />}
      </div>
    </div>
  );
};

export default RingSizeConverter;