import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Wifi, WifiOff } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

function renderInlineText(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function renderMessageText(text: string): React.ReactNode {
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  return lines.map((line, index) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^(?:[-*•])\s+(.+)$/);

    if (bulletMatch) {
      return (
        <div key={index} className="flex gap-1.5">
          <span className="mt-0.5 text-primary">•</span>
          <span>{renderInlineText(bulletMatch[1])}</span>
        </div>
      );
    }

    return <p key={index}>{renderInlineText(trimmed)}</p>;
  });
}

const QUICK_PROMPTS = [
  'What is acne?',
  'How to treat eczema?',
  'What does confidence score mean?',
  'When should I see a doctor?',
  'How to use this app?',
  'What is psoriasis?',
  'What is vitiligo?',
  'How to treat fungal infection?',
  'Best sunscreen tips',
  'Skin emergency signs',
  'How to download report?',
  'How to consult doctor?',
];

const CHAT_STORAGE_KEY = 'dermacure-chat-history';
const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'bot',
    text: "Hello! I'm the DermaCure AI Assistant, powered by Google Gemini. ðŸ‘‹\n\nAsk me about skin conditions, how to use the app, or understanding your results. How can I help?",
  },
];

function loadStoredMessages(): Message[] {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return INITIAL_MESSAGES;

    const parsed = JSON.parse(stored) as Message[];
    const isValidHistory =
      Array.isArray(parsed) &&
      parsed.every(
        message =>
          typeof message?.id === 'string' &&
          (message.role === 'user' || message.role === 'bot') &&
          typeof message.text === 'string'
      );

    return isValidHistory && parsed.length > 0 ? parsed : INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
}

// ─── Rule-based fallback (used when API is rate-limited or unavailable) ───────

function getFallbackResponse(input: string): string {
  const msg = input.toLowerCase().trim();

  if (msg.match(/^(hi|hello|hey|good\s*(morning|evening|afternoon)|greetings)/))
    return "Hello! 👋 I'm the DermaCure AI Assistant. I can help you with:\n\n• Skin conditions (acne, eczema, psoriasis, etc.)\n• How to use the app\n• Understanding confidence scores\n• Skincare tips and when to see a doctor\n\nWhat would you like to know?";

  if (msg.match(/^(thank|thanks|ty|thank you)/))
    return "You're welcome! Remember — DermaCure AI gives preliminary insights only. Always consult a qualified dermatologist for proper diagnosis and treatment. Take care! 🌿";

  if (msg.includes('acne') || msg.includes('pimple') || msg.includes('blackhead') || msg.includes('whitehead'))
    return "Acne (Acne Vulgaris) is caused by clogged pores — excess oil, dead skin, and bacteria.\n\n✅ Treatments:\n• Benzoyl peroxide 2.5–5% (kills bacteria)\n• Salicylic acid (unclogs pores)\n• Retinoids (speeds cell turnover)\n• Oral antibiotics or isotretinoin for severe cases\n\n💡 Wash face twice daily, avoid picking, use oil-free SPF. See a dermatologist if severe.";

  if (msg.includes('eczema') || msg.includes('atopic') || msg.includes('dermatitis'))
    return "Eczema (Atopic Dermatitis) causes dry, itchy, inflamed skin due to immune dysfunction.\n\n✅ Treatments:\n• Fragrance-free moisturizers (apply right after bathing)\n• 1% hydrocortisone cream for flares\n• Avoid triggers: soaps, dust, pet dander, stress\n• Prescription: topical corticosteroids, biologics\n\n💡 Wear cotton, keep nails short, use unscented detergents.";

  if (msg.includes('psoriasis') || msg.includes('plaque'))
    return "Psoriasis is an autoimmune condition causing rapid skin cell buildup — red, scaly plaques.\n\n✅ Treatments:\n• Thick moisturizers (ointments work best)\n• Coal tar or salicylic acid shampoos for scalp\n• Narrowband UVB phototherapy\n• Biologic medications for severe cases\n\n💡 Avoid triggers: stress, smoking, alcohol, skin injuries.";

  if (msg.includes('vitiligo') || msg.includes('depigment') || msg.includes('white patch'))
    return "Vitiligo is an autoimmune condition where melanocytes are destroyed, causing white patches.\n\n✅ Treatments:\n• Topical tacrolimus or pimecrolimus\n• Narrowband UVB phototherapy or excimer laser\n• SPF 50+ sunscreen on all depigmented areas\n\n💡 Not contagious and not harmful — but can impact self-image.";

  if (msg.includes('ringworm') || msg.includes('tinea') || msg.includes('fungal') || msg.includes('athlete'))
    return "Tinea (Ringworm) is a fungal infection causing ring-shaped, scaly, itchy patches.\n\n✅ Treatments:\n• OTC antifungal creams: clotrimazole or miconazole (twice daily for 2–4 weeks)\n• Keep area clean and DRY\n• For scalp/nails: oral antifungals needed — see a doctor\n\n💡 Don't share towels or shoes.";

  if (msg.includes('rosacea') || msg.includes('facial redness'))
    return "Rosacea causes chronic facial redness, visible blood vessels, and bumps.\n\n✅ Treatments:\n• Gentle, fragrance-free skincare\n• SPF 30+ daily (sun is a major trigger)\n• Topical metronidazole or azelaic acid\n• IPL/laser therapy for persistent redness\n\n💡 Common triggers: sun, heat, alcohol, spicy food, stress.";

  if (msg.includes('confidence') || msg.includes('score') || msg.includes('percent') || msg.includes('accuracy'))
    return "The confidence score shows how certain the AI is about its prediction (0–100%).\n\n📊 Interpretation:\n• 80–100% — High confidence, reliable prediction\n• 50–79% — Moderate confidence, cross-check with symptoms\n• Below 50% — ⚠️ Low confidence — consult a doctor\n\nEven at high confidence, always verify with a dermatologist.";

  if ((msg.includes('how') && (msg.includes('use') || msg.includes('work') || msg.includes('app'))) || msg.includes('get started'))
    return "How to use DermaCure AI:\n\n1️⃣ Upload Image — Go to AI Diagnostic Tools, upload a skin photo, choose a model, and run analysis\n2️⃣ Symptom Analysis — Select your symptoms for an NLP-based prediction\n3️⃣ Consult Doctor — Upload image + symptoms for a real doctor review\n4️⃣ My Consultations — Check all submitted consultations and doctor reports";

  if (msg.includes('doctor') || msg.includes('consult') || msg.includes('specialist'))
    return "To request a doctor consultation:\n\n1. Click 'Consult Doctor' in the sidebar\n2. Upload your skin image\n3. Select your symptoms\n4. Add additional context\n5. Click 'Send to Doctor'\n\nA qualified doctor will review your case. Always consult a doctor for any medical decision.";

  if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('serious') || msg.includes('severe'))
    return "⚠️ Seek immediate medical care if you notice:\n\n🚨 Rapidly spreading rash or skin infection\n🚨 Hot, swollen, very painful skin (possible cellulitis)\n🚨 Rash with high fever\n🚨 Difficulty breathing + hives (anaphylaxis — call emergency NOW)\n🚨 A mole changing rapidly in size, shape, or colour\n🚨 Blistering across large areas\n\nDo NOT rely on AI for emergencies.";

  if (msg.includes('sunscreen') || msg.includes('spf') || msg.includes('sun') || msg.includes('uv'))
    return "Sun protection is essential for all skin conditions:\n\n☀️ Tips:\n• Use broad-spectrum SPF 30+ daily — even on cloudy days\n• Reapply every 2 hours outdoors\n• Especially critical for vitiligo, rosacea, post-procedure skin\n• Mineral sunscreens (zinc oxide) are gentler for sensitive skin.";

  if (msg.includes('diet') || msg.includes('food') || msg.includes('eat') || msg.includes('nutrition'))
    return "Diet and skin health are closely linked:\n\n🥗 For healthy skin:\n• Stay hydrated — 8–10 glasses of water daily\n• Antioxidant-rich foods: berries, leafy greens, tomatoes\n• Omega-3 fatty acids reduce inflammation\n\n⚠️ May worsen conditions:\n• High-sugar foods → acne\n• Dairy → may worsen acne\n• Alcohol → triggers rosacea";

  if (msg.includes('report') || msg.includes('download') || msg.includes('pdf'))
    return "To download your medical report:\n\n1. Run an AI analysis (Upload Image or Symptom Analysis)\n2. Click '📄 Download Report' once results appear\n3. A formatted report opens in a new window\n4. Click 'Print / Save as PDF' to save\n\nThe report includes diagnosis, confidence score, disease description, and medical suggestions.";

  return "I'm here to help with dermatology and app questions! Try asking me:\n\n• 'Tell me about eczema'\n• 'How do I use the app?'\n• 'What does confidence score mean?'\n• 'When should I see a doctor urgently?'\n\nFor accurate diagnosis, use the AI tools in the app or consult a doctor.";
}

// ─── Gemini API ───────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are DermaCure AI Assistant, an expert AI dermatology assistant embedded in the DermaCure AI app.

Your role:
- Answer questions about skin conditions (acne, eczema, psoriasis, vitiligo, rosacea, warts, tinea, candidiasis, seborrheic keratosis, and more)
- Help users understand the DermaCure AI app (image upload, symptom analysis, doctor consultations, confidence scores, PDF reports)
- Provide evidence-based skincare advice

Rules:
- Always be helpful, concise, and empathetic
- Keep answers concise but useful: 5-8 short sentences or 3-5 bullet points maximum
- End answers about symptoms or conditions with a reminder to consult a qualified dermatologist
- Never diagnose definitively — frame as screening / preliminary information
- Keep responses clear and use bullet points or numbered lists where helpful
- If asked something outside dermatology or the app, politely redirect
- Remind that confidence scores below 50% should be followed up with a doctor`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-2.5-flash';

async function callGemini(history: Message[]): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('NO_KEY');
  }

  // AI Studio keys start with "AIzaSy" — anything else is the wrong key type
  if (!GEMINI_API_KEY.startsWith('AIzaSy')) {
    throw new Error('WRONG_KEY_TYPE');
  }

  const contents = history
    .filter(m => m.id !== '0')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 320 },
      }),
    }
  );

  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (res.status === 404) throw new Error('MODEL_NOT_FOUND');

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error('Empty response');
  return text.trim();
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadStoredMessages);
  /*
    {
      id: '0',
      role: 'bot',
      text: "Hello! I'm the DermaCure AI Assistant, powered by Google Gemini. 👋\n\nAsk me about skin conditions, how to use the app, or understanding your results. How can I help?",
    },
  ]);
  */
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasKey = GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setTyping(true);

    try {
      const reply = await callGemini(nextMessages);
      setRateLimited(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: reply }]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);

      if (errMsg === 'NO_KEY' || errMsg === 'WRONG_KEY_TYPE') {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: "⚠️ Invalid Gemini API key.\n\nYou need a Google AI Studio key (starts with 'AIzaSy'):\n\n1. Go to aistudio.google.com\n2. Click 'Get API key' → 'Create API key'\n3. Copy the key (it will start with AIzaSy...)\n4. Open .env and replace the current key\n5. Restart the dev server (npm run dev)\n\nMeanwhile, here's a built-in answer:\n\n" + getFallbackResponse(msg),
          },
        ]);
      } else if (errMsg === 'MODEL_NOT_FOUND') {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: `Gemini model "${GEMINI_MODEL}" is unavailable for this API key.\n\nSet VITE_GEMINI_MODEL=gemini-2.5-flash in .env and restart the dev server.\n\nMeanwhile, here's a built-in answer:\n\n${getFallbackResponse(msg)}`,
          },
        ]);
      } else if (errMsg === 'RATE_LIMIT') {
        // Fall back to rule-based response silently
        setRateLimited(true);
        const fallback = getFallbackResponse(msg);
        setMessages(prev => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', text: fallback },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: `Sorry, I couldn't reach the AI right now.\n\n${getFallbackResponse(msg)}`,
          },
        ]);
      }
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 w-[340px] sm:w-[380px] h-[560px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/80 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">DermaCure Assistant</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {hasKey ? (
                    <>
                      <Wifi className="w-2.5 h-2.5 text-green-300" />
                      <span className="text-[10px] text-white/70">
                        {rateLimited ? 'Gemini AI · Fallback mode' : 'Gemini AI · Live'}
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-2.5 h-2.5 text-yellow-300" />
                      <span className="text-[10px] text-yellow-200">No API key</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rate-limit notice */}
          {rateLimited && (
            <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400 text-center">
              AI rate limit reached — using built-in responses
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'bot' ? 'bg-primary/15' : 'bg-secondary/15'}`}>
                  {m.role === 'bot' ? <Bot className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-secondary" />}
                </div>
                <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'bot'
                    ? 'bg-muted/60 text-foreground rounded-tl-none'
                    : 'bg-primary text-primary-foreground rounded-tr-none'
                }`}>
                  <div className="space-y-2">
                    {renderMessageText(m.text)}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 py-2 border-t border-border flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
            {QUICK_PROMPTS.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={typing}
                className="text-[10px] px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-medium whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl border border-border focus-within:border-primary transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask about skin conditions..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="m-1 w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[9px] text-muted-foreground text-center mt-1.5">
              Not a substitute for professional medical advice
            </p>
          </div>
        </div>
      )}

      {/* Toggle bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-20 lg:bottom-6 right-4 w-13 h-13 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-110 transition-all hover:shadow-primary/30 hover:shadow-2xl"
        style={{ width: '52px', height: '52px' }}
        aria-label="Toggle DermaCure AI chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
};
