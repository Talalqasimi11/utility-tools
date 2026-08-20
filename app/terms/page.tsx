import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using PDF Toolboxx.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 prose prose-slate">
      <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
      
      <section className="space-y-6 text-muted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
        <p>By accessing and using PDF Toolboxx (the &quot;Service&quot;), you accept and agree to be bound by the terms and provisions of this agreement.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">2. Description of Service</h2>
        <p>PDF Toolboxx is a suite of browser-based tools that allows you to manipulate PDF and image files locally on your device. The Service is provided free of charge, without requiring user registration.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. Acceptable Use and User Responsibility</h2>
        <p>You agree to use the Service only for lawful purposes. You are solely responsible for the files you choose to process using PDF Toolboxx. We do not monitor, review, or have access to the contents of the files you process.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">4. Service Availability & Performance</h2>
        <p>Because all processing occurs within your web browser, the performance and success of the Service depend heavily on your device&apos;s hardware, memory limits, and the specific web browser you are using. </p>
        <p><strong>We do not guarantee successful processing of any file.</strong> Large files or complex operations may cause your browser to slow down, crash, or fail to complete the task.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">5. Limitation of Liability</h2>
        <p>In no event shall PDF Toolboxx or its operators be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of the Service. This includes, but is not limited to, data loss, document corruption, or browser crashes.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">6. Intellectual Property</h2>
        <p>The Service, including its original content, features, and functionality, are owned by PDF Toolboxx. Your use of the Service does not grant you any rights to our branding, software, or design.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">7. Changes to the Service</h2>
        <p>We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">8. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at: <a href="mailto:[INSERT CONTACT EMAIL HERE]" className="text-primary hover:underline">[INSERT CONTACT EMAIL HERE]</a></p>
      </section>
    </main>
  );
}
