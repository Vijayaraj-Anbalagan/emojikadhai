import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';


type StoryRequest = {
    emojis: string;
    genres: string[];
    characters: { name: string; description: string }[];
    storyLength: number;
  };



  export async function POST(request: NextRequest) {
    // Parse incoming request data
    const data: StoryRequest = await request.json();
    const apiKey = 'AIzaSyBF6YqAOdiMNXKBz5tlcEAfmA7pfaN_KHc';
    const genAI = new GoogleGenerativeAI(apiKey);

  // Set up the generative model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  // Build the prompt using the user input data
  const genreText = data.genres.join(', ');
  const characterText = data.characters.map((char, idx) => `Character ${idx + 1}: ${char.name} - ${char.description}`).join('. ');
  
  const emojiMeaning: { [key: string]: string } = {
    // Smileys & People
    '😀': 'general happiness and joy',
    '😃': 'excitement or a big smile',
    '😄': 'cheerfulness or broad smile',
    '😁': 'grinning with delight',
    '😆': 'laughing hard or uncontrollable laughter',
    '😅': 'relief or nervous laughter',
    '😂': 'laughing so hard tears come out',
    '🤣': 'rolling on the floor laughing',
    '😊': 'blushing or warmth',
    '😇': 'innocence or angelic behavior',
    '🙂': 'contentment or a slight smile',
    '🙃': 'sarcasm or upside-down humor',
    '😉': 'playfulness or a wink',
    '😌': 'relaxed or relieved',
    '😍': 'love at first sight or deep admiration',
    '😘': 'blowing a kiss',
    '😗': 'kissing without showing love',
    '😙': 'smiling while kissing',
    '😚': 'closed eyes while kissing',
    '😋': 'savoring delicious food',
    '😜': 'silly face or playful teasing',
    '😝': 'playful defiance',
    '🤪': 'zany or crazy fun',
    '🤨': 'raised eyebrow, suspicion',
    '🧐': 'curiosity or investigation',
    '🤓': 'nerdy or studious',
    '😎': 'coolness or confidence',
    '🤩': 'starstruck or amazed',
    '🥳': 'celebration or partying',
    '😏': 'smugness or sarcasm',
    '😒': 'indifference or neglect',
    '🙄': 'eye-rolling, boredom, or frustration',
    '😞': 'disappointment or sadness',
    '😔': 'sadness or dejection',
    '😟': 'concern or worry',
    '😕': 'confusion or uncertainty',
    '🙁': 'slight frown or sadness',
    '☹️': 'frown or sadness',
    '😣': 'frustration or anguish',
    '😖': 'distress or discomfort',
    '😫': 'tiredness or exhaustion',
    '😩': 'overwhelmed or stressed',
    '😢': 'crying or sadness',
    '😭': 'sobbing or extreme sadness',
    '😤': 'triumph or determination',
    '😡': 'anger or rage',
    '😠': 'annoyance or frustration',
    '🤬': 'cursing or anger',
    '😈': 'mischief or naughty behavior',
    '👿': 'evil or malice',
    '💀': 'death or danger',
    '☠️': 'danger or poison',
    '💩': 'silliness or nonsense',
    '🤡': 'clownish behavior or foolishness',
    '👻': 'ghost, spooky or playful haunting',
    '👽': 'alien or strange behavior',
    '🤖': 'robot or automation',
    '😺': 'smiling cat',
    '😸': 'grinning cat',
    '😹': 'cat laughing with tears',
    '😻': 'cat in love',
    '😼': 'sly or sneaky cat',
    '🙀': 'shocked or surprised cat',
    '😽': 'cat kissing',
    '😾': 'pouting or angry cat',
  
    // Gestures
    '👋': 'waving hello or goodbye',
    '🤚': 'raised hand, stopping or high-five',
    '🖐️': 'open hand, high-five or waving',
    '✋': 'stop or hand raised',
    '👌': 'OK or perfect',
    '🤏': 'pinching or small gesture',
    '✌️': 'peace or victory',
    '🤞': 'crossing fingers for luck',
    '🤟': 'I love you in sign language',
    '🤘': 'rock on or heavy metal',
    '🤙': 'call me or hang loose',
    '👈': 'pointing left',
    '👉': 'pointing right',
    '👆': 'pointing up',
    '👇': 'pointing down',
    '👍': 'thumbs up, approval',
    '👎': 'thumbs down, disapproval',
    '✊': 'fist for solidarity or power',
    '👊': 'fist bump or punch',
    '🤛': 'left-facing fist',
    '🤜': 'right-facing fist',
    '👏': 'applause or congratulations',
    '🙌': 'celebration, success, or excitement',
    '👐': 'open hands, offering or giving',
    '🤲': 'offering something or asking for help',
    '🙏': 'prayer, hope, or thank you',
    '🤝': 'handshake or agreement',
    '💅': 'self-care or showing off',
    '👂': 'listening or ear',
    '👃': 'smelling or nose',
    '👁️': 'eye or looking at something',
    '👀': 'watching, curiosity, or noticing',
    '👅': 'tongue, playfulness or licking',
    '👄': 'lips, talking or kissing',
    
    // Heart Emojis
    '❤️': 'love, deep affection',
    '💔': 'heartbreak or sadness',
    '❣️': 'love, excitement or emphasis',
    '💕': 'two hearts, affection or love',
    '💞': 'circling hearts, growing love',
    '💓': 'beating heart, excitement',
    '💗': 'growing heart, increasing love',
    '💖': 'sparkling heart, admiration',
    '💘': 'heart with arrow, cupid or love',
    '💝': 'heart with ribbon, gift of love',
    '💟': 'heart decoration, love symbol',
    '💜': 'purple heart, compassion or love',
    '💙': 'blue heart, calmness or trust',
    '💚': 'green heart, nature or jealousy',
    '💛': 'yellow heart, happiness or friendship',
    '🖤': 'black heart, sorrow or dark humor',
    '🤍': 'white heart, purity or love',
  
    // Animals
    '🐶': 'dog, loyalty or companionship',
    '🐱': 'cat, independence or curiosity',
    '🐭': 'mouse, small or cute',
    '🐹': 'hamster, small pet or cuteness',
    '🐰': 'rabbit, innocence or playfulness',
    '🦊': 'fox, cleverness or cunning',
    '🐻': 'bear, strength or warmth',
    '🐼': 'panda, gentleness or peace',
    '🐨': 'koala, calmness or Australia',
    '🐯': 'tiger, fierceness or courage',
    '🦁': 'lion, bravery or leadership',
    '🐮': 'cow, agriculture or nourishment',
    '🐷': 'pig, messiness or greed',
    '🐸': 'frog, cuteness or surprise',
    '🐵': 'monkey, playfulness or mischief',
    '🦄': 'unicorn, fantasy or uniqueness',
    '🐍': 'snake, danger or slyness',
    '🐢': 'turtle, patience or slowness',
    '🐦': 'bird, freedom or communication',
    '🦜': 'parrot, talking or mimicry',
    '🦩': 'flamingo, beauty or grace',
    '🦓': 'zebra, uniqueness or balance',
    '🐙': 'octopus, adaptability or mystery',
    '🦕': 'dinosaur, ancient or history',
    '🦖': 'T-rex, strength or dominance',
  
    // Food & Drink
    '🍏': 'green apple, health or freshness',
    '🍎': 'red apple, knowledge or health',
    '🍇': 'grapes, abundance or sweetness',
    '🍉': 'watermelon, summer or refreshment',
    '🍌': 'banana, fun or energy',
    '🍍': 'pineapple, tropical or hospitality',
    '🥭': 'mango, sweetness or tropical',
    '🍓': 'strawberry, sweetness or love',
    '🍒': 'cherries, indulgence or sensuality',
    '🍑': 'peach, bottom or sensuality',
    '🍋': 'lemon, sourness or zest',
    '🍔': 'burger, fast food or indulgence',
    '🍕': 'pizza, fun or indulgence',
    '🍟': 'fries, fast food or fun',
    '🍝': 'pasta, comfort or indulgence',
    '🍣': 'sushi, Japan or freshness',
    '🍦': 'ice cream, dessert or indulgence',
    '🍩': 'donut, fun or indulgence',
    '🍪': 'cookie, sweetness or comfort',
    '🍫': 'chocolate, indulgence or love',
    '🍷': 'wine, celebration or relaxation',
    '🍺': 'beer, fun or relaxation',
    '🥤': 'soft drink, refreshment or treat',
    '🍵': 'tea, calm or mindfulness',
    '☕': 'coffee, energy or focus',
  
    // Travel & Places
    '✈️': 'airplane, travel or vacation',
    '🚗': 'car, travel or independence',
    '🚕': 'taxi, city travel or commuting',
    '🚓': 'police car, law enforcement',
    '🏠': 'house, home or family',
    '🏢': 'office building, work or business',
    '🏖️': 'beach, relaxation or vacation',
    '⛰️': 'mountain, adventure or challenge',
    '🌋': 'volcano, explosive energy or danger',
    '🏕️': 'camping, outdoors or adventure',
    '🗽': 'Statue of Liberty, freedom or New York',
    '🗼': 'Eiffel Tower, Paris or romance',
  
    // Weather & Nature
    '☀️': 'sun, warmth or positivity',
    '🌧️': 'rain, sadness or calm',
    '⛈️': 'storm, trouble or energy',
    '❄️': 'snowflake, cold or uniqueness',
    '🌈': 'rainbow, hope or beauty',
    '🌙': 'moon, night or mystery',
    '💧': 'droplet, water or emotions',
    '🔥': 'fire, heat or passion',
    '⚡': 'lightning, energy or shock',
    '🌪️': 'tornado, chaos or intensity',
    '🌻': 'sunflower, happiness or growth',
    '🌊': 'wave, water or emotion',
  
    // Objects & Miscellaneous
    '📱': 'smartphone, technology or communication',
    '💻': 'laptop, work or study',
    '💡': 'lightbulb, idea or innovation',
    '📅': 'calendar, planning or scheduling',
    '🎉': 'party popper, celebration or fun',
    '🎁': 'gift, generosity or surprise',
    '🎈': 'balloon, celebration or fun',
    '⏰': 'alarm clock, time or urgency',
    '💣': 'bomb, danger or intensity',
    '🔔': 'bell, attention or alert',
    '🎓': 'graduation cap, learning or achievement',
    '🏅': 'medal, success or achievement',
    '💸': 'money, wealth or expenses',
    '🛒': 'shopping cart, consumerism or errands',
    '🔑': 'key, access or solution',
    '📞': 'telephone, communication or connection',
    '🛏️': 'bed, rest or relaxation',
  };
  
  const emojiInterpretation = data.emojis
    .split('')
    .map((emoji) => emojiMeaning[emoji] || 'an unknown expression')
    .join(', ');

    const prompt = `
    Create a ${genreText} story aimed at a young Tamil Nadu audience, specifically college-going students and IT professionals working in MNCs. The story should resonate with their daily lives, include popular Tamil movie references, memes, and social media trends that are widely shared among this group. 
  
    The story should feel contemporary, referencing current local affairs and events happening in Chennai, such as trending topics on social media, popular events, local weather (e.g., Chennai rains), cultural festivals, or any significant news, without being tied to one specific event. Keep the story fun and socially relatable, and make sure it includes nods to the lifestyle of young Tamil people, like their love for Kollywood, their use of popular memes, and their presence on platforms like Instagram and Twitter.
  
    Consider the meaning and flow of these emojis: ${emojiInterpretation}. Each emoji has an underlying expression or action, and the story should capture the essence of these emotions or actions in a way that reflects the real-life experiences and humor of the audience.
  
    Use the following characters and their descriptions, including their appearance and behavior, in the story: ${characterText}. The characters should feel like everyday Chennai college students or young professionals, relatable in their struggles, dreams, and friendships.
  
    The story should be ${data.storyLength} words long, written in a jolly, lighthearted manner that brings a smile to the reader’s face. The humor should reflect the witty, meme-driven nature of social media in Tamil Nadu, with playful references to current Tamil culture and daily life. make sure the story is engaging, entertaining, and filled with the spirit of Chennai’s vibrant youth culture. and the emojies are ${data.emojis} and their meaning is ${emojiInterpretation} this should be the key element of the story. make sure it is a story with proper beginning, middle and end. dont use any abusive language or any adult content. and it should not feel wantedly adding the emojis. make sure the emojis are used in a proper way. and dont add the reference and colocial touch movie refence anf memes in a forced way. make sure it is a natural flow but u shld use it to make more engagements. dont go above the word limit
  `;
  

  // Configure generation options
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: data.storyLength * 4, // Adjust token count based on word length
    responseMimeType: 'application/json',
  };

  console.log('UserData:', data);

  // Start a new chat session with Google Generative AI
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: 'Hii',
          },
        ],
      },
    ],
  });

  // Generate the story by sending the prompt
  const result = await chatSession.sendMessage(prompt);
  const textResponse = await result.response.text(); // Get the raw text response from the AI
  
  console.log('Full API Response Text:', textResponse); // Log the full response for debugging

  // Return the generated story in the response
  return new NextResponse(textResponse, {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
  });
}