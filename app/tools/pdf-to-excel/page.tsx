import { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/layout/ToolLayout";
import PdfToExcelTool from "@/components/pdf/PdfToExcelTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("pdf-to-excel");
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

export default function PdfToExcelPage() {
  const tool = getToolBySlug("pdf-to-excel");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Transform static PDF tables and structured text into fully editable Microsoft Excel spreadsheets. PDF Toolboxx reconstructs your document data directly in your browser, maintaining strict privacy without requiring any files to be uploaded to an external server.";

  const features = [
    {
      title: "Free Browser Processing",
      description: "Convert your PDF files to Excel natively in your web browser. No software installation, no fees, and no account required."
    },
    {
      title: "Data Privacy Guaranteed",
      description: "Unlike cloud converters, we process your documents locally. Your financial data, invoices, and private tables never leave your device."
    },
    {
      title: "Intelligent Table Extraction",
      description: "Our layout engine analyzes the visual structure of your PDF to reconstruct rows and columns, saving you hours of manual data entry."
    },
    {
      title: "Multi-Page Workbook Generation",
      description: "When you upload a multi-page PDF, the tool automatically generates a standard .xlsx workbook with a dedicated worksheet for every extracted page."
    }
  ];

  const howTo = [
    {
      step: "Select your PDF",
      description: "Drag and drop the PDF file containing your tables into the upload box.",
    },
    {
      step: "Extract data",
      description: "Click 'Convert to Excel'. The local engine will scan the document's coordinates to identify rows and columns.",
    },
    {
      step: "Generate XLSX",
      description: "Your data is instantly compiled into a genuine Microsoft Excel file right inside your browser.",
    },
    {
      step: "Download spreadsheet",
      description: "Click the download button to save the resulting .xlsx file and begin editing your data.",
    }
  ];

  const faq = [
    {
      question: "How do I convert PDF to Excel?",
      answer: "Upload your PDF into the designated area above, click the convert button, and download your finished Excel spreadsheet instantly.",
    },
    {
      question: "Can I convert PDF to XLSX for free?",
      answer: "Yes, PDF Toolboxx offers this functionality entirely for free with no hidden limits or premium paywalls.",
    },
    {
      question: "Does PDF Toolboxx upload my PDF?",
      answer: "No. Your privacy is our priority. Your PDF files are processed directly on your computer's local memory and are never transmitted to our servers.",
    },
    {
      question: "Can I convert PDF tables to Excel?",
      answer: "Yes, our extraction engine analyzes the text positioning in your PDF to reconstruct rows and columns, making it easy to export tabular data.",
    },
    {
      question: "Can I convert scanned PDFs?",
      answer: "Our current version works best with text-based PDFs (documents generated from Word, Excel, or digital printers). Scanned, image-only PDFs without readable text layers are not currently supported as they require advanced optical character recognition (OCR).",
    },
    {
      question: "Will the Excel file preserve the original PDF formatting?",
      answer: "Our tool reconstructs the table structure (rows and columns) to prioritize data correctness. While the text is extracted accurately, complex formatting such as cell colors, merged headers, or advanced graphics may not be perfectly reproduced in the spreadsheet.",
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
      <PdfToExcelTool />
      
      <div className="mt-12 p-6 bg-muted/10 border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Discover More Utilities</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Need to perform other document conversions? PDF Toolboxx provides a comprehensive suite of secure, local tools.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <li>
            <Link href="/tools/pdf-to-word" className="text-primary hover:underline font-medium">
              Convert PDF to Word
            </Link> - Extract text into an editable Word document.
          </li>
          <li>
            <Link href="/tools/word-to-pdf" className="text-primary hover:underline font-medium">
              Convert Word to PDF
            </Link> - Securely convert DOCX files into standard PDFs.
          </li>
          <li>
            <Link href="/tools/compress-pdf" className="text-primary hover:underline font-medium">
              Compress PDF
            </Link> - Reduce your document&apos;s file size for easy sharing.
          </li>
          <li>
            <Link href="/tools/split-pdf" className="text-primary hover:underline font-medium">
              Split PDF
            </Link> - Extract specific pages from a large document.
          </li>
          <li>
            <Link href="/tools/merge-pdf" className="text-primary hover:underline font-medium">
              Merge PDF files
            </Link> - Combine multiple documents into one.
          </li>
          <li>
            <Link href="/tools/pdf-to-jpg" className="text-primary hover:underline font-medium">
              Convert PDF pages to images
            </Link> - Turn your PDF into easily shareable JPGs.
          </li>
        </ul>
      </div>
    </ToolLayout>
  );
}
