import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import SplitPdfTool from "@/components/pdf/SplitPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("undefined");
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

  const seoIntro = "Extract pages or divide large PDF documents into smaller, manageable files quickly. Our local splitting tool lets you separate chapters, isolate key pages, or remove unwanted content from your PDFs while keeping your sensitive documents strictly on your device.";

  const features = [
    {
      title: "Flexible Extraction Modes",
      description: "Choose to split your document into individual pages or extract custom page ranges (e.g., 1-5, 8, 11-13)."
    },
    {
      title: "Zero Upload Times",
      description: "Experience immediate processing. Because your file is never uploaded, you skip the wait times entirely."
    },
    {
      title: "Packaged Downloads",
      description: "When splitting a document into multiple files, we automatically package them into a convenient ZIP archive for a single click download."
    },
    {
      title: "Strict Privacy",
      description: "Your confidential data remains confidential. All splitting operations occur inside your browser's local memory."
    }
  ];

  const howTo = [
    {
      step: "Upload your document",
      description: "Select the PDF file you wish to split by dragging it into the dropzone.",
    },
    {
      step: "Choose a split mode",
      description: "Select whether you want to extract specific page ranges or split every page into a separate document.",
    },
    {
      step: "Enter page ranges",
      description: "If extracting ranges, type the pages you want to keep (for example: 1-5, 8, 12).",
    },
    {
      step: "Split the PDF",
      description: "Click the action button to process the file locally.",
    },
    {
      step: "Download the pages",
      description: "Download your extracted PDF or the ZIP file containing your separated pages.",
    }
  ];

  const faq = [
    {
      question: "Will my PDF be uploaded to split it?",
      answer: "No. Your PDF file is processed entirely within your web browser. No data is transmitted to our servers.",
    },
    {
      question: "How do I specify which pages to extract?",
      answer: "You can use commas and hyphens to define ranges. For example, entering '1-3, 5, 7-10' will extract pages 1 through 3, page 5, and pages 7 through 10.",
    },
    {
      question: "What happens if I choose to split into individual pages?",
      answer: "The tool will separate every page of your PDF into its own file. To make downloading easy, all these files are bundled into a single ZIP archive.",
    },
    {
      question: "Is there a limit to how many pages I can split?",
      answer: "The only limit is your device's memory. Most modern browsers can handle splitting documents with hundreds of pages smoothly.",
    },
    {
      question: "Does splitting reduce the quality of the pages?",
      answer: "No. The splitting process simply extracts the exact data for the specified pages without re-rendering or compressing them, preserving 100% of the original quality.",
    }
  ];

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      currentSlug={tool.slug}
      faq={faq}
      howTo={howTo}
      features={features}
      seoIntro={seoIntro}
    >
      <SplitPdfTool />
    </ToolLayout>
  );
}
