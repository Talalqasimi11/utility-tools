import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import PdfToJpgTool from "@/components/pdf/PdfToJpgTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("pdf-to-jpg");
  if (!tool) return {};
  
  return {
    title: "Convert PDF to JPG Locally - Extract High Quality Images",
    description: "Extract images from PDF documents or convert full pages to JPG formats in your browser. Fast, secure, and requires no uploads.",
    alternates: { canonical: tool.url },
    openGraph: {
      title: "Convert PDF to JPG Locally - Extract High Quality Images",
      description: "Extract images from PDF documents or convert full pages to JPG formats in your browser. Fast, secure, and requires no uploads.",
      url: tool.url,
      type: "website",
    },
  };
}

export default function PdfToJpgPage() {
  const tool = getToolBySlug("pdf-to-jpg");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Turn your PDF documents into high-quality image files instantly. Whether you need to extract specific visuals or convert entire pages into shareable JPGs, our local extraction tool handles the job quickly and securely without uploading your documents to the cloud.";

  const features = [
    {
      title: "Flexible Conversion Modes",
      description: "Choose to convert every page of your PDF into an image, or selectively extract specific page ranges."
    },
    {
      title: "Adjustable Quality",
      description: "Select between low, medium, and high quality outputs to balance visual fidelity with file size."
    },
    {
      title: "Convenient ZIP Archives",
      description: "When converting multiple pages, the tool automatically packages all generated images into a single ZIP file for easy downloading."
    },
    {
      title: "100% Local Processing",
      description: "The rendering and extraction processes occur entirely within your web browser to ensure your data remains completely private."
    }
  ];

  const howTo = [
    {
      step: "Select a PDF file",
      description: "Drag and drop the PDF you want to convert into the designated area.",
    },
    {
      step: "Configure the settings",
      description: "Choose whether to extract all pages or specific ranges, and select your preferred image quality.",
    },
    {
      step: "Convert the document",
      description: "Click the convert button. Your browser will render the PDF pages into image formats locally.",
    },
    {
      step: "Download the images",
      description: "Download the generated JPG images, which will be conveniently bundled into a ZIP file if multiple pages were extracted.",
    }
  ];

  const faq = [
    {
      question: "Are my documents uploaded to a server for extraction?",
      answer: "No. The entire process of rendering the PDF and converting it to JPGs happens locally on your computer. Your files are never uploaded.",
    },
    {
      question: "What format will the extracted images be in?",
      answer: "The tool converts your PDF pages into standard JPG image files.",
    },
    {
      question: "How do I extract only specific pages?",
      answer: "You can select the 'Specific pages' option and input the ranges you need, such as '1-5, 8, 12'.",
    },
    {
      question: "What does the quality setting change?",
      answer: "The quality setting adjusts the scale and resolution at which the PDF pages are rendered. Higher quality results in crisper images but larger file sizes.",
    },
    {
      question: "Will the images be downloaded individually?",
      answer: "If you extract a single page, it will download as a standard JPG file. If you extract multiple pages, they will be bundled together in a single ZIP archive for convenience.",
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
      <PdfToJpgTool />
    </ToolLayout>
  );
}
