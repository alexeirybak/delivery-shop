import { AlignmentMenu } from "../editor/_components/tiptap-components/AlignmentMenu";
import { BgColorMenu } from "../editor/_components/tiptap-components/BgColorMenu";
import { CodeEditorButton } from "../editor/_components/tiptap-components/CodeEditorButton";
import { FontSizeMenu } from "../editor/_components/tiptap-components/FontSizeMenu";
import { HistoryMenu } from "../editor/_components/tiptap-components/HistoryMenu";
import { ImageAIMenu } from "../editor/_components/tiptap-components/imageAI/ImageAIMenu";
import { ImageAttributes } from "../editor/_components/tiptap-components/ImageAttributes";
import { ImageMenu } from "../editor/_components/tiptap-components/ImageMenu";
import { LinkMenu } from "../editor/_components/tiptap-components/LinkMenu";
import { ListMenu } from "../editor/_components/tiptap-components/ListMenu";
import { QuoteButton } from "../editor/_components/tiptap-components/QuoteButton";
import { TableMenu } from "../editor/_components/tiptap-components/table-menu/TableMenu";
import { TextAIMenu } from "../editor/_components/tiptap-components/textAI/TextAIMenu";
import { TextColorMenu } from "../editor/_components/tiptap-components/TextColorMenu";
import { TextFormattingMenu } from "../editor/_components/tiptap-components/TextFormattingMenu";
import { TextLevelMenu } from "../editor/_components/tiptap-components/TextLevelMenu";

export const CONFIG_GROUPS = [
  {
    id: "history",
    name: "История",
    items: ["history"],
  },
  {
    id: "text",
    name: "Текст",
    items: ["textLevel", "fontSize"],
  },
  {
    id: "textFormatting",
    name: "Форматирование",
    items: ["textFormatting"],
  },
  {
    id: "quoteCode",
    name: "Цитаты и код",
    items: ["quote", "codeEditor"],
  },
  {
    id: "alignment",
    name: "Выравнивание",
    items: ["alignment"],
  },
  {
    id: "color",
    name: "Цвет текста и фона",
    items: ["textColor", "bgColor"],
  },
  {
    id: "list",
    name: "Списки",
    items: ["list"],
  },
  {
    id: "links",
    name: "Ссылки",
    items: ["link"],
  },
  {
    id: "table",
    name: "Таблицы",
    items: ["table"],
  },
  {
    id: "images",
    name: "Изображения",
    items: ["image"],
  },
  {
    id: "imageAttributes",
    name: "Атрибуты изображения",
    items: ["imageAttributes"],
  },
  {
    id: "textAI",
    name: "Генерация текста",
    items: ["textAI"],
  },
  {
    id: "imageAI",
    name: "Генерация изображений",
    items: ["imageAI"],
  },
];

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
} as const;
