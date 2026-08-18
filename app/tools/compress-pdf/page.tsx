import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import CompressPdfTool from "@/components/pdf/CompressPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("compress-pdf");
  if (!tool) return {};
  
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
  };
}

export default function CompressPdfPage() {
  const tool = getToolBySlug("compress-pdf");
  
  if (!tool) {
    notFound();
  }

  const faq = [
    {
      question: "Is my data secure?",
      answer: "Yes. All compression happens directly in your browser. Your files are never uploaded to any server.",
    },
    {
      question: "How does the compression work?",
      answer: "Our tool removes unreferenced objects, orphaned data, and compresses the structural data of your PDF to reduce the overall file size.",
    },
    {
      question: "Why did my PDF not get smaller?",
      answer: "If a PDF is already heavily optimized or consists primarily of large images that cannot be further compressed in-browser, the file size will not decrease. We will notify you if your PDF cannot be reduced further.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
    >
      <CompressPdfTool />
    </ToolLayout>
  );
}
