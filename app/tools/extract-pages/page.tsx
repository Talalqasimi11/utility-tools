import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import ExtractPagesTool from "@/components/pdf/ExtractPagesTool";
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

export default function ExtractPagesPage() {
  const tool = getToolBySlug("extract-pages");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Pull specific pages out of your PDF document in seconds. Our local extract pages tool provides a highly visual grid so you can click the exact pages you want to keep and generate a new document. Since all processing runs directly in your browser, your files remain completely private and secure.";

  const features = [
    {
      title: "Interactive Grid Selection",
      description: "Preview every page in your PDF as a clear thumbnail. Easily click to select or deselect specific pages you wish to extract."
    },
    {
      title: "Select All and Clear",
      description: "Quickly manage large documents using the built-in bulk selection and clear tools, perfect for extracting almost an entire document."
    },
    {
      title: "100% Data Privacy",
      description: "Your document is rendered and processed locally on your device. We never upload your sensitive PDF to external servers."
    },
    {
      title: "Original Quality",
      description: "Extracted pages maintain their original layout, text searchability, and image resolution without degradation."
    }
  ];

  const howTo = [
    {
      step: "Upload your document",
      description: "Drag and drop the PDF you want to extract pages from into the secure dropzone.",
    },
    {
      step: "Select your pages",
      description: "Click on the thumbnails of the pages you want to extract. Use the &apos;Select All&apos; button to speed up large extractions.",
    },
    {
      step: "Click Extract",
      description: "Hit the &apos;Extract Pages&apos; button to instantly create a new PDF containing only your selected pages.",
    },
    {
      step: "Download the file",
      description: "Save the newly generated PDF to your device. Processing is completed entirely within your browser.",
    }
  ];

  const faq = [
    {
      question: "Are my files uploaded to the internet?",
      answer: "No. PDF Toolboxx processes your document directly in your browser. Your data never touches our servers.",
    },
    {
      question: "Can I extract pages out of order?",
      answer: "You can select the pages in any order you like, but the extracted PDF will automatically preserve the pages in their original sequential order.",
    },
    {
      question: "Is there a limit on how many pages I can extract?",
      answer: "You must select at least one page to extract. Beyond that, the only limit is your device&apos;s processing memory.",
    },
    {
      question: "Does extracting pages reduce quality?",
      answer: "No, extraction copies the exact objects from your original PDF, ensuring zero loss in quality or resolution.",
    },
    {
      question: "Can I extract pages from a password-protected PDF?",
      answer: "You will need to unlock the PDF first before our local tool can read the contents to generate the previews.",
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
      <ExtractPagesTool />
    </ToolLayout>
  );
}
