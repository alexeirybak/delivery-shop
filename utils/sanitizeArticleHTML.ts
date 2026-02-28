import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const createDOMPurify = () => {
  const window = new JSDOM("").window;
  return DOMPurify(window);
};

const purify = createDOMPurify();

export function sanitizeArticleHTML(html: string): string {
  if (!html) return "";

  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "mark",
      "code",
      "blockquote",
      "pre",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div",
    ],

    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "title",
      "src",
      "alt",
      "title",
      "width",
      "height",
      "class",
      "style",
      "colspan",
      "rowspan",
      "border",
      "cellpadding",
      "cellspacing",
      "class",
      "style",
      "id",
    ],

    FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
      "textarea",
      "button",
      "select",
      "meta",
      "link",
      "style",
      "base",
    ],

    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onmouseout",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
      "onkeydown",
      "onkeyup",
      "onkeypress",
    ],

    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    USE_PROFILES: { html: true },
  });
}
