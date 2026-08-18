import type { ToolDefinition } from "@/types/tool";

export const tools: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    category: "pdf",
    url: "/tools/merge-pdf",
    seoTitle: "Merge PDF Files Online Free",
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
    seoTitle: "Split PDF Online Free",
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
    seoTitle: "Compress PDF Online Free",
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
    seoTitle: "Image to PDF Converter Online Free",
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
    seoTitle: "PDF to Image Converter Online Free",
    seoDescription:
      "Convert PDF pages to images online. Select pages, choose image quality, and download your image files.",
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
