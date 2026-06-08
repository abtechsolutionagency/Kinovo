'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Sparkles, 
  Shield, 
  Users, 
  MapPin, 
  MessageCircle, 
  Check, 
  ChevronDown,
  Instagram,
  Twitter,
  Mail,
  QrCode,
  ArrowRight,
  Heart,
  Plane,
  Lock,
  Star,
  Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LandingNav } from '@/components/LandingNav';

export default function KinovoLandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeDestination, setActiveDestination] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const destinations = [
    {
      name: 'Ibiza',
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1550593090-b915f85b93a4?w=800&q=80',
      travelers: 401
    },
    {
      name: 'Tenerife',
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
      travelers: 189
    },
    {
      name: 'London',
      country: 'UK',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      travelers: 312
    },
    {
      name: 'Barcelona',
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&q=80',
      travelers: 256
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDestination((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      setSubmitted(true);
      toast.success('Welcome to the waitlist!');
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 5000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/50 to-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Globe2 className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Kinovo
            </span>
          </motion.div>
          
          <LandingNav joinLabel="Join Waitlist" />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
              backgroundSize: '50% 50%',
            }}
          />
        </div>

        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-200">Invite Only • Private Beta</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Travel.
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
              Connect.
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-200 via-purple-200 to-white bg-clip-text text-transparent">
              Belong.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl text-purple-200 mb-4 font-light"
          >
            A safer way for open-minded travelers
            <br className="hidden sm:block" /> to meet worldwide.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-base sm:text-lg text-purple-300/70 mb-12 max-w-2xl mx-auto"
          >
            AI-powered discovery • Real-time translation • Verified community • Premium experiences
          </motion.p>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-md mx-auto mb-8"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 h-12 px-6 rounded-full"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-8 rounded-full shadow-lg shadow-purple-500/25 whitespace-nowrap"
                  >
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-full p-4 text-emerald-300 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>You're on the list! Check your email.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-purple-300/70"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>2,847+ members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>7 destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Verified only</span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-purple-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Your Journey Starts Here
              </span>
            </h2>
            <p className="text-lg text-purple-300">Simple, safe, sophisticated</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: 'Get Invited',
                description: 'Receive an exclusive invite code or QR from an existing member. Quality over quantity.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Shield,
                title: 'Verify & Join',
                description: 'Complete our verification process. We check IDs and build trust scores for safety.',
                gradient: 'from-pink-500 to-purple-500'
              },
              {
                icon: Plane,
                title: 'Travel & Connect',
                description: 'Discover destinations, meet verified travelers, and create authentic connections worldwide.',
                gradient: 'from-purple-500 to-blue-500'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} p-0.5 mb-6`}>
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-purple-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                AI-Powered Discovery
              </span>
            </h2>
            <p className="text-lg text-purple-300">Smart technology, human connection</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Travel Concierge',
                features: [
                  'Personalized nightlife recommendations',
                  'Compatible traveler matching',
                  'Local hidden gems discovery',
                  'Real-time travel assistance'
                ]
              },
              {
                icon: Globe,
                title: 'Real-Time Translation',
                features: [
                  'Automatic message translation',
                  '7 supported languages',
                  'Cultural context awareness',
                  'Seamless global communication'
                ]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-purple-200">
                      <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Verification */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-200 to-purple-200 bg-clip-text text-transparent">
                Safety First, Always
              </span>
            </h2>
            <p className="text-lg text-purple-300 max-w-2xl mx-auto">
              Your security and privacy are our top priorities. We've built multiple layers of protection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'ID Verification', desc: 'Government ID check' },
              { icon: Star, title: 'Trust Scores', desc: 'Community reputation' },
              { icon: Lock, title: 'Privacy Controls', desc: 'You control your data' },
              { icon: Users, title: 'Moderation', desc: '24/7 safety team' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 mb-4">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-purple-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Showcase */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Explore the World
              </span>
            </h2>
            <p className="text-lg text-purple-300">Meet travelers in the world's most exciting cities</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setActiveDestination(index)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-purple-300 text-sm mb-3">{dest.country}</p>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{dest.travelers} travelers</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-purple-600/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Button className="bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 mb-6">
              <Heart className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Join a Global Community
              </span>
            </h2>
            <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto">
              Connect with open-minded travelers who share your values. From beach parties in Ibiza to cultural experiences in Barcelona – find your tribe.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Countries', value: '42+' },
                { label: 'Events Monthly', value: '200+' },
                { label: 'Connections Made', value: '15k+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">{stat.value}</div>
                  <div className="text-purple-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Ready to Belong?
              </span>
            </h2>
            <p className="text-lg text-purple-300 mb-8">
              Join the waitlist and be among the first to experience a new way of travel and connection.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 h-12 px-6 rounded-full"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-8 rounded-full shadow-lg shadow-purple-500/25"
              >
                Join Now
              </Button>
            </form>

            <p className="text-sm text-purple-400">
              🔒 Invite-only platform • Verified members • Premium experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kinovo
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
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