'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Users, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
        <Link href="/">
          <Button variant="ghost" className="text-purple-300 hover:text-purple-200 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Safety Center</h1>
            <p className="text-purple-300 text-sm">Your safety is our priority</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 max-w-3xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-xl p-6 cursor-pointer hover:border-red-500/50 transition-all"
          >
            <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Report an Issue</h3>
            <p className="text-red-300 text-sm">Report inappropriate behavior or content</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-500/10 backdrop-blur-lg border border-blue-500/30 rounded-xl p-6 cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <Lock className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Block Someone</h3>
            <p className="text-blue-300 text-sm">Manage your blocked users list</p>
          </motion.div>
        </div>

        {/* Community Standards */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Community Standards</h2>
          </div>
          
          <div className="space-y-4 text-purple-200">
            <div>
              <h3 className="font-semibold text-white mb-2">✓ Respect & Consent</h3>
              <p className="text-sm">
                Always treat others with respect. Consent is mandatory in all interactions. No means no.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">✓ Honesty & Authenticity</h3>
              <p className="text-sm">
                Be honest about your intentions. Use real photos. No catfishing or deceptive behavior.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">✓ Privacy & Discretion</h3>
              <p className="text-sm">
                Respect others' privacy. Don't share personal information or content without permission.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">✓ Safe Meetings</h3>
              <p className="text-sm">
                Meet in public places first. Let friends know your plans. Trust your instincts.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Safety Tips</h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1" className="bg-white/5 border border-purple-500/20 rounded-lg px-4">
              <AccordionTrigger className="text-white hover:text-purple-300">
                Before Meeting
              </AccordionTrigger>
              <AccordionContent className="text-purple-300 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Video chat first to verify identity</li>
                  <li>Meet in public, well-lit places</li>
                  <li>Tell a friend where you're going</li>
                  <li>Arrange your own transportation</li>
                  <li>Research the venue beforehand</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white/5 border border-purple-500/20 rounded-lg px-4">
              <AccordionTrigger className="text-white hover:text-purple-300">
                During Meetings
              </AccordionTrigger>
              <AccordionContent className="text-purple-300 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Stay in control of your drinks</li>
                  <li>Keep your phone charged</li>
                  <li>Trust your instincts - leave if uncomfortable</li>
                  <li>Don't share too much personal info too soon</li>
                  <li>Have an exit strategy ready</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white/5 border border-purple-500/20 rounded-lg px-4">
              <AccordionTrigger className="text-white hover:text-purple-300">
                Online Safety
              </AccordionTrigger>
              <AccordionContent className="text-purple-300 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use Kinovo's messaging instead of giving out your number</li>
                  <li>Don't share financial information</li>
                  <li>Be cautious of suspicious links</li>
                  <li>Report fake profiles immediately</li>
                  <li>Use privacy settings to control who sees what</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white/5 border border-purple-500/20 rounded-lg px-4">
              <AccordionTrigger className="text-white hover:text-purple-300">
                Red Flags to Watch For
              </AccordionTrigger>
              <AccordionContent className="text-purple-300 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pushing to move off-platform quickly</li>
                  <li>Avoiding video calls or refusing to verify</li>
                  <li>Asking for money or financial help</li>
                  <li>Pressure for intimate content</li>
                  <li>Inconsistent stories or information</li>
                  <li>Making you feel guilty or obligated</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Trust & Verification */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Trust & Verification</h2>
          </div>
          
          <div className="space-y-3 text-purple-200 text-sm">
            <p>
              <strong className="text-white">Verified Badge:</strong> Members who have completed ID verification and photo verification.
            </p>
            <p>
              <strong className="text-white">Trust Score:</strong> Based on community reviews, report history, and positive interactions.
            </p>
            <p>
              <strong className="text-white">AI Moderation:</strong> Our AI monitors for inappropriate content and behavior patterns.
            </p>
            <p>
              <strong className="text-white">Human Review:</strong> All reports are reviewed by our safety team within 24 hours.
            </p>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Resources</h2>
          </div>
          
          <div className="space-y-2">
            <a href="#" className="block text-purple-300 hover:text-purple-200 text-sm">
              → Community Guidelines (Full Version)
            </a>
            <a href="#" className="block text-purple-300 hover:text-purple-200 text-sm">
              → Privacy Policy
            </a>
            <a href="#" className="block text-purple-300 hover:text-purple-200 text-sm">
              → Terms of Service
            </a>
            <a href="#" className="block text-purple-300 hover:text-purple-200 text-sm">
              → Contact Support
            </a>
            <a href="#" className="block text-purple-300 hover:text-purple-200 text-sm">
              → Sexual Health Resources
            </a>
            <a href="#" className="block text-purple-300 hover:text-purple-200 text-sm">
              → Mental Health Support
            </a>
          </div>
        </div>

        {/* Emergency */}
        <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">In an Emergency</h3>
          <p className="text-red-300 mb-4">
            If you're in immediate danger, contact local emergency services.
          </p>
          <Button variant="outline" className="bg-red-500/20 border-red-500/50 text-white hover:bg-red-500/30">
            Emergency Contacts by Country
          </Button>
        </div>
      </div>
    </div>
  );
}
