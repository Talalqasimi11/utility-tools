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
    alternates: { canonical: tool.url },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: tool.url,
      type: "website",
    },
  };
}

export default function SplitPdfPage() {
  const tool = getToolBySlug("split-pdf");
  
  if (!tool) {
    notFound();
  }

  const howTo = [
    {
      step: "Upload your PDF",
      description: "Select the PDF file you want to split by clicking the upload area.",
    },
    {
      step: "Choose a split mode",
      description: "Select whether you want to extract every page individually or specify custom page ranges (like 1-3, 5).",
    },
    {
      step: "Split and download",
      description: "Click Split PDF. The tool will process your file and generate a ZIP archive containing your extracted pages.",
    }
  ];

  const faq = [
    {
      question: "Can I extract specific pages?",
      answer: "Yes, you can enter custom ranges like '1-5, 8, 11-13' to only extract exactly what you need.",
    },
    {
      question: "Are my files processed securely?",
      answer: "Everything is processed locally in your browser. No files are ever sent to our servers.",
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
      <SplitPdfTool />
    </ToolLayout>
  );
}
