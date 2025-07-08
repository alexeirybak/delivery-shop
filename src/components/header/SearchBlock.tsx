import ButtonSearch from "./ButtonSearch";
import InputBlock from "./inputSearch/InputBlock";

const SearchBlock = ({
  onFocusChangeAction,
}: {
  onFocusChangeAction: (focused: boolean) => void;
}) => {
  return (
    <div className="flex flex-row gap-4 flex-grow">
      <ButtonSearch />
      <InputBlock onFocusChangeAction={onFocusChangeAction} />
    </div>
  );
};

export default SearchBlock;
