import { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/layout/ToolLayout";
import PdfToWordTool from "@/components/pdf/PdfToWordTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("pdf-to-word");
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

export default function PdfToWordPage() {
  const tool = getToolBySlug("pdf-to-word");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Easily convert your non-editable PDF documents into Microsoft Word (.docx) format while maintaining data privacy. By processing the text directly inside your browser, PDF Toolboxx eliminates the need to upload your sensitive information to external servers.";

  const features = [
    {
      title: "100% Free & Browser-Based",
      description: "Convert PDFs without paying, installing software, or even creating an account. The entire process runs securely in your web browser."
    },
    {
      title: "Editable Word Output",
      description: "We extract text, assemble lines, and reconstruct paragraphs so you can easily edit the contents natively in Microsoft Word or LibreOffice."
    },
    {
      title: "Multi-Page Support",
      description: "Upload large multi-page PDF documents. Our tool automatically preserves page boundaries and generates a properly structured Word file."
    },
    {
      title: "Basic Formatting Preservation",
      description: "Our text extraction attempts to approximate readable paragraph structures and retain general reading order."
    }
  ];

  const howTo = [
    {
      step: "Upload your PDF",
      description: "Drag and drop the PDF you want to convert into the upload zone above.",
    },
    {
      step: "Start the conversion",
      description: "Click the 'Convert to Word' button. PDF Toolboxx will instantly begin extracting the document content.",
    },
    {
      step: "Wait for processing",
      description: "A Word document (.docx) is generated directly on your device utilizing our local text-reconstruction engine.",
    },
    {
      step: "Download the DOCX file",
      description: "Once finished, click the download button to save your new editable Word document.",
    }
  ];

  const faq = [
    {
      question: "How do I convert a PDF to Word?",
      answer: "Simply drag and drop your PDF into our tool, click 'Convert to Word', and download the resulting .docx file.",
    },
    {
      question: "Can I convert PDF to DOCX for free?",
      answer: "Yes! PDF Toolboxx allows you to convert PDF files into editable Microsoft Word documents completely free of charge.",
    },
    {
      question: "Is my PDF uploaded to a server?",
      answer: "No. Your PDF never leaves your device. All text extraction and DOCX generation happens securely inside your browser's local memory.",
    },
    {
      question: "Can I edit the converted Word document?",
      answer: "Absolutely. The resulting file is a standard OpenXML DOCX document, meaning you can easily edit the text in Microsoft Word, Google Docs, or LibreOffice.",
    },
    {
      question: "Does the converter preserve formatting?",
      answer: "We aim to preserve standard paragraphs, page breaks, and basic text styling. Complex layouts, intricate tables, and advanced graphics may require manual adjustments after conversion.",
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
      <PdfToWordTool />
      
      <div className="mt-12 p-6 bg-muted/10 border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Keep Working With Your Files</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Need to do more than just convert your PDF to Word? PDF Toolboxx offers a full suite of free, secure, browser-based utilities.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <li>
            <Link href="/tools/compress-pdf" className="text-primary hover:underline font-medium">
              Compress a PDF
            </Link> - Reduce the file size of your documents before emailing them.
          </li>
          <li>
            <Link href="/tools/merge-pdf" className="text-primary hover:underline font-medium">
              Merge PDF files
            </Link> - Combine multiple PDFs into a single, organized document.
          </li>
          <li>
            <Link href="/tools/split-pdf" className="text-primary hover:underline font-medium">
              Split a PDF
            </Link> - Extract specific pages or divide a large PDF into smaller files.
          </li>
          <li>
            <Link href="/tools/jpg-to-pdf" className="text-primary hover:underline font-medium">
              Convert Images to PDF
            </Link> - Turn your JPGs and PNGs back into a standard PDF format.
          </li>
        </ul>
      </div>
    </ToolLayout>
  );
}
