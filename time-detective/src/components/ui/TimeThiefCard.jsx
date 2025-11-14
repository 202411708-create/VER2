import React from 'react';
import { motion } from 'framer-motion';
import MujiIcon from './MujiIcon';

const TimeThiefCard = ({
  card,
  draggable = false,
  onDragStart,
  onRemove,
  variant = 'default',
  showDescription = true,
}) => {
  const variantStyles = {
    default: 'bg-white border border-[#E6E3DD] shadow-[0_0_3px_rgba(0,0,0,0.08)]',
    placed: 'bg-white border border-[#E6E3DD]',
    dragging: 'bg-white border border-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.12)]',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      draggable={draggable}
      onDragStart={onDragStart}
      className={`
        ${variantStyles[variant]}
        rounded-[4px]
        p-4
        transition-all
        ${draggable ? 'cursor-move hover:border-[#6B6B6B]' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          <h4 className="font-normal text-[#111111] text-sm leading-relaxed">
            {card.title}
          </h4>
          {showDescription && card.description && (
            <p className="text-xs font-light text-[#6B6B6B] leading-relaxed">
              {card.description}
            </p>
          )}
        </div>

        {draggable && (
          <div className="text-[#6B6B6B] opacity-40 font-light text-xs mt-1">
            ⋮⋮
          </div>
        )}

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-[#6B6B6B] hover:text-[#111111] transition-colors mt-0.5"
          >
            <MujiIcon name="close" size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TimeThiefCard;
