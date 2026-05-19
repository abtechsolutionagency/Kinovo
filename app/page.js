'use client';

import { motion } from 'framer-motion';
import { Globe, Shield, Sparkles, Users, MessageCircle, MapPin, Crown, QrCode, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { mockDestinations } from '@/lib/mockData';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Globe className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kinovo
            </span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Join Beta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Private Beta • Invite Only
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Travel. Connect.
              <br />
              Belong.
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 mb-4 max-w-3xl mx-auto">
              A safer way for open-minded travelers to meet worldwide.
            </p>
            
            <p className="text-lg text-purple-300/70 mb-12 max-w-2xl mx-auto">
              AI-powered travel discovery • Real-time translation • Verified community • Premium experiences
            </p>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto mb-8"
            >
              {!submitted ? (
                <form onSubmit={handleWaitlist} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white whitespace-nowrap"
                  >
                    Join Waitlist
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-300"
                >
                  ✓ You're on the list! Check your email.
                </motion.div>
              )}
            </motion.div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-purple-300/70">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>2,847 members</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>7 destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Verified only</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destination Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Your Next Adventure
            </h2>
            <p className="text-purple-300 text-lg">
              Connect with travelers in the world's most exciting destinations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDestinations.slice(0, 4).map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-purple-300 text-sm mb-3">
                      {destination.description}
                    </p>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{destination.travelers} travelers</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                AI Travel Concierge
              </h3>
              <p className="text-purple-300">
                Get personalized recommendations for nightlife, social spots, and compatible travelers nearby.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Real-Time Translation
              </h3>
              <p className="text-purple-300">
                Connect across languages with automatic message translation in 7 languages.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Verified & Safe
              </h3>
              <p className="text-purple-300">
                Trust scores, verification badges, and community standards keep everyone safe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-12 text-center"
          >
            <QrCode className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Invite Friends & Earn Rewards
            </h2>
            <p className="text-purple-300 text-lg mb-8 max-w-2xl mx-auto">
              Share your unique invite code or QR to help friends join the community. Earn premium features as an ambassador.
            </p>
            <Button className="bg-white text-purple-900 hover:bg-purple-50">
              Get Your Invite Code
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Premium Tiers */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Experience
            </h2>
            <p className="text-purple-300 text-lg">
              Start free, upgrade anytime
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-purple-400 mb-6">£0</div>
              <ul className="space-y-3 text-purple-300">
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Browse destinations
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Basic messaging
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Join travel groups
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg border border-pink-500/30 rounded-2xl p-8 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Lite</h3>
              <div className="text-4xl font-bold text-pink-400 mb-6">£4.99</div>
              <ul className="space-y-3 text-purple-300">
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  AI concierge (10/day)
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Real-time translation
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Advanced filters
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Premium</h3>
              </div>
              <div className="text-4xl font-bold text-purple-300 mb-6">£9.99</div>
              <ul className="space-y-3 text-purple-300">
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Everything in Lite
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Unlimited AI concierge
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Anonymous browsing
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Profile boosts
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Private galleries
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-purple-300">
                <li><Link href="#" className="hover:text-purple-400">Features</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Premium</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Destinations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-purple-300">
                <li><Link href="/safety" className="hover:text-purple-400">Safety Center</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Guidelines</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-purple-300">
                <li><Link href="#" className="hover:text-purple-400">About</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Blog</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-purple-300">
                <li><Link href="#" className="hover:text-purple-400">Privacy</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Terms</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-purple-500/20">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Globe className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kinovo
              </span>
            </div>
            <p className="text-purple-400 text-sm">
              © 2025 Kinovo. Travel responsibly, connect safely.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
