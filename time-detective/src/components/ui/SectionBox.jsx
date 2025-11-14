import React from 'react';

const SectionBox = ({
  children,
  title,
  subtitle,
  className = '',
  variant = 'default',
  padding = 'default',
  showBorder = true
}) => {
  const variantStyles = {
    default: 'bg-[#FAF9F5] border border-[#E6E3DD]',
    white: 'bg-white border border-[#E6E3DD]',
    cream: 'bg-[#F7F5F0] border border-[#E6E3DD]',
    transparent: 'bg-transparent',
  };

  const paddingStyles = {
    default: 'p-6',
    large: 'p-8',
    small: 'p-4',
    none: 'p-0',
  };

  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${showBorder ? 'rounded-[4px]' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className={`${showBorder ? 'border-b border-[#E6E3DD]' : ''} pb-4 mb-6`}>
          {title && (
            <h3 className="text-base font-normal text-[#111111] mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs font-light text-[#6B6B6B]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionBox;
