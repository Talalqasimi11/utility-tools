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
      "Merge multiple PDF files into one document online. Arrange your files, combine them, and download the merged PDF.",
    acceptedInputs: ["application/pdf"],
    multiple: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple documents.",
    category: "pdf",
    url: "/tools/split-pdf",
    seoTitle: "Split PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Split PDF files online. Extract selected pages or split a PDF into multiple documents quickly and easily.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality.",
    category: "pdf",
    url: "/tools/compress-pdf",
    seoTitle: "Compress PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Compress PDF files online and reduce their file size. Choose a compression level and download your optimized PDF.",
    acceptedInputs: ["application/pdf"],
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
      "Convert images to PDF online. Combine multiple images into one PDF, choose page size and orientation, then download your document.",
    acceptedInputs: ["image/jpeg", "image/png"],
    multiple: true,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to Image",
    description: "Convert PDF pages into images.",
    category: "pdf",
    url: "/tools/pdf-to-jpg",
    seoTitle: "PDF to Image Converter Online Free | PDF Toolboxx",
    seoDescription:
      "Convert PDF pages to images online. Select pages, choose image quality, and download your image files.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    description: "Remove unwanted pages from your PDF file.",
    category: "pdf",
    url: "/tools/remove-pages",
    seoTitle: "Remove PDF Pages Online Free | PDF Toolboxx",
    seoDescription:
      "Remove pages from a PDF document online. Select the pages you want to delete and download your cleaned PDF.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "extract-pages",
    name: "Extract Pages",
    description: "Extract specific pages from a PDF document.",
    category: "pdf",
    url: "/tools/extract-pages",
    seoTitle: "Extract Pages from PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Extract selected pages from a PDF online for free. Choose the pages you need and download them as a new PDF. Your file stays on your device.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate individual pages or the entire PDF document.",
    category: "pdf",
    url: "/tools/rotate-pdf",
    seoTitle: "Rotate PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Rotate PDF pages online for free. Rotate individual pages or your entire PDF and download the corrected document. Files are processed directly in your browser.",
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
      "Reorder PDF pages online for free. Easily rearrange pages in a PDF with drag and drop, then download your reordered document. Files stay on your device.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add a text watermark to your PDF document.",
    category: "pdf",
    url: "/tools/watermark-pdf",
    seoTitle: "Watermark PDF Online Free | PDF Toolboxx",
    seoDescription:
      "Add a text watermark to PDF files online for free. Customize the watermark position, size, opacity, and rotation. Your PDF is processed directly in your browser.",
    acceptedInputs: ["application/pdf"],
    multiple: false,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(
  currentSlug: string,
  limit = 3,
): ToolDefinition[] {
  return tools.filter((t) => t.slug !== currentSlug).slice(0, limit);
}
