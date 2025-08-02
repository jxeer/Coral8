/**
 * Landing Page Component
 * Main public-facing page for unauthenticated users
 * Features Coral8/Cowrie ecosystem introduction with oceanic Yemaya-inspired design
 * Showcases cultural labor logging, token economics, and community governance features
 */

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { WaveAnimation } from '@/components/wave-animation';
import { ArrowRight, Waves, Coins, Users, Vote, ShoppingBag, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-navy via-ocean-blue to-seafoam">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WaveAnimation />
            <div>
              <h1 className="text-2xl font-bold text-pearl-white">Coral8</h1>
              <p className="text-sm text-moon-gray">Cowrie Ecosystem</p>
            </div>
          </div>
          <Button 
            className="bg-seafoam hover:bg-seafoam/90 text-deep-navy"
            onClick={() => window.location.href = '/auth/google'}
          >
            Sign in with Google <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-pearl-white mb-6 leading-tight">
            Where Culture Meets 
            <span className="bg-gradient-to-r from-seafoam to-ocean-teal bg-clip-text text-transparent"> Economy</span>
          </h1>
          <p className="text-xl md:text-2xl text-moon-gray mb-8 leading-relaxed">
            Log culturally rooted labor, earn COW tokens, and participate in community governance. 
            Built to honor ancestral wisdom while embracing economic innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-seafoam hover:bg-seafoam/90 text-deep-navy font-semibold px-8 py-4 text-lg"
              onClick={() => window.location.href = '/auth/google'}
            >
              Sign in with Google <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-seafoam text-seafoam hover:bg-seafoam/10 px-8 py-4 text-lg"
              onClick={() => {
                // Temporary demo mode for previewing mobile features
                localStorage.setItem('demo_mode', 'true');
                window.location.href = '/demo';
              }}
            >
              Preview Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-pearl-white mb-4">
            Reimagining Labor Through Cultural Lens
          </h2>
          <p className="text-xl text-moon-gray max-w-2xl mx-auto">
            Our platform recognizes and rewards the full spectrum of culturally significant work
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Labor Logging */}
          <div className="bg-ocean-blue/30 backdrop-blur-sm rounded-2xl p-8 border border-seafoam/20">
            <div className="w-16 h-16 bg-seafoam/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-seafoam" />
            </div>
            <h3 className="text-2xl font-bold text-pearl-white mb-4">Labor Logging</h3>
            <p className="text-moon-gray leading-relaxed">
              Track care work, cultural preservation, storytelling, and community building with proper recognition and multipliers.
            </p>
          </div>

          {/* Token Economics */}
          <div className="bg-ocean-blue/30 backdrop-blur-sm rounded-2xl p-8 border border-seafoam/20">
            <div className="w-16 h-16 bg-seafoam/20 rounded-xl flex items-center justify-center mb-6">
              <Coins className="w-8 h-8 text-seafoam" />
            </div>
            <h3 className="text-2xl font-bold text-pearl-white mb-4">COW Token Economy</h3>
            <p className="text-moon-gray leading-relaxed">
              Earn COW1, COW2, and COW3 tokens with decay mechanisms that encourage active participation in the ecosystem.
            </p>
          </div>

          {/* Community Governance */}
          <div className="bg-ocean-blue/30 backdrop-blur-sm rounded-2xl p-8 border border-seafoam/20">
            <div className="w-16 h-16 bg-seafoam/20 rounded-xl flex items-center justify-center mb-6">
              <Vote className="w-8 h-8 text-seafoam" />
            </div>
            <h3 className="text-2xl font-bold text-pearl-white mb-4">Community Governance</h3>
            <p className="text-moon-gray leading-relaxed">
              Participate in proposals that shape labor multipliers, community treasury allocation, and platform evolution.
            </p>
          </div>

          {/* Marketplace */}
          <div className="bg-ocean-blue/30 backdrop-blur-sm rounded-2xl p-8 border border-seafoam/20">
            <div className="w-16 h-16 bg-seafoam/20 rounded-xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-seafoam" />
            </div>
            <h3 className="text-2xl font-bold text-pearl-white mb-4">Cultural Marketplace</h3>
            <p className="text-moon-gray leading-relaxed">
              Trade cultural artifacts, educational materials, and community resources using COW tokens.
            </p>
          </div>

          {/* Blockchain Integration */}
          <div className="bg-ocean-blue/30 backdrop-blur-sm rounded-2xl p-8 border border-seafoam/20">
            <div className="w-16 h-16 bg-seafoam/20 rounded-xl flex items-center justify-center mb-6">
              <Waves className="w-8 h-8 text-seafoam" />
            </div>
            <h3 className="text-2xl font-bold text-pearl-white mb-4">Blockchain Connected</h3>
            <p className="text-moon-gray leading-relaxed">
              Bridge on-chain and off-chain activities in the Cowrie ecosystem with secure wallet integration.
            </p>
          </div>

          {/* Community First */}
          <div className="bg-ocean-blue/30 backdrop-blur-sm rounded-2xl p-8 border border-seafoam/20">
            <div className="w-16 h-16 bg-seafoam/20 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-seafoam" />
            </div>
            <h3 className="text-2xl font-bold text-pearl-white mb-4">Community First</h3>
            <p className="text-moon-gray leading-relaxed">
              Built with Yemaya's oceanic wisdom, honoring ancestral knowledge while creating sustainable economic models.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-seafoam/10 to-ocean-teal/10 rounded-3xl p-12 text-center border border-seafoam/20">
          <h2 className="text-4xl font-bold text-pearl-white mb-6">
            Ready to Honor Your Labor?
          </h2>
          <p className="text-xl text-moon-gray mb-8 max-w-2xl mx-auto">
            Join our community of cultural workers, storytellers, and care providers building a more equitable economy.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-seafoam hover:bg-seafoam/90 text-deep-navy font-semibold px-12 py-4 text-xl"
          >
            <Link href="/login">
              Start Your Journey <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-seafoam/20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <WaveAnimation />
            <div>
              <p className="text-pearl-white font-semibold">Coral8</p>
              <p className="text-xs text-moon-gray">Powered by Yemaya's wisdom</p>
            </div>
          </div>
          <p className="text-moon-gray text-sm">
            © 2025 Coral8. Built with respect for ancestral knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
}