import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import PdfToJpgTool from "@/components/pdf/PdfToJpgTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("pdf-to-jpg");
  if (!tool) return {};
  
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
  };
}

export default function PdfToJpgPage() {
  const tool = getToolBySlug("pdf-to-jpg");
  
  if (!tool) {
    notFound();
  }

  const faq = [
    {
      question: "Is my data secure?",
      answer: "Yes. All processing happens locally within your internet browser. Your documents are never uploaded or saved to any external servers.",
    },
    {
      question: "How will I receive the image files?",
      answer: "If you convert a single page, you will download a single .jpg image file. If you convert multiple pages, we will automatically bundle them into a ZIP folder for easy downloading.",
    },
    {
      question: "Which quality setting should I choose?",
      answer: "Medium is recommended for general use, balancing file size and visual clarity. Choose High if you are converting documents with small text or complex diagrams, and Low if you need the smallest possible file sizes for web uploading.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
    >
      <PdfToJpgTool />
    </ToolLayout>
  );
}
