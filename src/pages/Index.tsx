
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import LoginForm from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Key, 
  FileText, 
  Github, 
  Twitter, 
  Linkedin 
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Login Form Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Sign in to access your secure blockchain storage
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
      
      {/* Features Section */}
      <Features />
      
      {/* How it Works Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Key className="w-4 h-4 mr-2" /> Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Vaultify Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure your data in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number={1}
              title="Generate Your Key"
              description="Create a unique encryption key that only you will possess - this is your access credential to your encrypted data."
            />
            
            <StepCard
              number={2}
              title="Upload Your Files"
              description="Select files to upload - they'll be encrypted on your device using your key before being stored securely."
            />
            
            <StepCard
              number={3}
              title="Access Anywhere"
              description="Use your encryption key to decrypt and access your files from any device, at any time."
            />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-6 text-base rounded-lg animate-pulse-soft">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border/30">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Shield className="w-4 h-4 mr-2" /> Military-Grade Encryption
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to secure your data?
                </h2>
                <p className="text-muted-foreground">
                  Your data deserves the highest level of protection. Get started with Vaultify today.
                </p>
              </div>
              <div className="md:self-end">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full md:w-auto px-8 font-medium">
                    Start Encrypting
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6">
            <div className="text-center md:text-left">
              <div className="font-semibold text-xl flex items-center justify-center md:justify-start gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Vaultify</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Secure blockchain-based storage with end-to-end encryption and personal encryption keys.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/upload" className="hover:text-primary transition-colors">Upload</Link>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            
            <div className="flex justify-center md:justify-end gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Vaultify. All rights reserved.</p>
            <p className="mt-1">This is a College Project Demonstration. Not for production use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ 
  number, 
  title, 
  description 
}: { 
  number: number;
  title: string;
  description: string;
}) => {
  return (
    <div className="text-center p-6 rounded-xl bg-card border border-border/40 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary text-xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
