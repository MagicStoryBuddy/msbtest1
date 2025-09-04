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
    "Castle","Forest","Candy Land","Dino Land"
  ];
  const randomMissions = [
    "Find Treasure","Help a Friend","Solve a Mystery","Paint a Picture that Comes to Life","Tame a Baby Dragon"
  ];

  const placeToUse = place || randomPlaces[Math.floor(Math.random() * randomPlaces.length)];
  const missionToUse = mission || randomMissions[Math.floor(Math.random() * randomMissions.length)];

  let teachingPoint = '';
  if (lifeSkill) {
    teachingPoint = lifeSkill.toLowerCase();
  } else {
    const teachingPoints = [
      'bravery','dealing with anger','kindness','shyness','patience','brushing teeth','focus and attention','gratitude'
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

  // Character-specific branches (rebuilt premade templates)
  const heroName = hero.trim().toLowerCase();

  if (heroName.includes('robo') || heroName === 'robo rex' || heroName.includes('rex')) {
    storyTemplate = `# Robo Rex and the ${missionToUse} in the ${placeToUse}

${storyStarter}, there was a friendly robot dinosaur named Robo Rex who loved helping friends. His metal plates were shiny silver, and his eyes glowed a warm blue when he smiled.

Today, Robo Rex had a mission: ${missionToUse.toLowerCase()}. He zipped his little rocket-wheels across the ${placeToUse.toLowerCase()}, counting gears and bolts as he went for ${educationalElement}.

Robo Rex remembered to practice ${teachingPoint}, which makes adventures smoother. He took a deep breath and beeped a cheerful tune.

===CHOICE POINT===
Should he scan the path with his rainbow radar, or ask the tiny robo-birds to scout ahead?
===END CHOICE POINT===

===OPTION A OUTCOME===
Robo Rex used his rainbow radar. Beep-beep! The colors showed a safe path in red, blue, and yellow. He followed the red line up a gentle hill and spotted a clue: a shiny bolt pointing toward the goal.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Robo Rex asked the tiny robo-birds for help. They chirped a musical code and circled in a triangle, guiding him left, then right, then straight. Teamwork made the tricky parts easy!
===END OPTION B OUTCOME===

At last, Robo Rex completed the ${missionToUse.toLowerCase()} with careful steps and ${teachingPoint}. He waved to his friends and powered down to a cozy hum.

${ending}

The end. Would you like to go on another adventure with Robo Rex? Or are you ready to join Robo Rex in Dreamland?`;
  } else if (heroName.includes('drake') || heroName.includes('dragon')) {
    storyTemplate = `# Drake the Dragon's ${missionToUse}

${storyStarter}, in the ${placeToUse}, lived a gentle dragon named Drake. His scales shimmered green and gold, and he loved painting clouds in the sky.

Drake’s mission today was ${missionToUse.toLowerCase()}. He flapped his wings slowly, practicing ${educationalElement} along the way.

Drake knew that practicing ${teachingPoint} would help him make good choices.

===CHOICE POINT===
Should Drake follow the sparkling river, or glide above the tall trees to look for a sign?
===END CHOICE POINT===

===OPTION A OUTCOME===
Drake followed the sparkling river. He counted ripples—one, two, three, four, five—and spotted a rainbow fish pointing him forward with a flick of its tail.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Drake soared above the tall trees. From high up, he saw a circle, a square, and a triangle formed by clearings below—shapes marking the path to success.
===END OPTION B OUTCOME===

With a happy roar (a quiet one), Drake completed the ${missionToUse.toLowerCase()} and shared the joy with his forest friends.

${ending}

The end. Would you like to go on another adventure with Drake? Or are you ready to join Drake in Dreamland?`;} else if (heroName.includes('sparkles') || heroName.includes('unicorn')) {
    storyTemplate = `# Sparkles the Unicorn's Magical ${missionToUse}

${storyStarter}, Sparkles pranced through the ${placeToUse}, her mane shifting colors like a rainbow—red, blue, green, and yellow.

Her mission today was ${missionToUse.toLowerCase()}. She trotted lightly, whispering, "I can do this by ${teachingPoint}."

===CHOICE POINT===
Should Sparkles follow the trail of glitter, or listen for the singing flowers to guide her?
===END CHOICE POINT===

===OPTION A OUTCOME===
Sparkles followed the glitter. It twinkled in a line—sparkle, sparkle, sparkle—leading her to a kind fairy who pointed the way with a smile.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Sparkles listened carefully. The flowers sang a gentle counting song from one to five, and she stepped from bloom to bloom until she reached her goal.
===END OPTION B OUTCOME===

With a soft nuzzle and a happy skip, Sparkles finished the ${missionToUse.toLowerCase()} and shared her joy with friends.

${ending}

The end. Would you like to go on another adventure with Sparkles? Or are you ready to join Sparkles in Dreamland?`;
  } else if (heroName.includes('mila')) {
    storyTemplate = `# Mila TanTan's Cozy ${missionToUse}

${storyStarter}, Mila TanTan put on her favorite cozy sweater and peeked outside at the ${placeToUse}. She loved exploring with a bright smile and kind heart.

Her mission was ${missionToUse.toLowerCase()}, and she remembered to practice ${teachingPoint} to help everyone feel good inside.

===CHOICE POINT===
Should Mila ask a friend to join, or start by drawing a simple plan with shapes?
===END CHOICE POINT===

===OPTION A OUTCOME===
Mila invited a friend. Together they took turns and shared tools. "Please" and "thank you" made the work sparkle.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Mila drew a plan using a circle, a square, and a triangle. The shapes helped her take each step in order.
===END OPTION B OUTCOME===

Mila completed the ${missionToUse.toLowerCase()} and gave a proud little wave. She felt warm and peaceful.

${ending}

The end. Would you like to go on another adventure with Mila? Or are you ready to join Mila in Dreamland?`;
  } else if (heroName.includes('liam')) {
    storyTemplate = `# Liam's Brave Day in the ${placeToUse}

${storyStarter}, Liam zipped up his bright jacket and took a deep breath. Today’s mission was ${missionToUse.toLowerCase()}.

He practiced ${educationalElement} while he walked and used ${teachingPoint} to make good choices.

===CHOICE POINT===
Should Liam follow the friendly puppy’s wagging tail, or look for painted arrows along the path?
===END CHOICE POINT===

===OPTION A OUTCOME===
Liam followed the puppy, counting steps—one, two, three, four, five—until they reached a big helpful sign.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Liam found colorful arrows: red, blue, yellow. He followed them carefully, feeling calm and confident.
===END OPTION B OUTCOME===

With patience and courage, he finished the ${missionToUse.toLowerCase()} and cheered softly, "I did it!"

${ending}

The end. Would you like to go on another adventure with Liam? Or are you ready to join Liam in Dreamland?`;
  } else if (heroName.includes('garyn')) {
    storyTemplate = `# Garyn and the Gentle ${missionToUse}

${storyStarter}, Garyn found a cozy path in the ${placeToUse}. He liked to notice small details: the soft wind, the bright colors, and the shapes of leaves.

Garyn’s mission was ${missionToUse.toLowerCase()}, and he remembered to practice ${teachingPoint} to turn hard moments into calm ones.

===CHOICE POINT===
Should Garyn try the quiet route by the stream, or the sunny route past the meadow?
===END CHOICE POINT===

===OPTION A OUTCOME===
By the stream, Garyn listened to tiny splashes and counted three frogs hopping in a row.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
In the sunny meadow, Garyn spotted a circle, a square, and a triangle in the clouds, guiding him forward.
===END OPTION B OUTCOME===

With a peaceful smile, Garyn completed the ${missionToUse.toLowerCase()} and waved to the fluttering butterflies.

${ending}

The end. Would you like to go on another adventure with Garyn? Or are you ready to join Garyn in Dreamland?`;
  } else if (heroName.includes('bop') || heroName.includes('bop-bop') || heroName.includes('bunny') || heroName.includes('rabbit')) {
    storyTemplate = `# Bop-Bop's Beat and the ${missionToUse}

${storyStarter}, Bop-Bop the Beat Bunny bounced into the ${placeToUse}. Every hop made a tiny drum sound: bop, bop, bop!

Today’s mission was ${missionToUse.toLowerCase()}. Bop-Bop clapped a rhythm and remembered to practice ${teachingPoint} with every step.

===CHOICE POINT===
Should Bop-Bop follow the tapping sound in the trees, or lay down a slow beat to listen for echoes?
===END CHOICE POINT===

===OPTION A OUTCOME===
Bop-Bop followed the taps—one, two, three, four, five—and found a friendly woodpecker pointing the way with a beak salute.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Bop-Bop made a slow beat: boom, tap, boom, tap. The echoes formed a triangle, then a square, guiding him forward.
===END OPTION B OUTCOME===

With a joyful hop, he finished the ${missionToUse.toLowerCase()} and shouted, "Let’s hop to the top!"

${ending}

The end. Would you like to go on another adventure with Bop-Bop? Or are you ready to join Bop-Bop in Dreamland?`;
  } else if (heroName.includes('puffy') || heroName.includes('cloud') || heroName.includes('pup') || heroName.includes('dog')) {
    storyTemplate = `# Puffy's Soft ${missionToUse}

${storyStarter}, Puffy the Fluffy Cloud Pup drifted into the ${placeToUse}. He was shy, but very, very fluffy.

Puffy’s mission was ${missionToUse.toLowerCase()}, and he practiced ${teachingPoint} by taking gentle, floaty breaths.

===CHOICE POINT===
Should Puffy follow a string of tiny stars, or ask the breezy wind for two whispery hints?
===END CHOICE POINT===

===OPTION A OUTCOME===
Puffy followed the tiny stars. He counted softly—one, two, three, four, five—until the stars formed an arrow pointing ahead.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
The wind whispered, "Look for the circle cloud, then the triangle cloud." Puffy smiled and floated along the shapes.
===END OPTION B OUTCOME===

Soon he finished the ${missionToUse.toLowerCase()} and wagged his soft, cloud-like tail.

${ending}

The end. Would you like to go on another adventure with Puffy? Or are you ready to join Puffy in Dreamland?`;
  }

  // Generic hero fallback aligned to chosen options
  if (!storyTemplate) {
    const genericHero = hero || 'Our Friend';
    storyTemplate = `# ${genericHero}'s ${missionToUse}

${storyStarter}, ${genericHero} set out through the ${placeToUse}. With a calm smile, they practiced ${teachingPoint} and noticed ${educationalElement} along the way.

===CHOICE POINT===
Should they follow the colorful path, or ask a kind guide for two clues?
===END CHOICE POINT===

===OPTION A OUTCOME===
The colorful path showed red, blue, and yellow markers forming simple shapes that led the way.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
The kind guide shared two gentle hints: "Count to five" and "Look for the triangle sign." Step by step, it worked.
===END OPTION B OUTCOME===

With patience and care, ${genericHero} completed the ${missionToUse.toLowerCase()} and felt proud inside.

${ending}

The end. Would you like to go on another adventure with ${genericHero}? Or are you ready to join ${genericHero} in Dreamland?`;
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
