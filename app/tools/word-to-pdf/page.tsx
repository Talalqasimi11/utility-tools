import { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/layout/ToolLayout";
import WordToPdfTool from "@/components/pdf/WordToPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("word-to-pdf");
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

export default function WordToPdfPage() {
  const tool = getToolBySlug("word-to-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Convert your Microsoft Word documents into standard PDF files online instantly. Our browser-based extraction engine accurately reads your DOCX content and reconstructs it into a reliable PDF without requiring any server uploads, ensuring maximum privacy for your sensitive documents.";

  const features = [
    {
      title: "100% Free & Browser-Based",
      description: "Perform your Word to PDF conversions without paying fees, installing software, or even creating an account. The entire process runs securely in your web browser."
    },
    {
      title: "No Server Uploads",
      description: "Unlike other converters, PDF Toolboxx processes your file completely on your own device. We never upload your document or its contents."
    },
    {
      title: "Basic Formatting Preserved",
      description: "Our conversion engine reconstructs headings, paragraphs, bullet lists, and basic text formatting (like bold and italics) into a clean, readable PDF."
    },
    {
      title: "Multi-Page Support",
      description: "We automatically detect when text overflows the page boundaries and generate correctly paginated PDF documents with a standard A4 page format."
    }
  ];

  const howTo = [
    {
      step: "Upload your Word document",
      description: "Drag and drop the .docx file you want to convert into the upload zone above.",
    },
    {
      step: "Convert to PDF",
      description: "Click the 'Convert to PDF' button. PDF Toolboxx will instantly parse the document inside your browser.",
    },
    {
      step: "Wait for generation",
      description: "A genuine PDF file is generated natively on your device utilizing our local layout engine.",
    },
    {
      step: "Download your PDF",
      description: "Once finished, click the download button to save your newly created PDF document.",
    }
  ];

  const faq = [
    {
      question: "How do I convert Word to PDF?",
      answer: "Simply drag your .docx file into the tool above, click 'Convert to PDF', and download your ready-to-use PDF document.",
    },
    {
      question: "Can I convert DOCX to PDF for free?",
      answer: "Yes! PDF Toolboxx lets you convert Word documents into standard PDF files completely free of charge.",
    },
    {
      question: "Is my Word document uploaded?",
      answer: "No. Your files stay on your device. All OpenXML parsing and PDF generation occurs locally within your browser's memory.",
    },
    {
      question: "Does Word to PDF preserve formatting?",
      answer: "We preserve essential structural formatting, including basic paragraphs, headings, bulleted lists, and standard text styles (bold/italic). Complex elements like advanced SmartArt, intricate tables, or embedded macros are ignored to ensure a fast, readable output.",
    },
    {
      question: "Can I convert Word documents without installing Microsoft Word?",
      answer: "Yes, you do not need Microsoft Word installed on your computer. Our browser engine independently parses the document format.",
    },
    {
      question: "What Word files are supported?",
      answer: "We currently support standard modern Microsoft Word formats (.docx files). Older legacy .doc formats are not supported in this version.",
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
      <WordToPdfTool />
      
      <div className="mt-12 p-6 bg-muted/10 border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Explore More Free Tools</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">
          PDF Toolboxx offers a complete suite of browser-based utilities to help you manage and convert your documents securely.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <li>
            <Link href="/tools/pdf-to-word" className="text-primary hover:underline font-medium">
              Convert PDF to Word
            </Link> - Turn your PDFs back into editable Word documents.
          </li>
          <li>
            <Link href="/tools/compress-pdf" className="text-primary hover:underline font-medium">
              Compress PDF
            </Link> - Reduce the file size of your documents before emailing them.
          </li>
          <li>
            <Link href="/tools/merge-pdf" className="text-primary hover:underline font-medium">
              Merge PDF files
            </Link> - Combine multiple PDFs into a single, organized document.
          </li>
          <li>
            <Link href="/tools/split-pdf" className="text-primary hover:underline font-medium">
              Split PDF
            </Link> - Extract specific pages or divide a large PDF into smaller files.
          </li>
          <li>
            <Link href="/tools/jpg-to-pdf" className="text-primary hover:underline font-medium">
              Convert images to PDF
            </Link> - Turn your JPGs and PNGs into a standard PDF format.
          </li>
        </ul>
      </div>
    </ToolLayout>
  );
}
