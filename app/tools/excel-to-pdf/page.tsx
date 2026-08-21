import { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/layout/ToolLayout";
import ExcelToPdfTool from "@/components/pdf/ExcelToPdfTool";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("excel-to-pdf");
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

export default function ExcelToPdfPage() {
  const tool = getToolBySlug("excel-to-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Convert your Microsoft Excel spreadsheets into clean, printable PDF documents directly in your browser. PDF Toolboxx reconstructs your tables into a readable PDF format without ever uploading your private files to an external server.";

  const features = [
    {
      title: "100% Free & Browser-Based",
      description: "Perform your Excel to PDF conversions without paying fees, installing software, or creating an account."
    },
    {
      title: "Complete Data Privacy",
      description: "Unlike cloud converters, we process your spreadsheets locally. Your financial data, invoices, and private tables never leave your device."
    },
    {
      title: "Smart Text Wrapping",
      description: "Long cell values automatically wrap onto multiple lines, ensuring your data is never cut off on the resulting PDF."
    },
    {
      title: "Multi-Sheet Support",
      description: "Our converter processes all worksheets inside your workbook, automatically paginating and generating headers for a professional output."
    }
  ];

  const howTo = [
    {
      step: "Select your Excel file",
      description: "Drag and drop the .xlsx or .xls file containing your spreadsheet into the upload box.",
    },
    {
      step: "Start conversion",
      description: "Click 'Convert to PDF'. The local engine will parse your workbook and calculate column widths.",
    },
    {
      step: "Generate PDF",
      description: "Your spreadsheet data is instantly rendered into a clean, properly paginated PDF document right inside your browser.",
    },
    {
      step: "Download document",
      description: "Click the download button to save the resulting .pdf file and easily share your data.",
    }
  ];

  const faq = [
    {
      question: "How do I convert Excel to PDF?",
      answer: "Upload your Excel file into the designated area above, click the convert button, and download your finished PDF instantly.",
    },
    {
      question: "Can I convert XLSX to PDF for free?",
      answer: "Yes, PDF Toolboxx offers this functionality entirely for free with no hidden limits or premium paywalls.",
    },
    {
      question: "Does this Excel to PDF converter upload my file?",
      answer: "No. Your privacy is our priority. Your Excel files are processed directly on your computer's local memory and are never transmitted to our servers.",
    },
    {
      question: "Can I convert multiple worksheets?",
      answer: "Yes, our tool extracts data from all valid worksheets in your workbook and automatically renders them as logical sections within the final PDF.",
    },
    {
      question: "Does Excel to PDF preserve formatting?",
      answer: "Our tool extracts the core cell data and reconstructs it into a clean, readable PDF table optimized for printing. Complex formatting like custom colors, charts, or merged cells may be simplified to guarantee readability.",
    },
    {
      question: "Can I convert large Excel files?",
      answer: "Yes, though very large spreadsheets with thousands of rows will take longer to process since the conversion happens directly on your device.",
    },
    {
      question: "Can I convert XLS files?",
      answer: "Yes, both modern .xlsx and older .xls formats are supported.",
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
      <ExcelToPdfTool />
      
      <div className="mt-12 p-6 bg-muted/10 border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Discover More Utilities</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Need to perform other document conversions? PDF Toolboxx provides a comprehensive suite of secure, local tools.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <li>
            <Link href="/tools/pdf-to-excel" className="text-primary hover:underline font-medium">
              Convert PDF to Excel
            </Link> - Extract tables into an editable Excel document.
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
