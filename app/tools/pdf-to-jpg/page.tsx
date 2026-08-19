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
    alternates: { canonical: tool.url },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: tool.url,
      type: "website",
    },
  };
}

export default function PdfToJpgPage() {
  const tool = getToolBySlug("pdf-to-jpg");
  
  if (!tool) {
    notFound();
  }

  const howTo = [
    {
      step: "Upload your PDF",
      description: "Select the PDF document you want to convert into images.",
    },
    {
      step: "Select conversion options",
      description: "Choose whether to extract all pages or specific ranges. You can also adjust the image quality and scale.",
    },
    {
      step: "Convert and download",
      description: "Click Convert. The tool will process the pages and provide a ZIP file containing your high-quality JPG images.",
    }
  ];

  const faq = [
    {
      question: "Will the extracted images be high quality?",
      answer: "Yes, you can select the scale multiplier (up to 2x) to ensure the extracted JPGs are crisp and high resolution.",
    },
    {
      question: "Is this tool safe to use with sensitive documents?",
      answer: "Yes, because all processing happens on your device using WebAssembly. Your PDF is never uploaded to any server.",
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
      <PdfToJpgTool />
    </ToolLayout>
  );
}
