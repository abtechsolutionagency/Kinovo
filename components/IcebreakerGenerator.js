'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function IcebreakerGenerator({ profileA, profileB, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generateIcebreakers() {
    setLoading(true);

    try {
      const response = await fetch('/api/ai/icebreaker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileA, profileB })
      });

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating icebreakers:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-200">AI Conversation Starters</span>
        </div>
        {!generated && (
          <Button
            onClick={generateIcebreakers}
            disabled={loading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-xs"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              'Generate'
            )}
          </Button>
        )}
      </div>

      {generated && suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect && onSelect(suggestion)}
              className="w-full text-left p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 transition-all text-sm text-purple-200 hover:text-white"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
