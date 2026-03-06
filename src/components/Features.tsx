
import { Shield, Lock, Key, RefreshCw, Database, Fingerprint } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container px-4 mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4 mr-2" /> Advanced Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Vaultify?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our blockchain-based storage solution offers unparalleled security and control over your data.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Lock className="h-6 w-6 text-primary" />}
            title="End-to-End Encryption"
            description="Your data is encrypted on your device before being stored, ensuring only you can access the unencrypted content."
          />
          
          <FeatureCard
            icon={<Database className="h-6 w-6 text-primary" />}
            title="Blockchain Security"
            description="Leverage the power of blockchain technology to ensure your data remains tamper-proof and verifiable."
          />
          
          <FeatureCard
            icon={<Key className="h-6 w-6 text-primary" />}
            title="Personal Encryption Keys"
            description="Control access with your unique encryption key, similar to cryptocurrency wallets for maximum security."
          />
          
          <FeatureCard
            icon={<RefreshCw className="h-6 w-6 text-primary" />}
            title="Decentralized Storage"
            description="Your encrypted data is stored across a distributed network, eliminating single points of failure."
          />
          
          <FeatureCard
            icon={<Fingerprint className="h-6 w-6 text-primary" />}
            title="Complete Privacy"
            description="No one, not even us, can access your unencrypted data without your encryption key."
          />
          
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Data Integrity"
            description="Cryptographic verification ensures your data remains exactly as you stored it, with no silent corruption or tampering."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 rounded-xl bg-background shadow-sm border border-border/40 hover:shadow-md hover:border-primary/20 transition-all">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Features;
