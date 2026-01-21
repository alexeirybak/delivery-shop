import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: getDimensionParser("width"),
        renderHTML: getDimensionRenderer("width"),
      },
      height: {
        default: null,
        parseHTML: getDimensionParser("height"),
        renderHTML: getDimensionRenderer("height"),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = { ...HTMLAttributes };
    const styles = ["max-width: 100%"];

    if (attrs.width) {
      attrs.width = attrs.width.toString();
      styles.push(`width: ${attrs.width}px`);
    }

    if (attrs.height) {
      attrs.height = attrs.height.toString();
      styles.push(`height: ${attrs.height}px`);
    } else {
      styles.push("height: auto");
    }

    attrs.style = styles.join("; ");
    attrs.class = "tiptap-image";

    return ["img", attrs];
  },
}).configure({
  resize: {
    enabled: true,
    directions: [
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ],
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: false,
  },
  allowBase64: true,
  HTMLAttributes: {
    class: "tiptap-image",
  },
});


function getDimensionParser(dimension: "width" | "height") {
  return (element: HTMLElement) => {
    const attr = element.getAttribute(dimension);
    if (attr) return attr.replace("px", "");

    const style = element.style[
      dimension as keyof CSSStyleDeclaration
    ] as string;
    if (style) {
      const match = style.match(/(\d+)px/);
      return match ? match[1] : null;
    }

    return null;
  };
}

function getDimensionRenderer(dimension: "width" | "height") {
  return (attributes: Record<string, unknown>) => {
    if (attributes[dimension]) {
      return {
        [dimension]: attributes[dimension],
        style: `${dimension}: ${attributes[dimension]}px;`,
      };
    }
    return {};
  };
}
