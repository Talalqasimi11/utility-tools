import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import RotatePdfTool from "@/components/pdf/RotatePdfTool";
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

export default function RotatePdfPage() {
  const tool = getToolBySlug("rotate-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Fix upside-down or sideways pages in your PDF instantly. Whether you scanned a document in the wrong orientation or received a poorly formatted file, our local PDF rotator lets you adjust individual pages or the entire document securely within your browser.";

  const features = [
    {
      title: "Per-Page Rotation",
      description: "Easily rotate specific pages while leaving the rest of the document untouched using our visual grid interface."
    },
    {
      title: "Bulk Adjustments",
      description: "Rotate selected pages simultaneously or quickly turn the entire document clockwise or counter-clockwise with a single click."
    },
    {
      title: "100% Data Privacy",
      description: "We never upload your PDF to our servers. All rendering and rotation is processed locally on your device for absolute security."
    },
    {
      title: "Preserved Quality",
      description: "Rotation permanently corrects the document's orientation metadata without rasterizing or degrading the quality of your text and images."
    }
  ];

  const howTo = [
    {
      step: "Upload your document",
      description: "Drag and drop the PDF you need to rotate into the designated area.",
    },
    {
      step: "Adjust page orientation",
      description: "Hover over individual thumbnails to rotate them, or use the bulk action buttons at the top to rotate selected pages or the entire document.",
    },
    {
      step: "Apply changes",
      description: "Click the &apos;Download Rotated PDF&apos; button once your pages are facing the right way.",
    },
    {
      step: "Download securely",
      description: "Instantly save your corrected PDF back to your device without any server processing delays.",
    }
  ];

  const faq = [
    {
      question: "Is this tool completely free to use?",
      answer: "Yes, our PDF rotation tool is 100% free with no hidden fees or watermarks.",
    },
    {
      question: "Are my files uploaded to the cloud?",
      answer: "No. All rotations are performed locally inside your browser utilizing your device&apos;s processing power, ensuring your files never leave your computer.",
    },
    {
      question: "Will rotating pages decrease the PDF quality?",
      answer: "No, the tool updates the structural orientation data of the PDF without re-compressing or modifying the actual content, preserving its original quality perfectly.",
    },
    {
      question: "Can I rotate just one page instead of the whole document?",
      answer: "Absolutely. You can use the rotation buttons on individual page thumbnails, or select multiple specific pages and rotate only those.",
    },
    {
      question: "What happens if a page was already rotated?",
      answer: "Our tool respects the existing rotation. If a page is already rotated 90 degrees and you rotate it another 90 degrees, it will correctly save as 180 degrees.",
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
      <RotatePdfTool />
    </ToolLayout>
  );
}
