import { memo } from 'react';
import { MujiIcon } from './ui';

/**
 * ZoomControl component for adjusting timeline density
 * @param {Object} props
 * @param {number} props.pxPerHour - Current pixels per hour value
 * @param {Function} props.onChange - Callback when zoom changes
 * @param {number} props.min - Minimum px per hour (default: 30)
 * @param {number} props.max - Maximum px per hour (default: 100)
 */
const ZoomControl = memo(({ pxPerHour, onChange, min = 30, max = 100 }) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  const handleZoomIn = () => {
    const newValue = Math.min(max, pxPerHour + 10);
    onChange(newValue);
  };

  const handleZoomOut = () => {
    const newValue = Math.max(min, pxPerHour - 10);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-muji-light rounded-[4px]">
      <button
        onClick={handleZoomOut}
        disabled={pxPerHour <= min}
        className="text-muji-mid hover:text-muji-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="축소"
      >
        <MujiIcon name="minus" size={16} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-2 min-w-[120px]">
        <input
          type="range"
          min={min}
          max={max}
          step="5"
          value={pxPerHour}
          onChange={handleChange}
          className="flex-1 h-1 bg-muji-light rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-muji-dark
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-muji-dark
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <span className="text-xs font-light text-muji-mid min-w-[40px] text-right">
          {pxPerHour}px
        </span>
      </div>

      <button
        onClick={handleZoomIn}
        disabled={pxPerHour >= max}
        className="text-muji-mid hover:text-muji-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="확대"
      >
        <MujiIcon name="plus" size={16} strokeWidth={2} />
      </button>
    </div>
  );
});

ZoomControl.displayName = 'ZoomControl';

export default ZoomControl;
