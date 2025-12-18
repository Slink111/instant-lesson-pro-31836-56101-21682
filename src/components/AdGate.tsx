import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdGateProps {
  onContinue: () => void;
}

const AdGate = ({ onContinue }: AdGateProps) => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Push ad after component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // Set ad loaded after a short delay to ensure ad renders
      setTimeout(() => setAdLoaded(true), 1500);
    } catch (e) {
      console.error('AdSense error:', e);
      setAdLoaded(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl animate-fade-in">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Study Material is Loading...</h2>
            <p className="text-muted-foreground text-sm">
              Please view our sponsor to support free education
            </p>
          </div>
          
          {/* AdSense Ad Unit */}
          <div className="flex justify-center mb-6 min-h-[250px] bg-muted/30 rounded-lg overflow-hidden">
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '250px' }}
              data-ad-client="ca-pub-9949047439363535"
              data-ad-slot="auto"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          <div className="text-center">
            <Button
              onClick={onContinue}
              disabled={!adLoaded}
              className="px-8 py-2"
              size="lg"
            >
              {adLoaded ? 'Continue to Study Material' : 'Loading...'}
            </Button>
            {!adLoaded && (
              <p className="text-xs text-muted-foreground mt-2">
                Please wait while the ad loads...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdGate;
