import React from 'react';

/**
 * Measurable Results Component.
 * Maps dynamic performance impact metrics across a horizontal flex container to visualize key engineering impacts.
 * Automatically wraps on mobile to preserve readability.
 *
 * @param {Object} props
 * @param {Array<Object>} props.resultsData - Array of quantifiable achievements.
 * @returns {JSX.Element}
 */
const MeasurableResults = ({ resultsData = [] }) => {
  return (
    <section className="py-20 bg-black text-white w-full overflow-hidden">
      <div className="w-full px-4 md:px-8 mx-auto">
        {/* Header Section */}
        <div className="mb-12">
            <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: 'var(--theme-color-accent)' }}>IMPACT</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mb-8">
                MEASURABLE RESULTS
            </h2>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
            {resultsData.map((result, index) => (
                <div key={index} className="flex-1 bg-[#1A1A1A] relative p-6 lg:p-8 flex flex-col justify-between min-h-[320px] shadow-lg overflow-hidden shrink-1">
                    {/* Top Right Orange Square */}
                    <div className="absolute top-0 right-0 w-12 h-12" style={{ backgroundColor: 'var(--theme-color-accent)' }}></div>
                    
                    {/* Top Content */}
                    <div>
                        <p className="text-gray-500 text-xs font-bold tracking-wider mb-2 uppercase">{result.company}</p>
                        <h3 className="text-lg xl:text-xl font-bold text-gray-100">{result.category}</h3>
                    </div>

                    {/* Middle / Large Stat */}
                    <div className="py-6">
                        <p className="text-5xl xl:text-6xl font-extrabold whitespace-pre-line leading-tight" style={{ color: 'var(--theme-color-accent)' }}>
                            {result.stat && result.stat.includes('→') ? (
                                <>
                                    {result.stat.split('→')[0].trim()}<br />
                                    <span style={{ color: 'var(--theme-color)' }}>→</span> {result.stat.split('→')[1].trim()}
                                </>
                            ) : (
                                result.stat
                            )}
                        </p>
                    </div>

                    {/* Bottom Subtext */}
                    <div>
                        <p className="text-gray-400 text-xs xl:text-sm">{result.subtext}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default MeasurableResults;
