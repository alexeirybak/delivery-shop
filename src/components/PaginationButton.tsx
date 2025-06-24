const PaginationButton = ({ 
  href, 
  children, 
  disabled = false, 
  active = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  disabled?: boolean; 
  active?: boolean 
}) => {
  return (
    <a
      href={disabled ? undefined : href}
      className={`px-3 py-2 rounded-md ${
        active 
          ? 'bg-blue-600 text-white font-medium' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
      } ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
      }`}
    >
      {children}
    </a>
  );
};


export default PaginationButton;