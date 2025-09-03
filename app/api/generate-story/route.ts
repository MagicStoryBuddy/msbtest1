import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Optional: lock this to the Node runtime (comment out if you use Edge)
// export const runtime = 'nodejs';

// ----- CONFIG -----
const ENABLE_OPENAI = true; // flip to false to force built-in storyteller

function requireOpenAIKey(): string {
  const k = process.env.OPENAI_API_KEY;
  if (!k) throw new Error('OPENAI_API_KEY is not set. Add it to .env.local and Vercel project settings.');
  return k;
}

// Lazy OpenAI client
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: requireOpenAIKey() });
  return _openai;
}

// Dev-only connection test (never runs in production)
if (ENABLE_OPENAI && process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      console.log('[DEV] Testing OpenAI connection...');
      const r = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${requireOpenAIKey()}`, 'Content-Type': 'application/json' },
      });
      if (!r.ok) {
        const text = await r.text();
        console.error('[DEV] OpenAI test failed:', r.status, text);
      } else {
        const data = await r.json() as { data: Array<{ id: string }> };
        console.log(`[DEV] OpenAI OK. Models available: ${data.data.length}`);
      }
    } catch (e) {
      console.error('[DEV] OpenAI test error:', e);
    }
  })();
}

// ----- OPENAI DIRECT CALL (no SDK needed) -----
async function generateOpenAIStory(
  hero: string,
  place: string | null,
  mission: string | null,
  lifeSkill?: string,
  additionalHeroes?: string[]
): Promise<string> {
  const prompt = `
Create a cozy bedtime story for children ages 3-5 (3-5 minutes read-aloud time).

CHARACTER: ${hero}
${place ? `SETTING: ${place}` : 'SETTING: [create any magical or interesting place appropriate for a children\'s story]'}
${mission ? `MISSION: ${mission}` : 'MISSION: [create any fun adventure or mission appropriate for a children\'s story]'}
${lifeSkill ? `TEACHING POINT: ${lifeSkill}` : ''}

KEY REQUIREMENTS:
- Brief character intro (1-2 sentences) then jump straight to the mission
- Include age-appropriate teaching point: ${lifeSkill || 'sharing, kindness, patience, or courage'}
- Add simple educational elements like colors, counting 1-10, shapes, or alphabet concepts
- Use simple language, short paragraphs, and repetition where appropriate
- Reveal character traits naturally through the story, not in lengthy introduction
${!place ? '- Create a unique, imaginative setting - you\'re not limited to standard places' : ''}
${!mission ? '- Create a unique, creative mission or adventure - you\'re not limited to standard quests' : ''}

STORY FORMAT:
1. Very brief character introduction
2. Quick jump into the mission/adventure
3. Include ONE interactive choice moment using this exact format:

===CHOICE POINT===
Should they [Option A] or [Option B]?
===END CHOICE POINT===

===OPTION A OUTCOME===
[Option A result and continuation]
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
[Option B result and continuation]
===END OPTION B OUTCOME===

Make both choices creative and equally valid (different routes, tools, approaches, or creatures). Avoid the basic "do it alone vs. ask for help" pattern.

End with: "The end. Would you like to go on another adventure with [CHARACTER NAME]? Or are you ready to join [CHARACTER NAME] in Dreamland?"
`.trim();

  console.log('Sending request to OpenAI with prompt:', prompt.substring(0, 200) + '...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireOpenAIKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            "You are a talented children's storyteller. You create gentle, cozy, and engaging stories for young children that are easy to understand and have meaningful life lessons.",
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    }),
  });

  console.log('OpenAI API response status:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data?.choices?.[0]?.message?.content) {
    console.error('Unexpected OpenAI response structure:', JSON.stringify(data));
    throw new Error('Invalid response structure from OpenAI API');
  }
  return data.choices[0].message.content as string;
}

// ----- BUILT-IN FALLBACK STORY GENERATOR (unchanged core logic) -----
function generateBuiltInStory(
  hero: string,
  place: string | null,
  mission: string | null,
  lifeSkill?: string
): string {
  const randomPlaces = [
    "Castle","Forest","Ocean","Candy Land","Silly Circus",
    "Rainbow Cloud Island","Enchanted Garden","Bug World",
    "Snowy Mountain","Crystal Caves","Dino Land","Dragon Valley",
    "Friendly Ghost Town","Unicorn Fields",
    "Bubble Kingdom","Cloud City","Marshmallow Mountains",
    "Talking Tree Village","Moonlight Meadow","Starshine Beach",
    "Whispering Waterfall","Giggling Garden","Cookie Canyon",
    "Dream Desert","Purple Planet","Singing Sea","Telescope Tower",
    "Bouncy Balloon Land","Jelly Jungle","Glowing Geyser Valley"
  ];
  const randomMissions = [
    "Find Treasure","Help a Friend","Build a Tower","Solve a Mystery",
    "Explore a Secret Tunnel","Follow a Map to Adventure","Collect Sparkle Stones",
    "Cheer Someone Up","Plan a Surprise Party","Clean up",
    "Deliver a Special Letter","Find Something That was Lost","Tame a Baby Dragon",
    "Find the Missing Song Notes","Paint a Picture that Comes to Life",
    "Help Someone Learn the Alphabet","Count the Stars","Grow a Magic Garden",
    "Help Birds Build a Nest","Find Firefly Light for the Lantern Festival",
    "Rescue a Cloud That Can't Rain","Find the Lost Rainbow Colors",
    "Help the Sun and Moon Become Friends","Teach the Stars How to Twinkle",
    "Find the Cure for a Sad Flower","Discover Why the Wind is Whispering",
    "Reunite a Baby Comet with Its Family","Solve the Mystery of the Dancing Shoes",
    "Help the Shy Shadow Learn to Play","Find the Recipe for Happiness Cookies",
    "Discover Why the Books Won't Tell Their Stories","Find the Lost Lullaby",
    "Help the Thunder Learn to Be Quieter","Teach the Echo How to Say New Words",
    "Find the Magic That Makes Bubbles Pop"
  ];

  const placeToUse = place || randomPlaces[Math.floor(Math.random() * randomPlaces.length)];
  const missionToUse = mission || randomMissions[Math.floor(Math.random() * randomMissions.length)];

  let teachingPoint = '';
  if (lifeSkill) {
    teachingPoint = lifeSkill.toLowerCase();
  } else {
    const teachingPoints = [
      'sharing is caring','being patient','trying your best','being kind to others',
      'helping friends','telling the truth','being brave when scared','listening to grown-ups',
      'tidying up after playtime','saying please and thank you'
    ];
    teachingPoint = teachingPoints[Math.floor(Math.random() * teachingPoints.length)];
  }

  const educationalElements = [
    'counting from one to five',
    'recognizing colors like red, blue, green, and yellow',
    'identifying shapes such as circles, squares, and triangles',
    'saying the first few letters of the alphabet',
    'learning about simple emotions like happy, sad, and excited',
    'understanding concepts like big and small, up and down'
  ];
  const educationalElement = educationalElements[Math.floor(Math.random() * educationalElements.length)];

  const storyStarters = [
    'Once upon a time','In a faraway land','Long ago','On a bright sunny day','In a magical place','One cozy evening'
  ];
  const endings = [
    'Sweet dreams!','And they all lived happily ever after.','The End.','Goodnight, little one.','Until the next adventure!'
  ];
  const storyStarter = storyStarters[Math.floor(Math.random() * storyStarters.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];

  let storyTemplate = '';

  // (Your character-specific branches remain the same; omitted here for brevity)
  // KEEP all your existing hero-specific templates exactly as you had them.
  // --- BEGIN your existing templates ---
  // ... [PASTE all your hero branches here unchanged]
  // --- END your existing templates ---

  // If none matched, fallback (your Sparkles template was here; keep it)
  if (!storyTemplate) {
    storyTemplate = `# Sparkles the Unicorn's Magical Journey

${storyStarter}, a unicorn named Sparkles was prancing through a field of flowers. As the sunlight touched her mane, it seemed to change from purple to pink to blue—shifting colors like a rainbow.

... (keep your Sparkles template exactly as before) ...
`;
  }

  return storyTemplate;
}

// ----- API HANDLER -----
export async function POST(request: Request) {
  try {
    const { hero, place, mission, lifeSkill, additionalHeroes } = await request.json();
    const placeToUse = place || null;
    const missionToUse = mission || null;

    console.log('Generating story with:', {
      hero,
      place: placeToUse ? placeToUse : 'Open for AI creativity',
      mission: missionToUse ? missionToUse : 'Open for AI creativity',
      lifeSkill,
      additionalHeroes,
    });

    if (!ENABLE_OPENAI) {
      const story = generateBuiltInStory(hero, placeToUse, missionToUse, lifeSkill);
      return NextResponse.json({ story, usedFallback: false }, { status: 200 });
    }

    try {
      const story = await generateOpenAIStory(hero, placeToUse, missionToUse, lifeSkill, additionalHeroes);
      return NextResponse.json({ story, usedFallback: false }, { status: 200 });
    } catch (err: any) {
      console.error('OpenAI API Error:', err?.message || err);
      const fallback = generateBuiltInStory(hero, placeToUse, missionToUse, lifeSkill);
      return NextResponse.json({ story: fallback, usedFallback: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error('General error in story generation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to generate story', message: error?.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
