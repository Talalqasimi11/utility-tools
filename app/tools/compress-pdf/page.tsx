import { Metadata } from "next";
import ToolLayout from "@/components/layout/ToolLayout";
import CompressPdfTool from "@/components/pdf/CompressPdfTool";
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

export default function CompressPdfPage() {
  const tool = getToolBySlug("compress-pdf");
  
  if (!tool) {
    notFound();
  }

  const seoIntro = "Make your PDF files easier to share, email, and store. Our local PDF compressor optimizes your documents by removing unnecessary data and flattening structures, all without compromising your privacy or sending your files to an external server.";

  const features = [
    {
      title: "Optimized File Size",
      description: "Significantly reduce the storage footprint of your PDFs to bypass strict email attachment limits."
    },
    {
      title: "Immediate Results",
      description: "View the exact size reduction percentage immediately after processing completes."
    },
    {
      title: "No Server Uploads",
      description: "All compression algorithms run entirely within your web browser. Your private documents stay private."
    },
    {
      title: "Automated Optimization",
      description: "Our tool automatically selects the best compression strategies for your specific document structure."
    }
  ];

  const howTo = [
    {
      step: "Select a PDF",
      description: "Drag and drop the heavy PDF file you wish to compress into the designated area.",
    },
    {
      step: "Start compression",
      description: "Click the compress button to initiate the local optimization process.",
    },
    {
      step: "Review the savings",
      description: "Once finished, review how many megabytes were saved and the total percentage reduction.",
    },
    {
      step: "Download the file",
      description: "Save the optimized, smaller PDF document back to your device.",
    }
  ];

  const faq = [
    {
      question: "Are my files uploaded to the internet for compression?",
      answer: "No. The entire compression process takes place locally on your machine via your web browser. We never upload your documents.",
    },
    {
      question: "How does the tool reduce the PDF file size?",
      answer: "The tool optimizes the document's internal structure, removes unused objects, and restructures data streams without altering the visible content.",
    },
    {
      question: "Will the text in my PDF become blurry?",
      answer: "No, our compression focuses on optimizing the document's internal structure rather than aggressively downscaling text. Your documents will remain legible.",
    },
    {
      question: "Why did my file size not decrease significantly?",
      answer: "If a PDF is already heavily optimized or contains content that cannot be further compressed, the reduction percentage may be small.",
    },
    {
      question: "Is there a limit on the file size I can compress?",
      answer: "You can compress files up to the memory limit of your browser. For the best stability, we recommend compressing files under 50MB.",
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
      <CompressPdfTool />
    </ToolLayout>
  );
}
