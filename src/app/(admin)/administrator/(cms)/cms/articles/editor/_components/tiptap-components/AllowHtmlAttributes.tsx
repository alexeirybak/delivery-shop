import { Extension } from "@tiptap/core";

export const AllowHtmlAttributes = Extension.create({
  name: "allowHtmlAttributes",

  addGlobalAttributes() {
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
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) {
                return {};
              }
              return {
                style: attributes.style,
              };
            },
          },
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute("class"),
            renderHTML: (attributes) => {
              if (!attributes.class) {
                return {};
              }
              return {
                class: attributes.class,
              };
            },
          },
        },
      },
    ];
  },
});
