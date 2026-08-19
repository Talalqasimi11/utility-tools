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
    alternates: { canonical: tool.url },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: tool.url,
      type: "website",
    },
  };
}

export default function CompressPdfPage() {
  const tool = getToolBySlug("compress-pdf");
  
  if (!tool) {
    notFound();
  }

  const howTo = [
    {
      step: "Upload a PDF",
      description: "Select or drag and drop a PDF file that you want to reduce in size.",
    },
    {
      step: "Select compression level",
      description: "Choose between basic, strong, or extreme compression depending on your size and quality needs.",
    },
    {
      step: "Compress and save",
      description: "Click Compress. Once the file size is reduced, you can download the optimized document.",
    }
  ];

  const faq = [
    {
      question: "Will the quality of my PDF decrease?",
      answer: "We optimize the internal structure of the PDF. Higher compression levels may slightly reduce image quality, but text remains perfectly sharp.",
    },
    {
      question: "Is there a size limit?",
      answer: "You can compress PDFs up to 50MB directly in your browser without uploading anything.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
      howTo={howTo}
    >
      <CompressPdfTool />
    </ToolLayout>
  );
}
