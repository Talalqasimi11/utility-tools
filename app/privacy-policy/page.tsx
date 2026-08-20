import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how PDF Toolboxx protects your privacy. All files are processed locally on your device.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 prose prose-slate">
      <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
      
      <section className="space-y-6 text-muted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-foreground mt-8">1. What PDF Toolboxx Does</h2>
        <p>PDF Toolboxx is a free, web-based suite of tools that allows users to merge, split, compress, and convert PDF files directly within their web browser.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">2. Local File Processing (No Uploads)</h2>
        <p>We believe your documents belong to you. <strong>All PDF and image processing occurs entirely locally within your web browser.</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Files are <strong>never</strong> uploaded to our servers or any third-party service.</li>
          <li>We do not have a backend API for file uploads.</li>
          <li>No document contents, text, or metadata leave your device.</li>
          <li>Generated files remain in your browser&apos;s memory until you download them.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. Website Analytics</h2>
        <p>To understand how our tools are used and to improve the user experience, we use <strong>Google Analytics</strong>. Google Analytics collects basic behavioral data when you use the website.</p>
        <p>We specifically track:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Which tools are viewed (e.g., viewing the Merge PDF page).</li>
          <li>When a file is successfully selected for processing.</li>
          <li>When processing starts, completes, or fails.</li>
          <li>Processing duration (how long a tool takes to finish).</li>
          <li>When the download button is clicked.</li>
        </ul>
        <p><strong>Crucially, we do NOT send any document contents, file names, or personal information to Google Analytics.</strong> If an error occurs, only a generic error code (like &quot;VALIDATION_ERROR&quot;) is recorded.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">4. Cookies and Local Storage</h2>
        <p>PDF Toolboxx itself does not use <code>localStorage</code>, <code>sessionStorage</code>, or set its own cookies. However, Google Analytics utilizes standard tracking cookies to distinguish unique users and sessions.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">5. Third-Party Services</h2>
        <p>Aside from Google Analytics, we do not integrate with any third-party tracking, advertising, or data collection services. We do not sell or share your behavioral data.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">6. Data Security</h2>
        <p>Because your files are never uploaded to the internet, they are naturally secure from network interception or server breaches on our end. Your files are as secure as the device and browser you are using.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">7. User Rights & Accounts</h2>
        <p>PDF Toolboxx does not require an account, subscription, or payment. Because we do not collect personal identifying information (PII) or host your files, there is no user data for us to delete or export upon request.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Changes will be posted directly on this page.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">9. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, you can reach us at: <a href="mailto:[INSERT CONTACT EMAIL HERE]" className="text-primary hover:underline">[INSERT CONTACT EMAIL HERE]</a></p>
      </section>
    </main>
  );
}
