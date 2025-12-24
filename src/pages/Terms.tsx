import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Topper Guide</title>
        <meta name="description" content="Terms and Conditions for using Topper Guide - Read our terms of service governing the use of our free educational platform for CBSE and ICSE students." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Link to="/" className="text-xl font-bold text-primary">
                Topper Guide
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Topper Guide ("the Website"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must not use our Website. These Terms apply to all visitors, users, and others who access or use the Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Topper Guide provides free educational study materials for CBSE and ICSE students in classes 7 through 10. Our services include but are not limited to study notes, chapter summaries, and educational content for Physics, Chemistry, and Biology subjects.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for any activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                <li>Use the Website for any unlawful purpose or in violation of any applicable laws</li>
                <li>Reproduce, distribute, or sell any content from the Website without prior written permission</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the Website's functionality</li>
                <li>Use automated systems or software to extract data from the Website</li>
                <li>Post or transmit any harmful, threatening, or objectionable content</li>
                <li>Impersonate any person or entity</li>
                <li>Use ad-blocking software that interferes with our advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this Website, including but not limited to text, graphics, logos, images, and study materials, is the property of Topper Guide or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You are granted a limited, non-exclusive, non-transferable license to access and use the Website and its content for personal, non-commercial educational purposes only. You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any content obtained from this Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Advertising</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Website displays advertisements through Google AdSense and other advertising partners. By using the Website, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                <li>Advertisements are necessary to support our free educational services</li>
                <li>You will not use ad-blocking technology while accessing the Website</li>
                <li>You will not click on advertisements fraudulently or excessively</li>
                <li>We are not responsible for the content of third-party advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Educational Content Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide accurate and up-to-date educational content, we make no warranties or representations about the accuracy, reliability, or completeness of any content on the Website. The study materials are intended to supplement, not replace, official textbooks and classroom instruction.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Students should always verify information with their teachers and official curriculum materials. We are not responsible for any academic outcomes resulting from the use of our materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Website may contain links to third-party websites or services that are not owned or controlled by Topper Guide. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Topper Guide shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                <li>Your access to or use of or inability to access or use the Website</li>
                <li>Any conduct or content of any third party on the Website</li>
                <li>Any content obtained from the Website</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to defend, indemnify, and hold harmless Topper Guide and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Website or your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your access to the Website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Website will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:legal@topperguide.com" className="text-primary hover:underline">legal@topperguide.com</a>
              </p>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <div className="flex justify-center gap-4 mb-4">
              <Link to="/about" className="hover:text-primary">About Us</Link>
              <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
            </div>
            <p>© {new Date().getFullYear()} Topper Guide. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Terms;
