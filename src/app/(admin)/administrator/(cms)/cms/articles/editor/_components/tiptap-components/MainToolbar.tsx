import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { EditorProps } from "../../../types";
import { HistoryMenu } from "./HistoryMenu";
import { ParagraphButton } from "./ParagraphButton";
import { TextFormattingMenu } from "./TextFormattingMenu";
import { AlignmentMenu } from "./AlignmentMenu";
import { ListMenu } from "./ListMenu";
import { FontSizeMenu } from "./FontSizeMenu";
import { LinkMenu } from "./LinkMenu";
import { TextColorMenu } from "./TextColorMenu";
import { BgColorMenu } from "./BgColorMenu";
import { QuoteButton } from "./QuoteButton";
import { CodeEditorButton } from "./CodeEditorButton";
import { TableMenu } from "./TableMenu";

const MainToolbar = ({ editor }: EditorProps) => {
  return (
    <div className="flex flex-row flex-wrap py-2">
      <HistoryMenu editor={editor} />
      <HeadingDropdownMenu
        editor={editor}
        levels={[1, 2, 3, 4, 5, 6]}
        hideWhenUnavailable={true}
        portal={false}
        className="cursor-pointer duration-300"
      />
      <ParagraphButton editor={editor} />
      <FontSizeMenu editor={editor} />
      <TextFormattingMenu editor={editor} />
      <QuoteButton editor={editor} />
      <CodeEditorButton editor={editor} />
      <AlignmentMenu editor={editor} />
      <TextColorMenu editor={editor} />
      <BgColorMenu editor={editor} />
      <ListMenu editor={editor} />
      <LinkMenu editor={editor} />
      <TableMenu editor={editor}/>
    </div>
  );
};

export default MainToolbar;
