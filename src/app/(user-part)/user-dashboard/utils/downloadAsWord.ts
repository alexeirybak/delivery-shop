export const downloadAsWord = async (content: string, filename: string) => {
  let cleanedContent = content;
  
  cleanedContent = cleanedContent.replace(/<svg[\s\S]*?<\/svg>/gi, '[Диаграмма]');
  
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanedContent;

  const images = tempDiv.querySelectorAll("img");
  
  const imagePromises = Array.from(images).map(async (img) => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("data:")) {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        
        img.setAttribute("src", base64);
      } catch (error) {
        console.error("Ошибка загрузки изображения:", src, error);
      }
    }
  });

  await Promise.all(imagePromises);

  const elements = tempDiv.querySelectorAll("p, div, li, h1, h2, h3, td");
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.lineHeight = "18pt";
    htmlEl.style.setProperty("mso-line-height-rule", "exactly");
    htmlEl.style.fontFamily = "'Times New Roman', Times, serif";
    htmlEl.style.margin = "0";
  });

  const processedContent = tempDiv.innerHTML;

  const fullHtml = `<!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                      <style>
                        body {
                          margin: 2.5cm;
                          font-family: 'Times New Roman', Times, serif;
                          font-size: 14pt !important;
                          mso-line-height-rule: exactly;
                          line-height: 18pt;
                        }
                        table { border-collapse: collapse; width: 100%; }
                        td, th { border: 1px solid black; padding: 5pt; font-size: 14pt !important; }
                        p, div, li, h1, h2, h3 {
                          margin: 0 !important;
                          line-height: 18pt !important;
                        }
                        img {
                          max-width: 100%;
                          height: auto;
                          vertical-align: middle;
                        }
                      </style>
                    </head>
                    <body>
                      ${processedContent}
                    </body>
                    </html>`;

  const blob = new Blob([fullHtml], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};