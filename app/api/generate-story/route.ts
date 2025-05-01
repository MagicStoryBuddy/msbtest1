import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with the key
// This is commented out for now as we'll use a mock generator for demo purposes
// const openai = new OpenAI({
//   apiKey: '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',
// });

// Mock story generator function
function generateMockStory(hero: string, place: string, mission: string): string {
  // Random teaching points suitable for 3-5 year olds
  const teachingPoints = [
    'sharing is caring',
    'being patient',
    'trying your best',
    'being kind to others',
    'helping friends',
    'telling the truth',
    'being brave when scared',
    'listening to grown-ups',
    'tidying up after playtime',
    'saying please and thank you'
  ];
  
  // Randomly select a teaching point
  const teachingPoint = teachingPoints[Math.floor(Math.random() * teachingPoints.length)];
  
  // Create story templates based on characters
  let storyTemplate = '';
  
  if (hero.includes('Robo Rex')) {
    storyTemplate = `# Robo Rex's Big Adventure

Once upon a time, there was a brave, slightly silly robot named Robo Rex. Robo Rex had shiny metal parts that went "click-clack" when he walked. He lived in a cozy little house in the ${place.toLowerCase()}.

Every day, Robo Rex would wake up and say, "Beep-boop! Today will be a wonderful day!" 

One sunny morning, Robo Rex heard a knock at his door. It was his friend Ollie the Owl.

"Robo Rex," hooted Ollie, "we need your help to ${mission.toLowerCase()}!"

"Oh my circuits!" said Robo Rex excitedly. "I'd love to help!"

Robo Rex packed his favorite tools in his robot backpack. He needed to be prepared for his mission.

When Robo Rex arrived at the ${place.toLowerCase()}, he saw the task would not be easy. But Robo Rex never gave up when things got hard.

"I will try my best," said Robo Rex with a determined beep.

First, Robo Rex tried using his extendable robot arms. Then, he used his special robot vision to see hidden things. Finally, he asked his friends to help because even brave robots need help sometimes.

Together, they worked and worked until... they did it! They managed to ${mission.toLowerCase()}!

Everyone cheered for Robo Rex and his friends.

That night, as Robo Rex got ready for sleep mode, he thought about his day. He learned that ${teachingPoint} makes everyone happier, even robots!

"Beep-boop! What a wonderful day," said Robo Rex as his robot eyes slowly closed.

And that's the end of Robo Rex's adventure. Sweet dreams!`;
  } 
  else if (hero.includes('Drake')) {
    storyTemplate = `# Drake the Dragon's Colorful Day

Once upon a time, there was a small dragon named Drake. Drake was the smallest dragon in his family, and he couldn't breathe fire like his brothers and sisters. Instead, when Drake tried to roar, colorful steam puffed from his nose!

Drake lived in a cozy cave near the ${place.toLowerCase()}.

"Oh dear, oh my!" Drake would often say when he was nervous, which was quite often indeed.

One bright morning, the ${place.toLowerCase()} was buzzing with excitement. Everyone was talking about how someone needed to ${mission.toLowerCase()}.

"M-m-me?" stammered Drake when the other animals asked for his help. "But I'm just a small dragon who can't even breathe fire!"

"Your colorful steam might be just what we need," said Tilly the Turtle kindly.

Drake wasn't sure, but he wanted to be brave. "I'll try my best," he said, puffing out a little purple steam.

Drake set off on his mission, his little dragon heart beating fast. Whenever he felt scared, he would take deep breaths, sending beautiful rainbow steam swirling around him.

As Drake worked on his mission to ${mission.toLowerCase()}, he discovered something amazing! His colorful steam was perfect for the job. It could reach high places, it could make patterns, and it made everyone smile!

By the end of the day, Drake had completed his mission. Everyone cheered!

"Three cheers for Drake!" they shouted.

That night, as Drake curled up in his cozy cave, he thought about what he had learned. Being different wasn't bad at all. And he had also learned that ${teachingPoint} makes everyone's day better.

"Oh happy day," Drake whispered as he drifted off to sleep, a tiny wisp of pink steam floating above his head.

And that's the end of Drake's colorful adventure. Sweet dreams!`;
  } 
  else {
    storyTemplate = `# Sparkles the Unicorn's Magical Journey

Once upon a time, in a land of rainbows and fluffy clouds, there lived a beautiful unicorn named Sparkles. Sparkles had a shimmery mane that changed colors in the sunlight and a magical horn that twinkled like the stars.

Sparkles loved to prance and play in the meadows near the ${place.toLowerCase()}.

One morning, as Sparkles was enjoying breakfast (magical berries, of course!), a little bunny hopped up with important news.

"Sparkles! Sparkles!" the bunny squeaked. "We need your help to ${mission.toLowerCase()}!"

Sparkles tossed her mane excitedly. "That sounds like a wonderful adventure!" she said in her gentle unicorn voice.

So off Sparkles went to the ${place.toLowerCase()}, her hooves making little "clip-clop" sounds as she trotted along.

When she arrived, Sparkles saw that the task would not be easy. But Sparkles believed in magic and kindness, which can solve many problems.

First, Sparkles tried using her magical horn to help. Then, she asked her woodland friends to join in. Everyone worked together, laughing and helping each other.

"Remember," Sparkles told her friends, "${teachingPoint} is the most powerful magic of all!"

With a final sprinkle of unicorn magic and lots of teamwork, they managed to ${mission.toLowerCase()}! The ${place.toLowerCase()} looked more beautiful than ever.

As the sun began to set, turning the sky pink and gold, Sparkles said goodbye to her friends.

"Thank you for a magical day," she neighed softly.

That night, as Sparkles lay down in her bed of clouds, she thought about the wonderful adventure. She had learned that when friends work together and remember that ${teachingPoint}, amazing things can happen.

"Sweet dreams, dear friends," Sparkles whispered as she drifted off to sleep, her horn glowing softly in the moonlight.

And that's the end of Sparkles' magical journey. Sleep tight!`;
  }
  
  return storyTemplate;
}

export async function POST(request: Request) {
  try {
    const { hero, place, mission } = await request.json();

    console.log('Generating story with:', { hero, place, mission });

    // For demo purposes, use the mock generator instead of OpenAI
    const story = generateMockStory(hero, place, mission);
    console.log('Story generated successfully using mock generator');
    
    return NextResponse.json({ story }, { status: 200 });

    /* Uncomment to use real OpenAI API when API key is properly set up
    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [
          {
            role: "system",
            content: "You are a talented children's storyteller. You create gentle, cozy, and engaging stories for young children that are easy to understand and have meaningful life lessons."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      // Extract the generated story from the response
      const story = completion.choices[0].message.content;
      console.log('Story generated successfully');

      // Return the generated story
      return NextResponse.json({ story }, { status: 200 });
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json({ 
        error: 'OpenAI API Error', 
        message: openaiError.message || 'Failed to generate story with OpenAI',
        details: openaiError.response?.data || openaiError 
      }, { status: 500 });
    }
    */
  } catch (error: any) {
    console.error('General error in story generation endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to generate story',
      message: error.message || 'Unknown error occurred' 
    }, { status: 500 });
  }
} 