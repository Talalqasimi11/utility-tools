import type { ToolDefinition } from "@/types/tool";

export const tools: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    category: "pdf",
    url: "/tools/merge-pdf",
    seoTitle: "Merge PDF Files Online Free | PDF Toolboxx",
    seoDescription:
      "Merge multiple PDF files into one document online for free. Arrange your files, combine them, and download the merged PDF directly in your browser.",
    acceptedInputs: ["application/pdf"],
    multiple: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple documents.",
    category: "pdf",
    url: "/tools/split-pdf",
    seoTitle: "Split PDF Pages Online Free | PDF Toolboxx",
    seoDescription:
      "Split PDF files online for free. Extract selected pages or divide a large PDF into multiple documents quickly and securely on your device.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality.",
    category: "pdf",
    url: "/tools/compress-pdf",
    seoTitle: "Compress PDF File Size Online Free | PDF Toolboxx",
    seoDescription:
      "Compress PDF files online for free to reduce their file size. Optimize large PDFs for email and web without losing quality. Processed locally.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    description: "Remove unwanted pages from your PDF file.",
    category: "pdf",
    url: "/tools/remove-pages",
    seoTitle: "Remove Pages from PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Delete unwanted pages from a PDF document online for free. Select the pages you want to remove and download your cleaned PDF instantly.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "extract-pages",
    name: "Extract Pages",
    description: "Extract specific pages from a PDF document.",
    category: "pdf",
    url: "/tools/extract-pages",
    seoTitle: "Extract PDF Pages Online Free | PDF Toolboxx",
    seoDescription:
      "Extract selected pages from a PDF online for free. Choose the exact pages you need and save them as a new PDF document securely.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate individual pages or the entire PDF document.",
    category: "pdf",
    url: "/tools/rotate-pdf",
    seoTitle: "Rotate PDF Pages Online Free | PDF Toolboxx",
    seoDescription:
      "Rotate PDF pages online for free. Correct the orientation of individual pages or your entire PDF document. Files are processed locally in your browser.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "reorder-pdf",
    name: "Reorder PDF",
    description: "Rearrange the pages of your PDF document.",
    category: "pdf",
    url: "/tools/reorder-pdf",
    seoTitle: "Reorder PDF Pages Online Free | PDF Toolboxx",
    seoDescription:
      "Rearrange and reorder PDF pages online for free. Easily drag and drop pages into your preferred sequence and download the updated document.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add a text watermark to your PDF document.",
    category: "pdf",
    url: "/tools/watermark-pdf",
    seoTitle: "Add Watermark to PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Add a custom text watermark to PDF files online for free. Protect your documents by customizing the position, size, opacity, and rotation.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF files to editable Word documents.",
    category: "pdf",
    url: "/tools/pdf-to-word",
    seoTitle: "PDF to Word Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert PDF files to editable Word documents online for free. Turn your PDF into DOCX format directly in your browser without uploading your sensitive files.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract tables and structured data from PDF files and convert them into editable Excel spreadsheets.",
    category: "pdf",
    url: "/tools/pdf-to-excel",
    seoTitle: "PDF to Excel Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert PDF to Excel online for free. Extract tables from PDF documents and download them as editable XLSX spreadsheets. Processed locally for privacy.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint online for free. Turn PDF pages into editable PowerPoint slides directly in your browser.",
    category: "pdf",
    url: "/tools/pdf-to-powerpoint",
    seoTitle: "PDF to PowerPoint Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert PDF to PowerPoint online for free. Turn PDF pages into editable PPTX slides directly in your browser with no file uploads.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to Image",
    description: "Convert PDF pages into images.",
    category: "pdf",
    url: "/tools/pdf-to-jpg",
    seoTitle: "PDF to Image Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert PDF pages to JPG images online for free. Select pages, choose image quality, and download your rasterized image files instantly.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF online.",
    category: "pdf",
    url: "/tools/word-to-pdf",
    seoTitle: "Word to PDF Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert Word documents to PDF online for free. Turn DOCX files into standard PDF documents directly in your browser without uploading your files.",
    acceptedInputs: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"],
    multiple: false,
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF online for free. Turn XLSX files into printable PDF documents directly in your browser.",
    category: "pdf",
    url: "/tools/excel-to-pdf",
    seoTitle: "Excel to PDF Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert Excel spreadsheets to PDF online for free. Turn XLSX files into printable PDF documents directly in your browser without uploading.",
    acceptedInputs: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx", "application/vnd.ms-excel", ".xls"],
    multiple: false,
  },
  {
    slug: "jpg-to-pdf",
    name: "Image to PDF",
    description: "Convert images into a PDF document.",
    category: "pdf",
    url: "/tools/jpg-to-pdf",
    seoTitle: "Image to PDF Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert JPG and PNG images to PDF online for free. Combine multiple photos into one document, customize orientation, and download securely.",
    acceptedInputs: ["image/jpeg", "image/png"],
    multiple: true,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export const TOOL_CLUSTERS = {
  editing: [
    'merge-pdf', 'split-pdf', 'compress-pdf', 'remove-pages', 
    'extract-pages', 'rotate-pdf', 'reorder-pdf', 'watermark-pdf'
  ],
  conversion: [
    'pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg'
  ],
  reverseConversion: [
    'word-to-pdf', 'excel-to-pdf', 'jpg-to-pdf'
  ]
};

export function getRelatedTools(currentSlug: string, limit = 3): ToolDefinition[] {
  // Find which cluster the current tool belongs to
  let targetCluster: string[] = [];
  if (TOOL_CLUSTERS.editing.includes(currentSlug)) targetCluster = TOOL_CLUSTERS.editing;
  else if (TOOL_CLUSTERS.conversion.includes(currentSlug)) targetCluster = TOOL_CLUSTERS.conversion;
  else if (TOOL_CLUSTERS.reverseConversion.includes(currentSlug)) targetCluster = TOOL_CLUSTERS.reverseConversion;
  
  // If no specific cluster match, just use all tools as a fallback
  if (targetCluster.length === 0) {
    targetCluster = tools.map(t => t.slug);
  }

  // Filter tools: must be in the target cluster, and not the current tool
  let related = tools.filter(t => targetCluster.includes(t.slug) && t.slug !== currentSlug);

  // If we don't have enough, pull from other highly related clusters to fill out the limit
  if (related.length < limit) {
    let fallbackCluster: string[] = [];
    if (TOOL_CLUSTERS.conversion.includes(currentSlug)) fallbackCluster = TOOL_CLUSTERS.reverseConversion;
    else if (TOOL_CLUSTERS.reverseConversion.includes(currentSlug)) fallbackCluster = TOOL_CLUSTERS.conversion;
    else fallbackCluster = TOOL_CLUSTERS.conversion; // Default fallback for editing

    const additional = tools.filter(t => 
      fallbackCluster.includes(t.slug) && 
      t.slug !== currentSlug && 
      !related.find(r => r.slug === t.slug)
    );
    related = [...related, ...additional];
  }

  return related.slice(0, limit);
}
