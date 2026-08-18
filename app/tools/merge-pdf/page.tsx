import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import MergePdfTool from "@/components/pdf/MergePdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("merge-pdf");
  if (!tool) return {};
  
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: tool.url },
  };
}

export default function MergePdfPage() {
  const tool = getToolBySlug("merge-pdf");
  
  if (!tool) {
    notFound();
  }

  const faq = [
    {
      question: "Is my data secure?",
      answer: "Yes. All processing happens directly in your browser. Your files are never uploaded to any server.",
    },
    {
      question: "Is there a file size limit?",
      answer: "You can select up to 20 files at a time, with a maximum size of 50MB per file.",
    },
    {
      question: "Can I reorder the files before merging?",
      answer: "Yes, you can use the up and down arrows in the file list to arrange your PDFs in the desired order.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
    >
      <MergePdfTool />
    </ToolLayout>
  );
}

