import React, { useState, useMemo, useEffect } from 'react';
import { RING_SIZE_CHART } from '../constants';
import RingVisualizer from './RingVisualizer';
import RingSizeChart from './RingSizeChart';

const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22.42l-9.9-9.9c-1.35-1.35-1.35-3.54 0-4.89l4.89-4.89c1.35-1.35 3.54-1.35 4.89 0l.11.11.11-.11c1.35-1.35 3.54-1.35 4.89 0l4.89 4.89c1.35 1.35 1.35 3.54 0 4.89L12 22.42zm0-18.36L4.24 11.8l7.76 7.76 7.76-7.76-7.76-7.76z" opacity=".4"/>
    <path d="M12.01 2.5L7.06 7.45l4.95 4.95 4.95-4.95-4.95-4.95z"/>
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const RingSizeConverter: React.FC = () => {
  const [diameterStr, setDiameterStr] = useState<string>('18.7');
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  useEffect(() => {
    // Reset copied state if diameter changes
    setIsCopied(false);
  }, [diameterStr]);
  
  const handleCopy = async () => {
    if (calculatedSize === null || !navigator.clipboard) return;
    try {
        await navigator.clipboard.writeText(calculatedSize.toString());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };
  
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
          <div className="flex items-center justify-center gap-3">
            <p
              key={calculatedSize}
              className={`text-6xl font-bold text-white transition-colors duration-300 ${
                isValid ? 'animate-pop-in' : ''
              }`}
            >
              {isValid ? calculatedSize : '--'}
            </p>
            {isValid && (
              <button
                onClick={handleCopy}
                aria-label="Copiar tamanho do aro"
                className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                {isCopied ? (
                  <CheckIcon className="w-6 h-6 text-green-400" />
                ) : (
                  <CopyIcon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
          <div className="h-4 mt-1"> {/* Placeholder to prevent layout shift */}
              {isCopied && (
                <p className="text-xs text-green-400 animate-slide-fade-in">
                  Copiado!
                </p>
              )}
          </div>
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