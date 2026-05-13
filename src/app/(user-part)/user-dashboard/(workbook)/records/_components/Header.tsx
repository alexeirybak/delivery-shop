import "../styles/header.css";

interface HeaderProps {
  title: string;
  description: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="workbook-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
};