import { HeaderProps } from "../types/dashboard";


export const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </header>
  );
};
