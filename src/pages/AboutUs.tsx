import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Topper Guide - Free CBSE & ICSE Study Materials</title>
        <meta name="description" content="Learn about Topper Guide - India's trusted platform for free CBSE and ICSE study materials for classes 7-10. Our mission is to make quality education accessible to all." />
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
          <h1 className="text-4xl font-bold mb-8">About Us</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Welcome to Topper Guide</h2>
              <p className="text-muted-foreground leading-relaxed">
                Topper Guide is India's premier online education platform dedicated to providing free, high-quality study materials for CBSE and ICSE students in classes 7 through 10. Our mission is to democratize education and ensure that every student, regardless of their socioeconomic background, has access to comprehensive learning resources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that quality education should be accessible to all. Our mission is to bridge the educational gap by providing meticulously crafted study materials that align with the latest CBSE and ICSE curricula. We aim to empower students to excel in their academic pursuits and build a strong foundation for their future.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Comprehensive study notes for Physics, Chemistry, and Biology</li>
                <li>Chapter-wise organized content for easy navigation</li>
                <li>Curriculum-aligned materials for CBSE and ICSE boards</li>
                <li>Coverage for classes 7, 8, 9, and 10</li>
                <li>Regularly updated content to match current syllabi</li>
                <li>Free access to all study materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-muted-foreground leading-relaxed">
                Topper Guide is managed by a dedicated team of educators, content creators, and technology enthusiasts who are passionate about making education accessible. Our content is created and reviewed by experienced teachers and subject matter experts to ensure accuracy and relevance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Accessibility:</strong> Education for everyone, everywhere</li>
                <li><strong>Quality:</strong> Accurate, comprehensive, and up-to-date content</li>
                <li><strong>Student-First:</strong> Designed with students' needs in mind</li>
                <li><strong>Integrity:</strong> Honest and transparent in all our practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                We value your feedback and are always looking to improve. If you have any questions, suggestions, or concerns, please don't hesitate to reach out to us.
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:contact@topperguide.com" className="text-primary hover:underline">contact@topperguide.com</a>
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

export default AboutUs;
