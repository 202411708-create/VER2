/**
 * MUJI 스타일 버튼 컴포넌트
 * - 배경 없음 (투명 또는 최소)
 * - border 1px solid
 * - hover: 미묘한 배경색 변화
 * - 글꼴 가벼움
 */

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center transition-colors duration-200 font-light border-1';

  const variantStyles = {
    primary: 'border-muji-mid text-muji-dark bg-transparent hover:bg-muji-bg',
    secondary: 'border-muji-light text-muji-light bg-transparent hover:bg-muji-bg',
    ghost: 'border-transparent text-muji-mid hover:bg-muji-bg',
    filled: 'border-muji-mid text-white bg-muji-mid hover:bg-muji-dark',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-body-sm min-h-[36px]',
    md: 'px-6 py-3 text-body min-h-touch',
    lg: 'px-8 py-4 text-body-lg min-h-[52px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${disabledStyles}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
};

export default Button;
