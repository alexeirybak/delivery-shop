import { Extension } from "@tiptap/core";

export const AllowHtmlAttributes = Extension.create({
  name: "allowHtmlAttributes",

  addGlobalAttributes() {
    const commonAttributes = {
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("style"),
        renderHTML: (attributes: { style?: string }) =>
          attributes.style ? { style: attributes.style } : {},
      },
      class: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("class"),
        renderHTML: (attributes: { class?: string }) =>
          attributes.class ? { class: attributes.class } : {},
      },
    };

    // Специфичные атрибуты для таблиц
    const tableAttributes = {
      ...commonAttributes,
      border: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("border"),
        renderHTML: (attributes: { border?: string }) =>
          attributes.border ? { border: attributes.border } : {},
      },
      cellspacing: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("cellspacing"),
        renderHTML: (attributes: { cellspacing?: string }) =>
          attributes.cellspacing ? { cellspacing: attributes.cellspacing } : {},
      },
      cellpadding: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("cellpadding"),
        renderHTML: (attributes: { cellpadding?: string }) =>
          attributes.cellpadding ? { cellpadding: attributes.cellpadding } : {},
      },
    };

    // Специфичные атрибуты для ячеек таблицы
    const tableCellAttributes = {
      ...commonAttributes,
      colspan: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("colspan"),
        renderHTML: (attributes: { colspan?: string }) =>
          attributes.colspan ? { colspan: attributes.colspan } : {},
      },
      rowspan: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("rowspan"),
        renderHTML: (attributes: { rowspan?: string }) =>
          attributes.rowspan ? { rowspan: attributes.rowspan } : {},
      },
    };

    // Специфичные атрибуты для изображений
    const imageAttributes = {
      ...commonAttributes,
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("width"),
        renderHTML: (attributes: { width?: string }) =>
          attributes.width ? { width: attributes.width } : {},
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("height"),
        renderHTML: (attributes: { height?: string }) =>
          attributes.height ? { height: attributes.height } : {},
      },
    };

    return [
      {
        types: [
          "paragraph",
          "heading",
          "textStyle",
          "bold",
          "italic",
          "strike",
          "underline",
          "code",
          "link",
          "bulletList",
          "orderedList",
          "listItem",
          "blockquote",
          "codeBlock",
          "horizontalRule",
          "hardBreak",
        ],
        attributes: commonAttributes,
      },
      {
        types: ["table"],
        attributes: tableAttributes,
      },
      {
        types: ["tableCell", "tableHeader"],
        attributes: tableCellAttributes,
      },
      {
        types: ["image"],
        attributes: imageAttributes,
      },
      {
        types: ["tableRow"],
        attributes: commonAttributes,
      },
    ];
  },
});