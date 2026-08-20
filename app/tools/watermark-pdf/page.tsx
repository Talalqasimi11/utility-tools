import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import WatermarkPdfTool from "@/components/pdf/WatermarkPdfTool";
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

export default function WatermarkPdfPage() {
  const tool = getToolBySlug("watermark-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Protect your intellectual property or classify sensitive documents by instantly adding custom text watermarks. Our fast, secure, and fully browser-based watermarking tool gives you precise control over your text's size, rotation, opacity, and positioning without uploading your files to any server.";

  const features = [
    {
      title: "Real-Time Visual Preview",
      description: "See exactly how your watermark will look on every page of your PDF instantly as you adjust opacity, rotation, and positioning."
    },
    {
      title: "Selective Watermarking",
      description: "Choose to stamp your entire document automatically, or manually select specific pages to watermark while leaving others untouched."
    },
    {
      title: "100% Data Privacy",
      description: "Your confidential documents never leave your computer. The entire text rendering process runs locally on your device."
    },
    {
      title: "Customizable Alignment",
      description: "Precisely anchor your text to the center, corners, or margins of your document to fit your formatting perfectly."
    }
  ];

  const howTo = [
    {
      step: "Upload your document",
      description: "Select the PDF file you wish to protect and drop it into our secure browser tool.",
    },
    {
      step: "Configure your text",
      description: "Type your watermark text (e.g., 'CONFIDENTIAL' or 'DRAFT') and adjust the font size, opacity, and rotation.",
    },
    {
      step: "Select pages and position",
      description: "Choose where the watermark should appear on the page and select which specific pages should receive the stamp.",
    },
    {
      step: "Apply and Download",
      description: "Click 'Apply Watermark' to instantly stamp the PDF and save it back to your device.",
    }
  ];

  const faq = [
    {
      question: "Are my files uploaded to an external server?",
      answer: "No. PDF Toolboxx processes your documents entirely within your device's browser to guarantee your privacy and security.",
    },
    {
      question: "Can I use an image or logo as a watermark?",
      answer: "Currently, our tool supports fully customizable text-based watermarks. Image watermarks will be supported in a future update.",
    },
    {
      question: "How do I make the watermark less distracting?",
      answer: "You can use the opacity slider to make the text semi-transparent, allowing the original document content to remain perfectly readable underneath.",
    },
    {
      question: "Can I watermark just the first page?",
      answer: "Yes, you can toggle the 'Apply To' setting from 'All Pages' to 'Selected' and click only the thumbnail of the first page.",
    },
    {
      question: "Does adding a watermark ruin the PDF quality?",
      answer: "No, our tool writes the watermark natively as vector text without re-compressing or rasterizing your original document, preserving exact quality.",
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
      <WatermarkPdfTool />
    </ToolLayout>
  );
}
