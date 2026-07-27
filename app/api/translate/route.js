import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { mockTranslateText } from '@/lib/translateMock';

export async function POST(request) {
  try {
    const body = await request.json();
    const text = String(body.text || '').trim();
    const targetLanguage = body.targetLanguage || 'en';

    if (!text) {
      return NextResponse.json({ success: false, message: 'text is required' }, { status: 400 });
    }

    const openai = getOpenAIClient();

    if (openai) {
      try {
        const targetLabel = targetLanguage === 'en' ? 'English' : targetLanguage;
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the user's message into ${targetLabel}. Preserve the meaning and tone. Reply with only the translation — no quotes, labels, or explanations.`,
            },
            { role: 'user', content: text },
          ],
          temperature: 0.2,
        });

        const translated = completion.choices[0]?.message?.content?.trim();
        if (translated) {
          return NextResponse.json({
            success: true,
            translated,
            targetLanguage,
            provider: 'openai',
          });
        }
      } catch (error) {
        console.error('OpenAI translation error:', error?.message || error);
        const mockTranslated = mockTranslateText(text);
        if (mockTranslated && mockTranslated !== text) {
          return NextResponse.json({
            success: true,
            translated: mockTranslated,
            targetLanguage,
            mock: true,
            openaiError: error?.message,
          });
        }

        return NextResponse.json(
          {
            success: false,
            message:
              'Translation unavailable. Add billing to your OpenAI account or use short common phrases offline.',
            error: error?.message,
          },
          { status: 502 }
        );
      }
    }

    const mockTranslated = mockTranslateText(text);
    if (mockTranslated && mockTranslated !== text) {
      return NextResponse.json({
        success: true,
        translated: mockTranslated,
        targetLanguage,
        mock: true,
      });
    }

    return NextResponse.json({
      success: false,
      message:
        'Add OPENAI_API_KEY to .env for full translation. Short phrases like "Wie geht es dir" work offline.',
      mock: true,
      needsOpenAI: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Invalid request' },
      { status: 400 }
    );
  }
}
