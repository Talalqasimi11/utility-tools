import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import JpgToPdfTool from "@/components/pdf/JpgToPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("jpg-to-pdf");
  if (!tool) return {};
  
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: tool.url },
  };
}

export default function JpgToPdfPage() {
  const tool = getToolBySlug("jpg-to-pdf");
  
  if (!tool) {
    notFound();
  }

  const faq = [
    {
      question: "Is my data secure?",
      answer: "Yes. All processing happens entirely in your browser. Your images are never uploaded to our servers or stored anywhere.",
    },
    {
      question: "Are PNG files supported?",
      answer: "Yes, you can upload both JPG/JPEG and PNG image files. They will be seamlessly converted into your PDF document.",
    },
    {
      question: "Will my images be stretched?",
      answer: "No. Your images are scaled down proportionally to fit the chosen page size (like A4 or Letter). If you select 'Original Image Size', the PDF pages will match your images exactly.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
    >
      <JpgToPdfTool />
    </ToolLayout>
  );
}

