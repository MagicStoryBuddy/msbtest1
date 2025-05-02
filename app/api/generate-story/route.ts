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

IMPORTANT STORYTELLING GUIDANCE:
- Introduce the character naturally without frontloading all their traits and background information at the beginning.
- Instead of describing everything about the character in the introduction, reveal their traits, likes, dislikes, and relationships organically throughout the story when relevant to the action.
- For example, if a character likes a certain drink, mention it when they're taking a break during their adventure rather than listing it in the introduction.
- Allow readers to learn about the character through their actions and responses to situations rather than through exposition.
- If a character has family members or friends, introduce them naturally when they become relevant to the story rather than listing them all at the start.

Please write the story using gentle, cozy language with simple sentence structure appropriate for 3-5 year olds. Use short paragraphs, repetition where appropriate, and leave room for imagination.

The story should have a clear beginning, middle, and end structure, with a satisfying resolution to the mission.

IMPORTANT: In the middle of the story, include ONE "choose your own path" moment. This should appear in a format like:

===CHOICE POINT===
The character faced a choice. Should they [Option A] or [Option B]?
===END CHOICE POINT===

===OPTION A OUTCOME===
[Describe what happens if Option A is chosen, leading to the resolution of the story]
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
[Describe what happens if Option B is chosen, leading to the resolution of the story]
===END OPTION B OUTCOME===

Make the choice point creative and meaningful, with distinct paths that feel different but both lead to success. Avoid always using the "do it alone vs. ask for help" pattern. Instead, create more varied and interesting choices that children would find engaging, such as:

- Different routes to take (over a mountain vs. across a bridge)
- Different approaches to a problem (using logic vs. using creativity)  
- Different tools/items to use (a map vs. a magic key)
- Different creatures to interact with (a friendly dragon vs. a wise owl)
- Different environments to explore (a dark cave vs. a sunny meadow)
- Different methods (being quiet and sneaky vs. being brave and direct)
- Different times of day (waiting until night vs. going during daytime)
- Different emotions to express (showing sadness vs. showing excitement)

Each choice should lead to a different but equally valid way to complete the mission, with unique challenges, experiences, and small lessons along each path.

This format will allow our app to present an interactive choice to the child, showing only the outcome they choose.

Use whimsical, cozy, simple English throughout the story.

End the story with "The end. Would you like to go on another adventure with [CHARACTER NAME]? Or are you ready to join [CHARACTER NAME] in Dreamland?"
`;

  console.log('Sending request to OpenAI with prompt:', prompt.substring(0, 200) + '...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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

    console.log('OpenAI API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Unexpected OpenAI API response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from OpenAI API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateOpenAIStory:', error);
    throw error;
  }
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

${storyStarter}, a robot named Robo Rex was polishing his metal arms until they gleamed in the sunlight. His antenna twitched excitedly—he could sense this would be no ordinary day.

"Beep-boop! Today feels wonderful already," Robo Rex said to himself.

As Robo Rex was organizing his toolbox in his cozy house in the ${place.toLowerCase()}, he heard a knock at his door. When he opened it, he found his friend Ollie the Owl looking rather worried.

"Robo Rex, we need your help," hooted Ollie. "There's a problem in the ${place.toLowerCase()}. We need someone to ${mission.toLowerCase()} right away!"

Robo Rex's eyes lit up bright blue with excitement. "I'd be happy to help!" His voice made little clicking sounds between words, something that always happened when he was enthusiastic.

As they headed to the problem spot, Robo Rex's metal feet went click-clack on the path. Some of the smaller animals giggled as he walked—Robo Rex always had a slightly silly way of moving that made others smile.

When they arrived, Robo Rex carefully assessed the situation. It definitely wouldn't be simple, but he was programmed never to give up on a challenge!

While thinking about the best approach, Robo Rex practiced ${educationalElement}. Learning new things always helped his circuits work better.

===CHOICE POINT===
After examining the problem, Robo Rex realized that to ${mission.toLowerCase()}, he would first need to move a large boulder blocking the way.

"Hmm, beep-beep," he said, tapping his metal head thoughtfully. "I see two possible solutions."

Should Robo Rex [use his super-strong robot arms to lift the boulder] or [build a clever pulley system using ropes and a tree]?
===END CHOICE POINT===

===OPTION A OUTCOME===
"I'll use my strength for this one," Robo Rex decided. He stretched out his expandable metal arms and carefully positioned them around the boulder.

"One, two, three, LIFT!" counted Robo Rex, his internal motors whirring loudly with the effort.

The boulder was heavier than expected! As Robo Rex strained to lift it, his face display changed colors—from green to yellow to red—showing how hard he was working.

"Must... not... give... up!" he said between mechanical huffs. As he carried the heavy load, he noticed different shapes in the rock. "Look! A square pattern here... and a circle there... and even a triangle!" he observed, always curious about the world around him.

With a final surge of power and a triumphant "BOOP!" Robo Rex placed the boulder in a perfect spot where it could serve as a bench for tired travelers.

The path now clear, Robo Rex was able to ${mission.toLowerCase()}! The other animals cheered for their brave robot friend.

Robo Rex's chest panel glowed warmly. He learned that sometimes using your natural strengths is the best way to solve a problem.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
"I think I'll try something clever," Robo Rex decided. Rather than just using brute strength, he began collecting sturdy vines and examining the nearby trees.

"A simple machine will help us," he explained, sketching a diagram in the dirt with his extendable finger. Some of the younger animals gathered around, curious about what the slightly silly robot was planning.

Robo Rex tied one end of a vine around the boulder, then looped the other end over a strong tree branch. "This creates a mechanical advantage," he explained, his voice clicking with excitement about the science involved.

As he worked, Robo Rex counted aloud: "One pulley, two ropes, three knots, four steps to success!" His methodical approach was why everyone in the ${place.toLowerCase()} often sought his help with tricky problems.

When everything was ready, Robo Rex pulled the rope with a steady, controlled force. His gears whirred happily as the boulder slowly moved aside, clearing the path without any strain.

"Science is wonderful!" Robo Rex beeped joyfully as he successfully completed the mission to ${mission.toLowerCase()}!

Everyone was impressed by how Robo Rex had solved the problem using his brainpower instead of just his strength. He learned that sometimes a thoughtful approach works better than raw power.
===END OPTION B OUTCOME===

With the mission complete, Robo Rex's heart-light glowed a happy pink color. The animals of the ${place.toLowerCase()} celebrated and thanked their robot friend.

Feeling playful, Robo Rex did his famous "robot dance" that always made everyone laugh. His slightly silly movements and beeping sounds had all the younger animals trying to copy him.

As evening fell, Robo Rex walked home, his metal parts gleaming in the sunset. He felt proud of what he'd accomplished and the lessons he'd learned about ${teachingPoint}.

At home, Robo Rex carefully cleaned his gears and prepared for sleep mode. "Beep-boop, what a wonderful day," he whispered as his systems gradually powered down. His last thought before sleeping was about what adventure might come tomorrow.

The end. Would you like to go on another adventure with Robo Rex? Or are you ready to join Robo Rex in Dreamland?`;
  } 
  else if (hero.includes('Drake')) {
    storyTemplate = `# Drake's Big Adventure

${storyStarter}, there was a small dragon named Drake. Drake was the smallest dragon in his family, and he couldn't breathe fire like his brothers and sisters - only colorful steam!

Drake was a bit dramatic and loved to boast about his adventures. "I, the MIGHTY Drake, am the bravest dragon ever!" he would announce. But secretly, Drake was a little scared of many things, like loud noises and dark caves.

One morning, while Drake was practicing his steam-breathing (it came out pink today!), a turtle named Terence slowly walked up to him.

"Drake," said Terence, "we need your help to ${mission.toLowerCase()} in the ${place.toLowerCase()}!"

"I, the MAGNIFICENT Drake, shall help!" Drake announced loudly, puffing out his chest. But inside, his heart was beating fast with nervousness.

Drake packed a small bag with his favorite snacks (toasted marshmallows) and set off for the ${place.toLowerCase()}.

When Drake arrived, he saw that the task would not be easy. His knees shook a little, but he remembered what his mother always said: "Even scared dragons can be brave."

As Drake was figuring out what to do, he came across two different ways to solve the problem.

"Oh scales!" exclaimed Drake. "Which way should I choose?"

He could either climb up the tall, wobbly ladder to reach the high shelf, or he could ask the birds to help fly things down to him.

*Should Drake climb the wobbly ladder or ask the birds for help?*

Drake thought about it and decided to ask the birds for help. Even though he wanted to show he could do it alone, Drake remembered that teamwork often makes things easier.

The friendly birds were happy to help, and together they worked on the mission. Drake used his colorful steam to signal directions to the birds. Pink puffs meant "go left" and blue puffs meant "go right."

As they worked, Drake practiced ${educationalElement}. It was fun to learn new things while helping others!

With everyone working together, they managed to ${mission.toLowerCase()}! Drake was so excited that he let out a big puff of rainbow-colored steam that made everyone laugh.

That night, as Drake curled up in his cozy dragon bed, he thought about his adventure. He learned that ${teachingPoint} and that it's okay to ask for help. He also learned that even small dragons who breathe steam instead of fire can do important things.

"I, the SLEEPY Drake, had a wonderful day," he whispered as he closed his eyes.

The end. Would you like to go on another adventure with Drake? Or are you ready to join Drake in Dreamland?`;
  } 
  else if (hero.includes('Mila TanTan')) {
    storyTemplate = `# Mila TanTan's Big Adventure

${storyStarter}, a tiny baby named Mila TanTan was having a lovely morning. Her bright eyes sparkled as sunlight danced through the window.

"You look ready for an adventure today!" said a gentle voice. It was a colorful butterfly fluttering near Mila's crib.

Mila giggled and reached for the butterfly. In her baby language of coos and babbles, she seemed curious about what the butterfly had to say.

"We need someone special to help ${mission.toLowerCase()} in the ${place.toLowerCase()}," the butterfly explained. "Would you like to come?"

Mila clapped her tiny hands excitedly. This sounded fun!

Before leaving, Mila's mom (who everyone called Mommy Moo) gave her some special milk. Mila drank it all up, feeling strong and ready for her adventure.

When they arrived at the ${place.toLowerCase()}, Mila looked around with wide, curious eyes. The butterfly explained that they needed to ${mission.toLowerCase()}, but it wouldn't be easy.

Mila wasn't worried. She might be small, but she was brave. When she spotted a problem, she wiggled in excitement, ready to help solve it.

As Mila explored, she practiced ${educationalElement}. Her giggles echoed around as she learned new things.

During a rest break, Mila's dad (known as Daddy Doo) appeared to check on her. He gave her a gentle cuddle that made her feel safe and happy. "You're doing great, little one," he said with a proud smile.

With determination and her special baby charm, Mila soon found a way to ${mission.toLowerCase()}! Even the oldest animals in the ${place.toLowerCase()} were amazed.

"Baby Mila did it!" they cheered. One friendly squirrel commented, "She's just as clever as her cousins! Reminds me of how Liam solved that soccer ball puzzle last week, and little Garyn with those amazing eyelashes who helped us find the missing nuts."

That evening, as stars began twinkling in the sky, Mila yawned sleepily. Her adventure had taught her that ${teachingPoint} makes everything better, and that even the smallest babies can make a big difference.

As Mila drifted off to sleep in her cozy crib, she dreamed of all the new adventures waiting for her tomorrow.

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
  else if (hero.includes('Futa')) {
    storyTemplate = `# Futa's Amazing Adventure

${storyStarter}, a boy named Futa woke up to the sound of birds singing outside his window. He stretched, smiled, and jumped out of bed ready for whatever the day might bring.

"Today feels like a special day," Futa said to himself, looking at his collection of Chip and Dale figurines on his shelf.

While eating breakfast, Futa heard a tapping sound at the window. He turned to see a little squirrel that looked just like Chip from his favorite cartoon!

"Futa! We need your help at the ${place.toLowerCase()}," the squirrel chittered. "We need someone to ${mission.toLowerCase()}!"

"Oh wow!" Futa's eyes grew wide with excitement. "A real adventure, just like in my cartoons!"

Futa quickly packed his small backpack. "I should bring something to drink," he thought. He carefully filled his special bottle with warm Mugicha tea, his favorite. "But no water," he reminded himself with a little frown. Futa never liked water much.

On his way out, he poked his head into another room. "Mama, I'm going on an adventure!"

"Be back for dinner," his mother replied with a smile. She was arranging alphabet cards on a table—preparing lessons, as she always did. After all, everyone said Yumiko was the best ABC teacher in town.

When Futa arrived at the ${place.toLowerCase()}, he took a deep breath. This mission would be tricky, but he felt ready!

As he explored, Futa practiced ${educationalElement}. "This is fun!" he said. "I bet Mama would be proud of how I'm learning."

===CHOICE POINT===
Soon, Futa came to an interesting spot in his journey. Before him were two magical objects.

"Oh!" he said, looking at both objects with wonder. "Which one should I use for my adventure?"

Should Futa [use the glowing map that shows hidden paths] or [try the musical bell that makes friendly animals appear]?
===END CHOICE POINT===

===OPTION A OUTCOME===
Futa picked up the glowing map, which immediately lit up with colorful lines showing secret paths.

"Wow! So many colors!" Futa said, his eyes sparkling. He carefully counted each path on the map. "One, two, three, four, five different ways to go!"

Following the map, Futa walked along a red path, then turned onto a blue one, and finally followed a green path that led him exactly where he needed to go. Along the way, he hummed his favorite Chip and Dale theme song to keep himself company.

"This map is amazing," Futa said, sipping some of his Mugicha tea to stay refreshed. The warm tea reminded him of home and gave him courage.

With the map's guidance, Futa successfully completed his mission to ${mission.toLowerCase()}! Everyone was amazed at how quickly he'd found the way.

Futa learned that sometimes having the right tool makes all the difference when solving problems.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
Futa picked up the musical bell and gave it a gentle ring. It made a sweet, twinkling sound that echoed through the air.

"La-la-la," Futa hummed along, delighted by the pretty melody. To his amazement, animals began appearing one by one: first a rabbit, then two squirrels, then three birds, and finally four tiny deer.

"Hello everyone," Futa said, giving a polite bow just like his mama had taught him. "I'm Futa. Would you help me with something important?"

The animals nodded eagerly and led Futa to a beautiful meadow with triangle-shaped flowers growing in a perfect circle. In the center was exactly what Futa needed to ${mission.toLowerCase()}!

When one of the deer offered Futa some water, he politely declined and took a sip of his Mugicha tea instead. "This is my favorite," he explained.

With the animals' help, Futa completed his mission! He discovered that making new friends and working together can make any challenge easier.
===END OPTION B OUTCOME===

As the sun began to set, Futa thanked everyone for their help. "Mama always says helping others makes the world better," he said with a proud smile.

That evening when Futa returned home, his mother Yumiko was waiting with a warm hug and fresh Mugicha tea. As they sat together, Futa told her all about his adventures.

"And do you know what I learned today?" Futa asked, his eyes serious. "I learned that ${teachingPoint} is really, really important."

Yumiko smiled and kissed the top of his head. "That's a wonderful lesson, my little explorer."

As Futa snuggled into bed that night, he arranged his Chip and Dale toys on his pillow and dreamed of what adventure might come next.

The end. Would you like to go on another adventure with Futa? Or are you ready to join Futa in Dreamland?`;
  }
  else {
    storyTemplate = `# Sparkles the Unicorn's Magical Journey

${storyStarter}, a unicorn named Sparkles was prancing through a field of flowers. As the sunlight touched her mane, it seemed to change from purple to pink to blue—shifting colors like a rainbow.

Sparkles paused to smell a particularly beautiful rose when she heard a small voice calling to her. A little bunny was hopping excitedly nearby.

"Sparkles! We need your help!" the bunny squeaked. "There's a problem in the ${place.toLowerCase()}. We need someone to ${mission.toLowerCase()}!"

Sparkles' eyes sparkled with interest. "That sounds like an adventure!" she said in her gentle voice. Her horn gave a tiny twinkle, which always happened when she was excited about something new.

"I'll help," Sparkles promised, lowering her head so the bunny could climb onto her back for the journey.

As they trotted toward the ${place.toLowerCase()}, Sparkles hummed a happy tune. The bunny noticed how other creatures stopped to watch them pass—everyone loved seeing Sparkles because she brought joy wherever she went.

When they arrived, Sparkles saw the challenge ahead. It wouldn't be easy, but that didn't worry her. "We can figure this out together," she said confidently.

While exploring the area, Sparkles practiced ${educationalElement}. She loved learning new things and sharing her knowledge with others.

===CHOICE POINT===
Soon, Sparkles discovered that to ${mission.toLowerCase()}, she would need to cross a huge rainbow waterfall first. The spray was creating so much mist that it was difficult to see the other side.

"What would be the best way to get across?" Sparkles wondered aloud, her horn glowing softly as she thought.

Should Sparkles [wait patiently until nighttime when the moon's light makes the waterfall calmer] or [use her horn's magic to create a rainbow bridge]?
===END CHOICE POINT===

===OPTION A OUTCOME===
"I think patience might be our friend here," Sparkles decided. "Let's wait until nightfall."

As the sun set and the moon rose high in the sky, the waterfall became gentler, and the mist cleared away. In the soft moonlight, Sparkles could see something she hadn't noticed before—five stepping stones crossing the water, each one a different color.

"Look at those beautiful stones," Sparkles whispered, her mane shimmering silver in the moonlight. "Let's count them! One, two, three, four, five!"

Each stone glowed as Sparkles touched it with her hoof: "Red, orange, yellow, green, blue!" she called out, naming each color as she crossed.

On the other side, Sparkles discovered a small hidden cave with walls that sparkled like diamonds. Inside was exactly what she needed to ${mission.toLowerCase()}!

"The moon showed us the way," Sparkles said, her horn glowing gently with happiness. She had learned that sometimes waiting for the right moment is better than rushing ahead.
===END OPTION A OUTCOME===

===OPTION B OUTCOME===
"I think I'll try using my magic," Sparkles decided. She closed her eyes and focused her thoughts on her horn, which began to glow brighter and brighter.

"Red, orange, yellow, green, blue, purple," Sparkles chanted as colors swirled from her horn in beautiful streams of light.

The bunny watched in awe as the colors stretched across the waterfall, weaving together to form a perfect semicircle bridge—just like the rainbows in the sky after it rains.

"It worked!" Sparkles neighed happily, her mane flowing with vibrant colors. "What a beautiful half-circle shape, just like a real rainbow!"

As they crossed the magical bridge, Sparkles' hooves made tiny musical sounds with each step. On the other side, they found a meadow filled with star-shaped flowers, and among them was exactly what they needed to ${mission.toLowerCase()}!

The magic from Sparkles' horn had not only created a bridge but had also illuminated a hidden path that led them exactly where they needed to go. Sparkles learned that using your special talents can open unexpected paths to success.
===END OPTION B OUTCOME===

With the mission complete, Sparkles gave a joyful leap into the air, her mane catching the light and sending tiny rainbows dancing across the ${place.toLowerCase()}.

"We did it!" she neighed happily. Her horn gave an extra bright twinkle of celebration.

As evening approached, painting the sky in beautiful pinks and purples, Sparkles said goodbye to her new friends. "Thank you for letting me help," she said with a gentle bow of her head.

That night, as Sparkles curled up in her soft bed of clouds, she thought about the day's adventure. The most important thing she had learned was that ${teachingPoint}—a lesson worth remembering, even for magical unicorns.

Her horn glowed softly as she drifted off to sleep, casting gentle star shapes on the ceiling of her cloud home.

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