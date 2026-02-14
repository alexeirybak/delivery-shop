export const insertImagesIntoArticle = (
  htmlContent: string,
  images: {
    middleImageUrl: string;
    endImageUrl: string;
  },
  topic: string,
) => {
  let content = htmlContent.trim();
  const imageAlt = `${topic}`;

  const middleImageHtml = `
<div>
  <img 
    src="${images.middleImageUrl}" 
    alt="${topic}"
    style="float: left; width: 300px; margin: 0 15px 15px 0; border-radius: 4px;"
  >
</div>`;

  const endImageHtml = `
<div style="text-align: center; margin: 30px 0;">
  <img 
    src="${images.endImageUrl}" 
    alt="${topic}"
    style="width: 100%; border-radius: 4px;"
  >
</div>`;

  content = content
    .replace(/\[MIDDLE_IMAGE\]/g, middleImageHtml)
    .replace(/\[END_IMAGE\]/g, endImageHtml);

  return {
    contentWithImages: content,
    imageAlt,
  };
};