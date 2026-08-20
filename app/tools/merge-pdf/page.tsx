import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import MergePdfTool from "@/components/pdf/MergePdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("merge-pdf");
  if (!tool) return {};
  
  return {
    title: "Merge PDF Files Locally - Fast, Secure & Free",
    description: "Combine multiple PDF files into one document entirely in your browser. No uploads, fast processing, and completely secure.",
    alternates: { canonical: tool.url },
    openGraph: {
      title: "Merge PDF Files Locally - Fast, Secure & Free",
      description: "Combine multiple PDF files into one document entirely in your browser. No uploads, fast processing, and completely secure.",
      url: tool.url,
      type: "website",
    },
  };
}

export default function MergePdfPage() {
  const tool = getToolBySlug("merge-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Combine your PDF files effortlessly with our local merge tool. Whether you are assembling reports, joining scanned pages, or compiling invoices, our tool provides a seamless way to combine multiple documents without ever sending your sensitive data to an external server.";

  const features = [
    {
      title: "Drag and Drop Reordering",
      description: "Easily rearrange the order of your PDFs visually before merging them together."
    },
    {
      title: "Instant Processing",
      description: "Because processing happens in your browser, your files are combined almost instantly without upload delays."
    },
    {
      title: "Format Preservation",
      description: "Maintains original document quality, formatting, and text extraction capabilities."
    },
    {
      title: "No Account Needed",
      description: "Start merging files immediately. There are no subscriptions, limits, or hidden fees."
    }
  ];

  const howTo = [
    {
      step: "Select your PDF files",
      description: "Click the upload area or drag and drop the PDF files you want to combine into the dropzone.",
    },
    {
      step: "Arrange the order",
      description: "Drag the files to arrange them in the exact sequence you want them to appear in the final document.",
    },
    {
      step: "Merge your files",
      description: "Click the Merge PDFs button to initiate local processing on your device.",
    },
    {
      step: "Download the result",
      description: "Once processing finishes, download your single, combined PDF file securely.",
    }
  ];

  const faq = [
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All PDF merging happens entirely in your web browser. Your files never leave your device, ensuring complete privacy.",
    },
    {
      question: "Can I merge large PDF files?",
      answer: "Yes, you can merge large files, subject only to the memory limits of your web browser and device. We recommend staying under 50MB per file for optimal performance.",
    },
    {
      question: "Will the original quality be maintained?",
      answer: "Yes, the merging process simply concatenates the pages without altering the original text, images, or formatting.",
    },
    {
      question: "Can I reorder the files before combining them?",
      answer: "Absolutely. Once selected, you can easily drag and drop your files into any sequence before clicking the merge button.",
    },
    {
      question: "Do I need an internet connection to process the files?",
      answer: "You only need an internet connection to load the website initially. Once the tool has loaded, the actual merging is performed offline by your device.",
    },
    {
      question: "Is this tool free to use?",
      answer: "Yes, our merge tool is completely free. There are no paywalls, hidden costs, or registration requirements.",
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
      <MergePdfTool />
    </ToolLayout>
  );
}
