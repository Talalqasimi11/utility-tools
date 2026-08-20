import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import ReorderPdfTool from "@/components/pdf/ReorderPdfTool";
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

export default function ReorderPdfPage() {
  const tool = getToolBySlug("reorder-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Change the order of your PDF pages visually. Whether you combined documents in the wrong sequence or just need to move a specific page to the front, our local drag-and-drop tool makes rearranging pages incredibly intuitive without uploading your private files to the cloud.";

  const features = [
    {
      title: "Drag and Drop Reordering",
      description: "Visually rearrange your document by simply clicking and dragging page thumbnails into your preferred sequence."
    },
    {
      title: "Real-time Previews",
      description: "See the exact order of your document update instantly as you move pages, ensuring you get exactly what you need before saving."
    },
    {
      title: "100% Data Privacy",
      description: "We never upload your PDFs. The entire reordering process happens directly in your browser's local memory."
    },
    {
      title: "Original Quality",
      description: "Your document's text, images, dimensions, and orientation are perfectly preserved. We only change the sequence."
    }
  ];

  const howTo = [
    {
      step: "Upload your document",
      description: "Select or drag and drop the PDF file you wish to reorder into the dropzone.",
    },
    {
      step: "Drag to rearrange",
      description: "Click and hold any page thumbnail, then drag it to its new desired position in the grid.",
    },
    {
      step: "Apply your changes",
      description: "Once your pages are in the correct sequence, click the &apos;Download Reordered PDF&apos; button.",
    },
    {
      step: "Download securely",
      description: "Your browser will instantly assemble and download the new PDF without sending your data to any external server.",
    }
  ];

  const faq = [
    {
      question: "Will my PDF lose quality when reordering pages?",
      answer: "No. Our tool preserves the exact structural objects of your PDF, meaning the resolution, formatting, and searchability remain completely unchanged.",
    },
    {
      question: "Are my files uploaded to an external server?",
      answer: "No, PDF Toolboxx processes your documents entirely within your device's browser to guarantee your privacy and security.",
    },
    {
      question: "Can I move multiple pages at once?",
      answer: "Currently, you must drag and drop pages individually, but you can move as many pages as you like before downloading the final file.",
    },
    {
      question: "What if I make a mistake?",
      answer: "You can use the 'Reset Order' button at any time to instantly restore the pages to their original sequence.",
    },
    {
      question: "Does this work on mobile devices?",
      answer: "Yes, our responsive grid allows you to tap and drag pages to reorder them on modern mobile browsers.",
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
      <ReorderPdfTool />
    </ToolLayout>
  );
}
