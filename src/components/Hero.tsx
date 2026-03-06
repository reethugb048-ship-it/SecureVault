
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Small chip above heading */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-up">
            <Lock className="w-4 h-4 mr-2" /> Blockchain-powered Secure Storage
          </div>

          {/* Main heading with animated reveal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            Your Data, <span className="text-primary">Securely Encrypted</span> on the Blockchain
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-slide-up" style={{ animationDelay: '200ms' }}>
            Store your files with military-grade encryption, accessible only with your personal encryption key, all secured by blockchain technology.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-6 rounded-lg font-medium text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Start Encrypting
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-6 rounded-lg font-medium text-base">
              Learn More
            </Button>
          </div>
        </div>

        {/* Illustration */}
        <div className="mt-20 relative h-60 sm:h-80 md:h-96 lg:h-[500px] max-w-5xl mx-auto animate-slide-up">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl overflow-hidden shadow-xl">
            {/* Simulated encrypted data visualization */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-20">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute"
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`
                  }}
                >
                  {Math.random() > 0.5 ? 
                    <Lock className="text-primary/80" /> : 
                    <Key className="text-primary/80" />}
                </div>
              ))}
            </div>
            
            {/* Central shield icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Shield className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse-soft" />
            </div>
            
            {/* Dots grid pattern */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-4 p-8 opacity-20">
              {[...Array(72)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-primary rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
