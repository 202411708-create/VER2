/**
 * MUJI 스타일 리스트 아이템 컴포넌트
 * - 아이콘은 텍스트보다 앞에 작게 배치
 * - 행간 넓게
 * - 미니멀한 인터랙션
 */

const ListItem = ({
  children,
  icon,
  iconColor,
  onClick,
  selected = false,
  className = '',
}) => {
  const baseStyles = 'flex items-start gap-3 py-4 px-4 transition-colors duration-200';
  const interactiveStyles = onClick
    ? 'cursor-pointer hover:bg-muji-bg'
    : '';
  const selectedStyles = selected
    ? 'bg-muji-beige border-l-2 border-muji-mid'
    : 'border-l-2 border-transparent';

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${interactiveStyles}
        ${selectedStyles}
        ${className}
      `.trim()}
    >
      {icon && (
        <div className="flex-shrink-0 mt-1" style={{ color: iconColor }}>
          {icon}
        </div>
      )}
      <div className="flex-1 leading-relaxed text-muji-dark">{children}</div>
    </div>
  );
};

export default ListItem;
