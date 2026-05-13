const formatContent = (text: string): string => {
  let formatted = text.replace(/\n/g, "<br>");
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  return formatted;
};

const convertImagesToBase64 = async (html: string): Promise<string> => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const images = tempDiv.querySelectorAll("img");

  for (const img of images) {
    const src = img.getAttribute("src");

    if (src && !src.startsWith("data:image") && !src.startsWith("http")) {
      const originalImg = document.querySelector(
        `img[src="${src}"]`,
      ) as HTMLImageElement;

      if (
        originalImg &&
        originalImg.complete &&
        originalImg.naturalHeight > 0
      ) {
        const canvas = document.createElement("canvas");
        canvas.width = originalImg.naturalWidth;
        canvas.height = originalImg.naturalHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(originalImg, 0, 0);
          const base64 = canvas.toDataURL("image/png");
          img.setAttribute("src", base64);
        }
      } else if (src && src.startsWith("blob:")) {
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
          console.error(`Failed to convert blob image: ${src}`, error);
        }
      }
    }
  }

  return tempDiv.innerHTML;
};

export const downloadAsPDF = async (content: string, filename: string) => {
  try {
    const contentWithBase64Images = await convertImagesToBase64(content);
    const formattedContent = formatContent(contentWithBase64Images);

    console.log(
      "Images converted to base64:",
      formattedContent.includes("data:image"),
    );

    const response = await fetch("/api/learning/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: formattedContent,
        title: filename,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate PDF");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF download error:", error);
    alert("Ошибка создания PDF");
  }
};
