'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Users, Lock, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AppPage, PageContent, PageHeader, GlassCard } from '@/components/AppPage';
import { BottomNav } from '@/components/BottomNav';

export default function SafetyPage() {
  return (
    <AppPage>
      <PageHeader title="Safety Center" subtitle="Your safety is our priority" backHref="/profile" />

      <PageContent>
        <div className="grid grid-cols-1 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5"
          >
            <AlertTriangle className="w-7 h-7 text-red-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Report an Issue</h3>
            <p className="text-red-300/90 text-sm">Report inappropriate behavior or content</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5"
          >
            <Lock className="w-7 h-7 text-blue-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Block Someone</h3>
            <p className="text-blue-300/90 text-sm">Manage your blocked users list</p>
          </motion.div>
        </div>

        <GlassCard className="mb-4 !p-5">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Community Standards</h2>
          </div>

          <div className="space-y-4 text-purple-200 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-1">Respect & Consent</h3>
              <p>Always treat others with respect. Consent is mandatory in all interactions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Honesty & Authenticity</h3>
              <p>Be honest about your intentions. Use real photos. No catfishing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Privacy & Discretion</h3>
              <p>Respect others&apos; privacy. Don&apos;t share personal information without permission.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Safe Meetings</h3>
              <p>Meet in public places first. Let friends know your plans. Trust your instincts.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4 !p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-white">Safety Tips</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                id: 'before',
                title: 'Before Meeting',
                items: [
                  'Video chat first to verify identity',
                  'Meet in public, well-lit places',
                  'Tell a friend where you are going',
                  'Arrange your own transportation',
                ],
              },
              {
                id: 'during',
                title: 'During Meetings',
                items: [
                  'Stay in control of your drinks',
                  'Keep your phone charged',
                  'Trust your instincts — leave if uncomfortable',
                  'Have an exit strategy ready',
                ],
              },
              {
                id: 'online',
                title: 'Online Safety',
                items: [
                  "Use Kinovo's messaging instead of giving out your number",
                  "Don't share financial information",
                  'Report fake profiles immediately',
                ],
              },
            ].map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="bg-white/5 border border-purple-500/20 rounded-xl px-4"
              >
                <AccordionTrigger className="text-white hover:text-purple-300 text-sm">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="text-purple-300 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassCard>

        <GlassCard className="mb-4 !p-5">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Trust & Verification</h2>
          </div>
          <div className="space-y-2 text-purple-200 text-sm">
            <p><strong className="text-white">Verified Badge:</strong> ID and photo verified members.</p>
            <p><strong className="text-white">Trust Score:</strong> Based on reviews and positive interactions.</p>
            <p><strong className="text-white">Human Review:</strong> Reports reviewed within 24 hours.</p>
          </div>
        </GlassCard>

        <GlassCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Resources</h2>
          </div>
          <div className="space-y-2 text-sm">
            {['Community Guidelines', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map((label) => (
              <button
                key={label}
                type="button"
                className="block w-full text-left text-purple-300 hover:text-purple-100 transition-colors"
              >
                → {label}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="mt-6 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white mb-1">In an Emergency</h3>
          <p className="text-red-300 text-sm mb-3">If you are in immediate danger, contact local emergency services.</p>
          <Button variant="outline" size="sm" className="bg-red-500/20 border-red-500/50 text-white hover:bg-red-500/30">
            Emergency Contacts
          </Button>
        </div>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
