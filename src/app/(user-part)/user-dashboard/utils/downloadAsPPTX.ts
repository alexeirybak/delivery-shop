import PptxGenJS from 'pptxgenjs';

export const downloadAsPPTX = (content: string, filename: string) => {
  const pptx = new PptxGenJS();
  
  pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 });
  pptx.layout = 'CUSTOM';
  
  const themeColors = {
    primary: '2E75B6',
    secondary: '70AD47',
    text: '1F1F1F',
    textLight: '666666'
  };
  
  const addTitleSlide = (title: string) => {
    const slide = pptx.addSlide();
    slide.background = { fill: 'FFFFFF' };
    
    slide.addText(title, {
      x: 0.5,
      y: 2.5,
      w: '90%',
      h: 1.5,
      fontSize: 48,
      bold: true,
      color: themeColors.primary,
      fontFace: 'Arial',
      align: 'center',
      lang: 'ru-RU'  
    });
    
    const date = new Date().toLocaleDateString('ru-RU');
    slide.addText(date, {
      x: 0.5,
      y: 5.5,
      w: '90%',
      h: 0.6,
      fontSize: 16,
      color: themeColors.textLight,
      fontFace: 'Arial',
      align: 'center',
      lang: 'ru-RU'
    });
  };
  
  const parseTable = (lines: string[], startIndex: number): { table: string[][]; endIndex: number } => {
    const table: string[][] = [];
    let i = startIndex;
    let foundTable = false;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (!line) {
        i++;
        continue;
      }
      
      if (line.includes('|') && line.includes('-') && !line.includes('---')) {
        i++;
        continue;
      }
      
      if (line.includes('|')) {
        foundTable = true;
        const row = line.split('|')
          .filter(cell => cell.trim() !== '')
          .map(cell => cell.trim());
        if (row.length > 0) {
          table.push(row);
        }
        i++;
      } 
      else if (foundTable) {
        break;
      }
      else {
        i++;
      }
    }
    
    return { table, endIndex: i };
  };
  
  const addTableSlide = (title: string, tableData: string[][]) => {
    const slide = pptx.addSlide();
    slide.background = { fill: 'FFFFFF' };
    
    slide.addText(title, {
      x: 0.5,
      y: 0.3,
      w: '90%',
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: themeColors.primary,
      fontFace: 'Arial',
      lang: 'ru-RU'
    });
    
    const rows = tableData.length;
    const cols = tableData[0]?.length || 2;
    const colWidth = 8.5 / cols;
    
    const tableRows: PptxGenJS.TableRow[] = [];
    
    tableData.forEach((row, rowIndex) => {
      const rowCells: PptxGenJS.TableCell[] = [];
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        const cellText = row[colIndex] || '';
        if (rowIndex === 0) {
          rowCells.push({
            text: cellText,
            options: {
              fontFace: 'Arial',
              fontSize: 14,
              bold: true,
              color: themeColors.primary,
              align: 'center',
              valign: 'middle'
            }
          });
        } else {
          rowCells.push({
            text: cellText,
            options: {
              fontFace: 'Arial',
              fontSize: 12,
              bold: false,
              color: themeColors.text,
              align: 'center',
              valign: 'middle'
            }
          });
        }
      }
      tableRows.push(rowCells);
    });
    
    slide.addTable(tableRows, {
      x: 0.75,
      y: 1.4,
      w: 8.5,
      h: Math.min(5.2, 0.5 + rows * 0.4),
      colW: Array(cols).fill(colWidth),
      rowH: 0.4,
      border: { pt: 1, color: 'CCCCCC' },
      fill: { color: 'FFFFFF' }
    });
  };
  
  const addContentSlide = (title: string, content: string) => {
    const slide = pptx.addSlide();
    slide.background = { fill: 'FFFFFF' };
    
    slide.addText(title, {
      x: 0.5,
      y: 0.3,
      w: '90%',
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: themeColors.primary,
      fontFace: 'Arial',
      lang: 'ru-RU'
    });
    
    slide.addShape('rect', {
      x: 0.5,
      y: 1.1,
      w: 1.5,
      h: 0.05,
      fill: { color: themeColors.secondary },
      line: { color: themeColors.secondary, width: 0 }
    });
    
    slide.addText(content, {
      x: 0.5,
      y: 1.4,
      w: '90%',
      h: 5.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: themeColors.text,
      valign: 'top',
      bullet: true,
      lineSpacing: 24,
      lang: 'ru-RU'  
    });
  };
  
  const cleanPresentation = (text: string): string => {
    let cleaned = text;
    cleaned = cleaned.replace(/^#+\s+/gm, '');
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    cleaned = cleaned.replace(/`(.*?)`/g, '$1');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    return cleaned;
  };
  
  const lines = content.split('\n');
  let presentationTitle = '';
  let contentWithoutTitle = content;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      presentationTitle = trimmed.slice(2);
      contentWithoutTitle = content.replace(line, '').replace(/^\n+/, '');
      break;
    }
  }
  
  const cleanedContent = cleanPresentation(contentWithoutTitle);
  const slidesArray = cleanedContent.split('---').filter(s => s.trim());
  
  if (presentationTitle) {
    addTitleSlide(presentationTitle);
  }
  
  for (const slideContent of slidesArray) {
    const slideLines = slideContent.trim().split('\n');
    
    let title = '';
    let bodyText = '';
    let tableData: string[][] | null = null;
    
    for (let i = 0; i < slideLines.length; i++) {
      const line = slideLines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (trimmed.startsWith('## ')) {
        title = trimmed.slice(3);
      } 
      else if (trimmed.startsWith('### ')) {
        bodyText += `${trimmed.slice(4)}\n\n`;
      }
      else if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        bodyText += `• ${trimmed.slice(2)}\n`;
      }
      else if (/^\d+\./.test(trimmed)) {
        bodyText += `${trimmed}\n`;
      }
      else if (trimmed.includes('|')) {
        const { table, endIndex } = parseTable(slideLines, i);
        if (table.length > 0) {
          tableData = table;
          i = endIndex - 1;
        }
      }
      else {
        bodyText += `${trimmed}\n`;
      }
    }
    
    if (!title && slideLines.length > 0) {
      title = slideLines[0].trim().replace(/^##\s+/, '');
    }
    
    if (title) {
      if (tableData && tableData.length > 0) {
        addTableSlide(title, tableData);
      } else if (bodyText) {
        addContentSlide(title, bodyText);
      }
    }
  }
  
  pptx.writeFile({ fileName: `${filename}.pptx` });
};