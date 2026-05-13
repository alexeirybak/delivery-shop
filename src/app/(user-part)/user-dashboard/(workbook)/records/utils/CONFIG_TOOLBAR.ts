import { AlignmentMenu } from "../_components/tiptap-components/AlignmentMenu";
import { BgColorMenu } from "../_components/tiptap-components/BgColorMenu";
import { CodeEditorButton } from "../_components/tiptap-components/CodeEditorButton";
import { ExportButton } from "../_components/tiptap-components/ExportButton";
import { FontSizeMenu } from "../_components/tiptap-components/FontSizeMenu";
import { HistoryMenu } from "../_components/tiptap-components/HistoryMenu";
import { ImageAIMenu } from "../_components/tiptap-components/imageAI/ImageAIMenu";
import { ImageAttributes } from "../_components/tiptap-components/ImageAttributes";
import { ImageMenu } from "../_components/tiptap-components/ImageMenu";
import { LinkMenu } from "../_components/tiptap-components/LinkMenu";
import { ListMenu } from "../_components/tiptap-components/ListMenu";
import { QuoteButton } from "../_components/tiptap-components/QuoteButton";
import { SaveButton } from "../_components/tiptap-components/SaveButton";
import { TableMenu } from "../_components/tiptap-components/TableMenu";
import { TextAIMenu } from "../_components/tiptap-components/textAI/TextAIMenu";
import { TextColorMenu } from "../_components/tiptap-components/TextColorMenu";
import { TextFormattingMenu } from "../_components/tiptap-components/TextFormattingMenu";
import { TextLevelMenu } from "../_components/tiptap-components/TextLevelMenu";

export const CONFIG_TOOLBAR_COMPONENTS = {
  history: { component: HistoryMenu },
  textLevel: { component: TextLevelMenu },
  fontSize: { component: FontSizeMenu },
  textFormatting: { component: TextFormattingMenu },
  quote: { component: QuoteButton },
  codeEditor: { component: CodeEditorButton },
  alignment: { component: AlignmentMenu },
  textColor: { component: TextColorMenu },
  bgColor: { component: BgColorMenu },
  list: { component: ListMenu },
  link: { component: LinkMenu },
  table: { component: TableMenu },
  image: { component: ImageMenu },
  imageAttributes: { component: ImageAttributes },
  textAI: { component: TextAIMenu },
  imageAI: { component: ImageAIMenu },
  export: { component: ExportButton },
  save: { component: SaveButton },
} as const;
