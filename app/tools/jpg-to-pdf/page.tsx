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
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: tool.url,
      type: "website",
    },
  };
}

export default function JpgToPdfPage() {
  const tool = getToolBySlug("jpg-to-pdf");
  
  if (!tool) {
    notFound();
  }

  const howTo = [
    {
      step: "Select your images",
      description: "Upload one or more JPG or PNG images. You can drag and drop them into the upload area.",
    },
    {
      step: "Adjust settings",
      description: "Reorder the images if needed, and choose your preferred page size and orientation (A4, Letter, or Original).",
    },
    {
      step: "Convert to PDF",
      description: "Click Convert to PDF. Your images will be instantly combined into a single PDF document.",
    }
  ];

  const faq = [
    {
      question: "Are PNG images supported?",
      answer: "Yes, you can upload both JPG and PNG images, and even mix them together in the same document.",
    },
    {
      question: "Can I change the order of the images?",
      answer: "Absolutely. After uploading, you can use the up and down arrows to rearrange the sequence of your images before converting.",
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
      <JpgToPdfTool />
    </ToolLayout>
  );
}
