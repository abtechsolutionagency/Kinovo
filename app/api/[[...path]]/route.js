// API route handler for Next.js
import { NextResponse } from 'next/server';

// Note: OpenAI integration will be activated when you add OPENAI_API_KEY to .env
// For now, these endpoints return mock responses
const OPENAI_ENABLED = !!process.env.OPENAI_API_KEY;

let openai = null;
if (OPENAI_ENABLED) {
  try {
    const OpenAI = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) {
    console.log('OpenAI not configured yet');
  }
}

// Mock data endpoints
export async function GET(request) {
  const { pathname } = new URL(request.url);
  
  // Root endpoint
  if (pathname === '/api/') {
    return NextResponse.json({ 
      message: 'Kinovo API v1.0',
      status: 'running',
      openai_enabled: OPENAI_ENABLED,
      endpoints: [
        '/api/auth',
        '/api/users',
        '/api/destinations',
        '/api/messages',
        '/api/groups',
        '/api/concierge',
        '/api/ai/profile-enhance',
        '/api/ai/icebreaker',
        '/api/ai/moderate',
        '/api/ai/discussion-prompts'
      ]
    });
  }

  // Waitlist endpoint
  if (pathname === '/api/waitlist') {
    return NextResponse.json({ 
      success: true,
      message: 'Added to waitlist successfully!'
    });
  }

  // AI Discussion Prompts Generator
  if (pathname === '/api/ai/discussion-prompts') {
    if (OPENAI_ENABLED && openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Generate 5 engaging community discussion prompts for an adult social networking app focused on travel and lifestyle. Keep them classy, inclusive, and non-explicit. Return as JSON array with format: [{"title": "...", "preview": "..."}]`
            }
          ],
          response_format: { type: "json_object" }
        });

        return NextResponse.json({
          success: true,
          prompts: JSON.parse(completion.choices[0].message.content)
        });
      } catch (error) {
        console.error('OpenAI error:', error);
      }
    }

    // Mock response
    return NextResponse.json({
      success: true,
      prompts: [
        { title: 'Best travel destinations for summer 2025?', preview: 'Share your favorite spots...' },
        { title: 'How do you approach making connections abroad?', preview: 'Tips for authentic connections...' },
        { title: 'Favorite nightlife spots in Europe?', preview: 'From beach clubs to rooftop bars...' }
      ]
    });
  }

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}

export async function POST(request) {
  const { pathname } = new URL(request.url);
  
  try {
    const body = await request.json();

    // Waitlist submission
    if (pathname === '/api/waitlist') {
      // TODO: Save to database when Supabase is integrated
      console.log('Waitlist signup:', body.email);
      return NextResponse.json({ 
        success: true,
        message: 'Successfully joined waitlist!'
      });
    }

    // Auth endpoints
    if (pathname === '/api/auth/login') {
      // TODO: Implement Supabase auth
      return NextResponse.json({ 
        success: true,
        user: {
          id: 'user1',
          email: body.email,
          name: 'Alex Rivera'
        },
        token: 'mock-jwt-token'
      });
    }

    if (pathname === '/api/auth/signup') {
      // TODO: Implement Supabase auth with invite code validation
      return NextResponse.json({ 
        success: true,
        user: {
          id: 'user1',
          email: body.email,
          name: body.name || 'New User'
        },
        token: 'mock-jwt-token'
      });
    }

    // AI Profile Enhancer
    if (pathname === '/api/ai/profile-enhance') {
      if (OPENAI_ENABLED && openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert dating and social profile writer.
Create a warm, authentic, concise profile (max 150 words).
Avoid explicit sexual content.
Focus on personality, interests, and what makes them unique.
Return only the improved profile text.`
              },
              {
                role: 'user',
                content: body.bio
              }
            ]
          });

          return NextResponse.json({
            success: true,
            profile: completion.choices[0].message.content
          });
        } catch (error) {
          console.error('OpenAI error:', error);
          return NextResponse.json({
            success: false,
            error: 'AI service temporarily unavailable'
          }, { status: 500 });
        }
      }

      // Mock response
      return NextResponse.json({
        success: true,
        profile: `${body.bio}\n\nI'm an adventurous soul who loves exploring new destinations and meeting open-minded people along the way. Whether it's a sunset beach party in Ibiza or a cozy cafe in Amsterdam, I'm always up for authentic connections and memorable experiences. Let's make some stories together!`
      });
    }

    // AI Icebreaker Generator
    if (pathname === '/api/ai/icebreaker') {
      if (OPENAI_ENABLED && openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Generate 3 natural, playful conversation starters based on two profiles.
Keep them respectful, fun, and relevant to shared interests.
Avoid anything explicit.
Return as JSON array: ["starter 1", "starter 2", "starter 3"]`
              },
              {
                role: 'user',
                content: `Profile 1: ${body.profileA}\n\nProfile 2: ${body.profileB}`
              }
            ],
            response_format: { type: "json_object" }
          });

          const result = JSON.parse(completion.choices[0].message.content);
          return NextResponse.json({
            success: true,
            suggestions: result.starters || result
          });
        } catch (error) {
          console.error('OpenAI error:', error);
        }
      }

      // Mock response
      return NextResponse.json({
        success: true,
        suggestions: [
          "I saw you're into travel too! What's been your favorite destination so far?",
          "Your profile caught my eye! Are you planning any trips soon?",
          "We seem to have similar interests! Have you been to any good events lately?"
        ]
      });
    }

    // AI Safety Moderation
    if (pathname === '/api/ai/moderate') {
      if (OPENAI_ENABLED && openai) {
        try {
          const moderation = await openai.moderations.create({
            model: 'omni-moderation-latest',
            input: body.message
          });

          return NextResponse.json({
            success: true,
            flagged: moderation.results[0].flagged,
            categories: moderation.results[0].categories
          });
        } catch (error) {
          console.error('OpenAI moderation error:', error);
        }
      }

      // Mock response - flag obvious bad words
      const flaggedWords = ['spam', 'scam', 'money', 'wire', 'bitcoin'];
      const flagged = flaggedWords.some(word => 
        body.message.toLowerCase().includes(word)
      );

      return NextResponse.json({
        success: true,
        flagged,
        categories: {
          harassment: false,
          hate: false,
          sexual: false,
          violence: false
        }
      });
    }

    // AI Concierge
    if (pathname === '/api/concierge') {
      if (OPENAI_ENABLED && openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are the Kinovo AI concierge - a helpful, warm assistant for travelers.
Help users discover:
- Nightlife and social spots
- Compatible travelers nearby
- Travel planning and tips
- Community etiquette and safety
- Local recommendations

Be modern, concise, and friendly. Keep responses under 150 words.`
              },
              {
                role: 'user',
                content: body.message
              }
            ],
            max_tokens: 200
          });

          return NextResponse.json({
            success: true,
            response: completion.choices[0].message.content
          });
        } catch (error) {
          console.error('OpenAI error:', error);
        }
      }

      // Mock response
      const mockResponses = [
        "Based on your profile, I'd recommend checking out Pacha Ibiza tonight. It's known for its open-minded crowd and amazing music. There are 12 Kinovo members planning to be there!",
        "I found 3 travelers with similar interests heading to Tenerife next week. Would you like me to introduce you?",
        "For a more intimate vibe in London, try The Box Soho. It's exclusive and attracts a sophisticated crowd.",
        "Here are the top-rated beach clubs in Benidorm right now. KU Beach Bar has the best sunset views and a welcoming atmosphere."
      ];
      
      return NextResponse.json({ 
        success: true,
        response: mockResponses[Math.floor(Math.random() * mockResponses.length)]
      });
    }

    // Translation
    if (pathname === '/api/translate') {
      if (OPENAI_ENABLED && openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Translate the following text to ${body.targetLanguage}. Only provide the translation, no explanations.`
              },
              {
                role: 'user',
                content: body.text
              }
            ]
          });

          return NextResponse.json({
            success: true,
            translated: completion.choices[0].message.content,
            detectedLanguage: body.sourceLanguage || 'auto',
            targetLanguage: body.targetLanguage
          });
        } catch (error) {
          console.error('OpenAI translation error:', error);
        }
      }

      // Mock response
      return NextResponse.json({ 
        success: true,
        translated: body.text,
        detectedLanguage: 'es',
        targetLanguage: body.targetLanguage || 'en'
      });
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request',
      message: error.message 
    }, { status: 400 });
  }
}
