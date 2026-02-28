import UserBlock from "./UserBlock";
import LogoBlock from "./LogoBlock";
import CatalogMenuWrapper from "./CatalogDropMenu/CatalogMenuWrapper";

const Header = () => {
  return (
    <header className="relative z-50 flex flex-col justify-center w-full bg-white md:shadow-default md:flex-row md:gap-y-5 xl:gap-y-7 md:gap-10 md:p-2">
      <div className="flex flex-row items-center gap-4 px-4 py-2 xl:gap-10 shadow-default md:shadow-none">
        <LogoBlock />
        <CatalogMenuWrapper />
      </div>
      <UserBlock />
    </header>
  );
};

export default Header;
