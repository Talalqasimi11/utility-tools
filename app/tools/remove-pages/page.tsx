import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import RemovePagesTool from "@/components/pdf/RemovePagesTool";
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

export default function RemovePagesPage() {
  const tool = getToolBySlug("remove-pages");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Easily clean up your PDF documents by removing unwanted pages. Whether you are discarding a blank page, a confidential section, or a draft cover, our local page remover lets you visually select and delete pages from your document in seconds without uploading your sensitive data to the cloud.";

  const features = [
    {
      title: "Visual Page Selection",
      description: "Preview your entire document in a grid of thumbnails to accurately select which pages to remove."
    },
    {
      title: "Instant Processing",
      description: "Because processing happens directly in your browser, your cleaned document is generated almost instantly."
    },
    {
      title: "100% Data Privacy",
      description: "Your files never leave your device. All rendering and extraction happens in your browser&apos;s local memory."
    },
    {
      title: "Quality Preserved",
      description: "The structural integrity, resolution, and text searchability of your kept pages are perfectly maintained."
    }
  ];

  const howTo = [
    {
      step: "Upload your PDF",
      description: "Drag and drop the PDF you wish to edit into the dropzone to generate a visual preview.",
    },
    {
      step: "Select pages to remove",
      description: "Click on the thumbnails of the pages you want to delete. Selected pages will be marked in red.",
    },
    {
      step: "Confirm removal",
      description: "Click the &apos;Remove Pages&apos; button to initiate the local extraction process.",
    },
    {
      step: "Download the cleaned PDF",
      description: "Instantly download your new PDF document containing only the pages you wanted to keep.",
    }
  ];

  const faq = [
    {
      question: "Will my PDF be uploaded to your servers?",
      answer: "No. The entire process of rendering the previews and extracting the final pages happens locally on your computer. Your files are completely private.",
    },
    {
      question: "Can I remove multiple pages at once?",
      answer: "Yes, you can click on as many pages as you like to mark them for removal before processing.",
    },
    {
      question: "What happens if I try to remove every page?",
      answer: "The tool requires you to keep at least one page to generate a valid PDF document.",
    },
    {
      question: "Will removing pages reduce the file size?",
      answer: "Yes, generally the file size will decrease as the objects and images associated with the removed pages are discarded from the final document.",
    },
    {
      question: "Does removing pages alter the formatting of the remaining pages?",
      answer: "No. The remaining pages are extracted exactly as they were in the original document, preserving 100% of their layout and quality.",
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
      <RemovePagesTool />
    </ToolLayout>
  );
}
