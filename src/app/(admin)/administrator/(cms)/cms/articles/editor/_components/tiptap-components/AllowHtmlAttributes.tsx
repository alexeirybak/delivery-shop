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
          "table",
          "tableRow",
          "tableCell",
          "tableHeader",
          "image"
        ],
        attributes: commonAttributes,
      },
    ];
  },
});