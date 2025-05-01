import { NextResponse } from 'next/server';

// Flag to toggle whether we should even attempt to use OpenAI
// Set to false to always use built-in storyteller and skip API calls
const ENABLE_OPENAI = true;

// Store API key directly in a const for testing
const API_KEY = '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';

// Skip testing OpenAI connection if disabled
if (ENABLE_OPENAI) {
  (async () => {
    try {
      console.log('Testing OpenAI connection...');
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('OpenAI connection successful. Available models:', data.data.length);
      } else {
        console.error('OpenAI connection test failed with status:', response.status);
        const text = await response.text();
        console.error('Response body:', text);
      }
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
    }
  })();
} else {
  console.log('OpenAI integration is disabled. Using built-in storyteller only.');
}

// Direct OpenAI API call function (without using the client library)
async function generateOpenAIStory(hero: string, place: string, mission: string, lifeSkill?: string): Promise<string> {
  const prompt = `
Create a gentle, cozy bedtime story for children aged 3-5 years old that is about 3-5 minutes when read aloud.

The main character is: ${hero}
The setting is: ${place}
The mission is: ${mission}
${lifeSkill ? `The story should teach about: ${lifeSkill}` : ''}

Include one age-appropriate teaching point in the story, such as ${lifeSkill || 'sharing, being kind, patience, or overcoming a small fear'}.

Please also include simple educational elements appropriate for 3-5 year olds, like colors, counting 1-10, shapes, or simple alphabet concepts.

Please write the story using gentle, cozy language with simple sentence structure appropriate for 3-5 year olds. Use short paragraphs, repetition where appropriate, and leave room for imagination.

The story should have a clear beginning, middle, and end structure, with a satisfying resolution to the mission.

End the story with "The end. Would you like to go on another adventure with [CHARACTER NAME]? Or are you ready to join [CHARACTER NAME] in Dreamland?"
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a talented children\'s storyteller. You create gentle, cozy, and engaging stories for young children that are easy to understand and have meaningful life lessons.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Enhanced built-in story generator with more variety
function generateBuiltInStory(hero: string, place: string, mission: string, lifeSkill?: string): string {
  // Use the provided life skill or select a random teaching point
  let teachingPoint = '';
  
  if (lifeSkill) {
    teachingPoint = lifeSkill.toLowerCase();
  } else {
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
    teachingPoint = teachingPoints[Math.floor(Math.random() * teachingPoints.length)];
  }
  
  // Educational elements for 3-5 year olds
  const educationalElements = [
    'counting from one to five',
    'recognizing colors like red, blue, green, and yellow',
    'identifying shapes such as circles, squares, and triangles',
    'saying the first few letters of the alphabet',
    'learning about simple emotions like happy, sad, and excited',
    'understanding concepts like big and small, up and down'
  ];
  
  // Randomly select an educational element
  const educationalElement = educationalElements[Math.floor(Math.random() * educationalElements.length)];
  
  // Random story starters
  const storyStarters = [
    'Once upon a time',
    'In a faraway land',
    'Long ago',
    'On a bright sunny day',
    'In a magical place',
    'One cozy evening'
  ];
  
  // Random ending phrases
  const endings = [
    'Sweet dreams!',
    'And they all lived happily ever after.',
    'The End.',
    'Goodnight, little one.',
    'Until the next adventure!'
  ];
  
  // Randomly select story elements
  const storyStarter = storyStarters[Math.floor(Math.random() * storyStarters.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  
  // Create story templates based on characters
  let storyTemplate = '';
  
  if (hero.includes('Robo Rex')) {
    storyTemplate = `# Robo Rex's Big Adventure

${storyStarter}, there was a brave, slightly silly robot named Robo Rex. Robo Rex had shiny metal parts that went "click-clack" when he walked. He lived in a cozy little house in the ${place.toLowerCase()}.

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

The end. Would you like to go on another adventure with Robo Rex? Or are you ready to join Robo Rex in Dreamland?`;
  } 
  else if (hero.includes('Drake')) {
    storyTemplate = `# Drake the Dragon's Colorful Day

${storyStarter}, there was a small dragon named Drake. Drake was the smallest dragon in his family, and he couldn't breathe fire like his brothers and sisters. Instead, when Drake tried to roar, colorful steam puffed from his nose!

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

The end. Would you like to go on another adventure with Drake? Or are you ready to join Drake in Dreamland?`;
  } 
  else if (hero.includes('Mila TanTan')) {
    storyTemplate = `# Mila TanTan's Big Adventure

${storyStarter}, there was a cute little baby named Mila TanTan. Mila had the biggest, brightest smile and the sweetest little giggle that made everyone around her happy.

Mila loved getting cuddles from her Mommy Moo and Daddy Doo. She would wave her tiny hands and kick her little feet with excitement whenever they came near. Mila also had two cousins she loved to see - Liam, who was 7 years old and played soccer, and Garyn, who was 8 months old with the longest eyelashes.

One sunny morning, while Mila was enjoying her breakfast of Mommy's Magic Milk, she heard a soft voice. It was her friend, the gentle butterfly.

"Mila TanTan," fluttered the butterfly, "we need your help to ${mission.toLowerCase()} in the ${place.toLowerCase()}!"

"Goo-goo ga-ga!" Mila babbled happily, which meant "I'll try!" in baby language.

Mila didn't know how she would complete this big task because she was just a little baby, but she was very brave. She finished drinking Mommy's Magic Milk, which made her feel strong and ready for an adventure.

When Mila arrived at the ${place.toLowerCase()}, she saw that it would not be an easy job. But Mila TanTan never gave up, even when things seemed hard.

As Mila worked on her mission, she practiced ${educationalElement}. She giggled with delight as she learned new things.

With the help of her animal friends and her special baby powers, Mila was able to ${mission.toLowerCase()}! Everyone in the ${place.toLowerCase()} clapped and cheered.

"Baby Mila did it!" they all said.

That night, as Mommy Moo and Daddy Doo tucked Mila into her cozy crib, she thought about her big day. She had learned that ${teachingPoint} makes everything better. She had also learned that even the smallest babies can do big things with help from friends and family.

Mila yawned and closed her eyes, dreaming of her next adventure with her cousins Liam and Garyn.

The end. Would you like to go on another adventure with Mila TanTan? Or are you ready to join Mila TanTan in Dreamland?`;
  }
  else if (hero.includes('Liam')) {
    storyTemplate = `# Liam's Big Adventure

${storyStarter}, there was a seven-year-old boy named Liam. Liam loved playing soccer and zooming his blue pickup trucks around. He had a little brother named Garyn and a cousin named Mila TanTan.

Liam was really good at soccer. He could kick the ball really far and run super fast. He also loved his collection of blue pickup trucks that he lined up neatly in his room.

One bright morning, while Liam was eating breakfast (not Grandpa Bop's yucky healthy food, thankfully!), he heard someone calling his name.

"Liam! Liam!" the voice called. "We need your help to ${mission.toLowerCase()} in the ${place.toLowerCase()}!"

"That sounds like an adventure!" said Liam with excitement. He put on his favorite soccer jersey for good luck and grabbed his best blue pickup truck.

When Liam arrived at the ${place.toLowerCase()}, he could see it wouldn't be an easy task. But Liam was brave and ready for anything.

First, Liam tried using his soccer skills to help. He kicked small objects out of the way and showed off his fancy footwork. Then, he used his blue pickup truck to carry important things. It was the perfect tool for the job!

As Liam worked on his mission, he practiced ${educationalElement}. He even made a fun game out of it!

With determination and creativity, Liam was able to ${mission.toLowerCase()}! Everyone was so impressed with his clever ideas.

That evening, as Liam told his little brother Garyn all about his adventure, he realized something important. He had learned that ${teachingPoint} makes everyone's day better. He had also learned that being a big brother means being brave and helping others.

"It was the best day ever," Liam said as he arranged his blue pickup trucks before bed.

The end. Would you like to go on another adventure with Liam? Or are you ready to join Liam in Dreamland?`;
  }
  else if (hero.includes('Garyn')) {
    storyTemplate = `# Garyn's Wonderful Day

${storyStarter}, there was an eight-month-old baby boy named Garyn. Garyn had the longest eyelashes anyone had ever seen and a smile that could light up the darkest room.

Garyn was the little brother of Liam and a cousin to Mila TanTan. He couldn't walk or talk yet, but he was curious about everything around him.

Every morning, Garyn's mom would sing to him: "He's a Hap-py, Happy Boy, he's a happy happy happy boy!" This always made Garyn giggle and wiggle his tiny toes.

One sunny day, the animals in the ${place.toLowerCase()} were very worried. They needed someone to help ${mission.toLowerCase()}, but didn't know who to ask.

A friendly bird flew by and noticed Garyn's bright smile. "Maybe this happy baby can help us!" chirped the bird.

Although Garyn couldn't talk yet, he babbled excitedly, which meant "I'll try!" in baby language.

When they arrived at the ${place.toLowerCase()}, everyone was rushing around trying to solve the problem. Garyn watched with his big eyes, his long eyelashes fluttering with curiosity.

As the day went on, Garyn practiced ${educationalElement}. He was learning new things every day!

Suddenly, Garyn let out a happy laugh that was so full of joy, it gave everyone a wonderful idea! Sometimes, a fresh perspective is all that's needed.

Working together, using the idea inspired by Garyn's laugh, they were able to ${mission.toLowerCase()}!

Garyn's big brother Liam was very proud and gave him a gentle high-five.

That night, as Garyn drifted off to sleep, his mom sang his special song. Garyn had learned that ${teachingPoint} makes the world better. He had also learned that even the smallest people can help in big ways, just by being themselves.

With a tiny yawn, Garyn closed his eyes, his long eyelashes resting against his cheeks.

The end. Would you like to go on another adventure with Garyn? Or are you ready to join Garyn in Dreamland?`;
  }
  else {
    storyTemplate = `# Sparkles the Unicorn's Magical Journey

${storyStarter}, in a land of rainbows and fluffy clouds, there lived a beautiful unicorn named Sparkles. Sparkles had a shimmery mane that changed colors in the sunlight and a magical horn that twinkled like the stars.

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

The end. Would you like to go on another adventure with Sparkles? Or are you ready to join Sparkles in Dreamland?`;
  }
  
  return storyTemplate;
}

export async function POST(request: Request) {
  try {
    const { hero, place, mission, lifeSkill } = await request.json();

    console.log('Generating story with:', { hero, place, mission, lifeSkill });

    // If OpenAI is disabled, skip the API call attempt
    if (!ENABLE_OPENAI) {
      console.log('Using built-in storyteller (OpenAI disabled)');
      const story = generateBuiltInStory(hero, place, mission, lifeSkill);
      return NextResponse.json({ 
        story,
        // Don't show the fallback message since this is the intended behavior
        usedFallback: false
      }, { status: 200 });
    }

    try {
      console.log('Attempting to call OpenAI API directly...');
      
      // Use our direct API call implementation
      const story = await generateOpenAIStory(hero, place, mission, lifeSkill);
      console.log('Story generated successfully with OpenAI');

      // Return the generated story
      return NextResponse.json({ story, usedFallback: false }, { status: 200 });
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError);
      console.log('Error details:', openaiError.message);
      console.log('Falling back to built-in storyteller');
      
      // Fall back to the built-in generator if OpenAI fails
      const fallbackStory = generateBuiltInStory(hero, place, mission, lifeSkill);
      
      return NextResponse.json({ 
        story: fallbackStory,
        usedFallback: true
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('General error in story generation endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to generate story',
      message: error.message || 'Unknown error occurred' 
    }, { status: 500 });
  }
} 