/**
 * MUJI 스타일 카드 컴포넌트
 * - 그림자 거의 없음
 * - 넓은 여백
 * - 아이보리/베이지 배경
 */

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const baseStyles = 'transition-shadow duration-200';

  const variantStyles = {
    default: 'bg-white border-1 border-muji-beige',
    beige: 'bg-muji-beige border-1 border-muji-lightbeige',
    outline: 'bg-transparent border-1 border-muji-light',
    flat: 'bg-muji-bg',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyle = onClick ? 'cursor-pointer hover:shadow-muji' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyle}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};

export default Card;
