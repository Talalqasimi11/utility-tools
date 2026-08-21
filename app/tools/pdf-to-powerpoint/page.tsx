import { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/layout/ToolLayout";
import PdfToPowerpointTool from "@/components/pdf/PdfToPowerpointTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("pdf-to-powerpoint");
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

export default function PdfToPowerpointPage() {
  const tool = getToolBySlug("pdf-to-powerpoint");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Convert your PDF pages into editable PowerPoint slides natively in your browser. PDF Toolboxx reconstructs your document text into a standard .pptx presentation without requiring you to upload your files to any external server.";

  const features = [
    {
      title: "100% Free & Local Processing",
      description: "Convert PDF to PPTX online for free. Your files are processed securely on your own device and are never uploaded to our servers."
    },
    {
      title: "Editable Text Reconstruction",
      description: "We extract selectable text from your PDF and attempt to reconstruct it into editable PowerPoint text boxes, maintaining approximate positioning."
    },
    {
      title: "One Slide per Page",
      description: "Each page of your PDF document is automatically converted into a standard 16:9 widescreen PowerPoint slide for easy presentation editing."
    },
    {
      title: "No Account Required",
      description: "Get started immediately. There are no paywalls, subscriptions, or login requirements to convert your PDFs into presentations."
    }
  ];

  const howTo = [
    {
      step: "Select your PDF",
      description: "Drag and drop the PDF you wish to convert into the upload area above.",
    },
    {
      step: "Start conversion",
      description: "Click 'Convert to PowerPoint'. The tool will locally parse your PDF and extract selectable text coordinates.",
    },
    {
      step: "Build slides",
      description: "Your document is mapped page-by-page into a standard .pptx presentation.",
    },
    {
      step: "Download presentation",
      description: "Click the download button to save your new PowerPoint presentation and start editing.",
    }
  ];

  const faq = [
    {
      question: "Can I convert PDF to PowerPoint for free?",
      answer: "Yes. PDF Toolboxx provides browser-based PDF to PowerPoint conversion without requiring a paid subscription for the tool.",
    },
    {
      question: "Can I convert PDF to PPTX online?",
      answer: "Yes. The tool generates a standard .pptx PowerPoint presentation directly in your browser, compatible with modern Microsoft Office versions.",
    },
    {
      question: "Are my PDF files uploaded?",
      answer: "No. The conversion is performed locally in your browser rather than uploading the PDF to a document-processing server. Your privacy is guaranteed.",
    },
    {
      question: "Can I edit the converted PowerPoint?",
      answer: "Text reconstructed into PowerPoint text boxes can be edited. Complex PDF elements, embedded formatting, or charts may not be perfectly editable.",
    },
    {
      question: "Does it work with scanned PDFs?",
      answer: "V1 requires selectable/extractable text. Scanned PDFs without a text layer are not supported because the tool does not perform OCR.",
    },
    {
      question: "Will the PowerPoint look exactly like the PDF?",
      answer: "Not always. The converter prioritizes editable text and approximate positioning. Complex layouts, tables, embedded fonts, vector graphics, and other advanced PDF elements may not be reproduced perfectly.",
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
      <PdfToPowerpointTool />
      
      <div className="mt-12 p-6 bg-muted/10 border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Discover More Utilities</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Need an editable Word document or spreadsheet instead? Try our other secure conversion tools.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <li>
            <Link href="/tools/pdf-to-word" className="text-primary hover:underline font-medium">
              Convert PDF to Word
            </Link> - Securely convert your PDFs into editable DOCX files.
          </li>
          <li>
            <Link href="/tools/pdf-to-excel" className="text-primary hover:underline font-medium">
              Convert PDF to Excel
            </Link> - Extract tables into an editable Excel document.
          </li>
          <li>
            <Link href="/tools/word-to-pdf" className="text-primary hover:underline font-medium">
              Convert Word to PDF
            </Link> - Convert DOCX files back into standard PDFs.
          </li>
          <li>
            <Link href="/tools/excel-to-pdf" className="text-primary hover:underline font-medium">
              Convert Excel to PDF
            </Link> - Turn XLSX spreadsheets into printable PDFs.
          </li>
          <li>
            <Link href="/tools/merge-pdf" className="text-primary hover:underline font-medium">
              Merge PDF files
            </Link> - Combine multiple documents into one.
          </li>
          <li>
            <Link href="/tools/compress-pdf" className="text-primary hover:underline font-medium">
              Compress PDF
            </Link> - Reduce your document&apos;s file size.
          </li>
        </ul>
      </div>
    </ToolLayout>
  );
}
