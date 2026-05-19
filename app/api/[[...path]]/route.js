// API route handler for Next.js
import { NextResponse } from 'next/server';

// Mock data endpoints
export async function GET(request) {
  const { pathname } = new URL(request.url);
  
  // Root endpoint
  if (pathname === '/api/') {
    return NextResponse.json({ 
      message: 'Kinovo API v1.0',
      status: 'running',
      endpoints: [
        '/api/auth',
        '/api/users',
        '/api/destinations',
        '/api/messages',
        '/api/groups',
        '/api/concierge'
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

    // AI Concierge
    if (pathname === '/api/concierge') {
      // TODO: Integrate OpenAI API
      const mockResponses = [
        "Based on your profile, I'd recommend checking out the beach clubs in Ibiza. There are 12 Kinovo members there this week!",
        "I found 3 travelers with similar interests heading to Tenerife next week. Would you like me to introduce you?",
        "For nightlife in London, try The Box Soho. It's exclusive and attracts a sophisticated crowd.",
      ];
      
      return NextResponse.json({ 
        success: true,
        response: mockResponses[Math.floor(Math.random() * mockResponses.length)]
      });
    }

    // Translation
    if (pathname === '/api/translate') {
      // TODO: Integrate OpenAI translation
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
