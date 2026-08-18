import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import SplitPdfTool from "@/components/pdf/SplitPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("split-pdf");
  if (!tool) return {};
  
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
  };
}

export default function SplitPdfPage() {
  const tool = getToolBySlug("split-pdf");
  
  if (!tool) {
    notFound();
  }

  const faq = [
    {
      question: "Is my data secure?",
      answer: "Yes. All processing happens directly in your browser. Your files are never uploaded to any server.",
    },
    {
      question: "How do I split every page into a separate PDF?",
      answer: "Select the 'Split every page' option. When you process the file, you'll receive a ZIP folder containing each page as an individual PDF.",
    },
    {
      question: "Can I extract only specific pages?",
      answer: "Yes, choose 'Extract pages' and enter the page numbers or ranges (e.g., 1-5, 8, 11-13). We will combine only those pages into a single new PDF document.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
    >
      <SplitPdfTool />
    </ToolLayout>
  );
}
