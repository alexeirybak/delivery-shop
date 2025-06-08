import ButtonSearch from "./ButtonSearch";
import InputBlock from "./InputBlock";

const SearchBlock = () => {
  return (
    <div className="flex flex-row gap-4 flex-grow">
      <ButtonSearch />
      <InputBlock />
    </div>
  );
};

export default SearchBlock;
