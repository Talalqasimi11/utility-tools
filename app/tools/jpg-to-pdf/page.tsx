import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import JpgToPdfTool from "@/components/pdf/JpgToPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("jpg-to-pdf");
  if (!tool) return {};
  
  return {
    title: "Convert JPG to PDF Locally - Fast Image Converter",
    description: "Transform your JPG, PNG, and images into a single PDF document. Drag and drop reordering, zero uploads, and complete privacy.",
    alternates: { canonical: tool.url },
    openGraph: {
      title: "Convert JPG to PDF Locally - Fast Image Converter",
      description: "Transform your JPG, PNG, and images into a single PDF document. Drag and drop reordering, zero uploads, and complete privacy.",
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

  const seoIntro = "Compile your photos, scans, and images into a professional, easily shareable PDF document. Our local converter allows you to instantly combine multiple image formats into a single file without uploading your personal photos to the cloud.";

  const features = [
    {
      title: "Multiple Format Support",
      description: "Seamlessly import JPG, JPEG, PNG, and WEBP image files."
    },
    {
      title: "Visual Reordering",
      description: "Drag and drop your images into the exact sequence you want them to appear in the final document."
    },
    {
      title: "Automatic Scaling",
      description: "Images are automatically scaled to fit standard page dimensions perfectly."
    },
    {
      title: "Private Conversion",
      description: "Your photos stay on your device. The conversion process is handled entirely by your browser."
    }
  ];

  const howTo = [
    {
      step: "Upload your images",
      description: "Drag and drop the images you want to convert into the tool area.",
    },
    {
      step: "Arrange the sequence",
      description: "Use the drag handles or arrows to order the images exactly how you want them in the PDF.",
    },
    {
      step: "Convert to PDF",
      description: "Click the convert button. Your browser will immediately begin assembling the document.",
    },
    {
      step: "Download the document",
      description: "Save the newly generated PDF containing all of your images to your device.",
    }
  ];

  const faq = [
    {
      question: "Are my photos uploaded to a server?",
      answer: "No. Your images are converted to a PDF entirely within your browser's local memory. We never see or store your photos.",
    },
    {
      question: "Which image formats are supported?",
      answer: "The tool currently supports standard web image formats, including JPG, JPEG, PNG, and WEBP.",
    },
    {
      question: "Can I rearrange the images after uploading them?",
      answer: "Yes, you can easily drag and drop the images in the list to reorder them before clicking the convert button.",
    },
    {
      question: "How many images can I convert at once?",
      answer: "You can convert multiple images at once, limited only by your browser's memory constraints. We recommend staying under 50MB of total image data for optimal performance.",
    },
    {
      question: "Will the images be stretched or distorted?",
      answer: "No. The tool automatically scales your images to fit standard page dimensions while preserving their original aspect ratio.",
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
      <JpgToPdfTool />
    </ToolLayout>
  );
}
