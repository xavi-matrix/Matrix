import React from 'react';
import { RING_SIZE_CHART } from '../constants';

const RingSizeChart: React.FC = () => {
  return (
    <div className="mt-4 animate-slide-fade-in">
      <div className="rounded-lg ring-1 ring-white/20 overflow-hidden">
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-slate-800/80 backdrop-blur-sm z-10">
              <tr>
                <th className="p-3 font-semibold text-amber-300 text-center">Aro (BR)</th>
                <th className="p-3 font-semibold text-amber-300 text-center">Diâmetro (mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {RING_SIZE_CHART.map(({ size, diameter }) => (
                <tr key={size} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium text-center">{size}</td>
                  <td className="p-3 text-gray-300 text-center">{diameter.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RingSizeChart;