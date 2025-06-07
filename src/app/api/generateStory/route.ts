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
    const apiKey = 'AIzaSyABlXTbh49nBJjBxsLfTG8RVa6-zpy8UA0';
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

  const memeReferences = [
    "Dei avan sethutan da",
    "Namala mudichivitanga da",
    "Irrunga bhai, naan varuven",
    "Inga yaara thaduka mudiyadhu",
    "Na oru thadava sonna nooru thadava sonna maari",
    "Massu da",
    "Aiyayo paavam",
    "Vaa machi plan pannu",
    "Kadavul paakum pola",
    "Game over da",
    "Enna ma neenga ipdi panreengale ma",
    "Appove sonnen",
    "Enga ooru la naanga thaan law-u",
    "Semma mass",
    "Evanda Mavan",
    "Therla pa",
    "Pinnaadi varuven",
    "Kalakku",
    "Kattipudi va",
    "Seri da poyi sapudunga",
    "Antha kaaram oru aal vidave",
    "Naane vechu iruken",
    "Otha solli vittan da",
    "Aapu illa ma, aappu than",
    "Enakku un mel evlo kovam theriyuma",
    "Vetti scene podatha",
    "Aval thaan matter",
    "Thanni adichitta nee mass da",
    "Romba mukkiyam pa",
    "Apdiyaaa?",
    "Light ah eduthu veliya poidu",
    "Theriyaama ponavanum theriama irukkanum",
    "Adi dhadi vaa da",
    "Veeraiya veera veera",
    "Vedi vedi da",
    "Enna pa solluveenga",
    "Mudiyala pa",
    "Kadavul irukkaan kumaru",
    "Adikadi sonnaum puriyala",
    "Seri, avlo dhan da",
    "Indha game namakku thevaiya",
    "Varen di paathu irunga",
    "Romba nallavanu irukan pa",
    "Adada thambi",
    "Thalaivaa vaazhga",
    "Velila poi adi",
    "Oru adi podraen",
    "Summa irunga, na paathukuren",
    "Enna kodumai sir idhu",
    "Poyiduven, vanga mudiyadhu",
    "Anbae nee ingae vaa",
    "Eppo dhaan da varuveenga",
    "Sathiyama nee thappu pannirukka",
    "Aathichudi va",
    "Enga vishayatha nee keela thaaka mudiyadhu",
    "Manushan dhaney",
    "Naan solradhu dhaney correct",
    "Kadhal solvadha, kadhal theriyaadha",
    "Nee solla pona",
    "Pesinalum theriyama irukku",
    "Seri, mudichutom",
    "Indha maadhiri yaarkum theriyathu",
    "Unaku enna theriyum",
    "Unga kadamai ippo dhan mudichiduthu",
    "Namma periya aalunga",
    "Edhukku da varinge",
    "Anniyan ah?",
    "Periya vishayam dhan da",
    "Adhuvum kadaisila vandhu correct dhan",
    "Enakku theriyum, nee solradhu dhaan",
    "Unaku therinjaalum nalladhu illa",
    "Thambi, naan poga poren",
    "Enakkum vela irukku pa",
    "Oru kaalathula enaku theriyave theriyathu",
    "Summa sollirukken",
    "Anbu thozhane",
    "Sei da",
    "Sari, nalla plan",
    "Kaiya vechi pesu",
    "Indha adiye ivaru?",
    "Nee thaan da ba",
    "Varuven da, paaru da",
    "Naanga mattum dhan irukkom",
    "Innum enna paakreenga",
    "Poi seyyanum",
    "Romba nallavanu irukka",
    "Sollittu irunthirukka koodadhu",
    "Avan poda da",
    "Enakku onnum thonala da",
    "Thaniya vitudu",
    "Sappa matter da",
    "Vara poren da",
    "Kalaiyum indha vishayathukum indha matter",
    "Mudinja thadava mudikala da",
    "Vaamaa di, yen indha kaalathula",
    "Seri seri, kandippa",
    "Seriyaana kala kattina plan",
    "Inga yarum summa iruka koodadhu",
    "Naane plan pannen",
    "Veri level ku varuven",
    "Sariya pannu machi",
    "Kaattum karuppa iruku",
    "Un peru solren da",
    "Aadu thooku",
    "Sathiyama, ipdi nadakumnu nenachave illa",
    "Enna thaan solla varen",
    "Adhukku nadanthu poga poraen",
    "Idhu over aa theriyudhu da",
    "Sirippu dhaan da",
    "Adhukku thaan inge vara",
    "Ada paviya da",
    "Namakku edhukku indha vishayathukellam",
    "Yaarukku theriyum",
    "Poi sollanum",
    "Vera enna da, mass panren",
    "Munnadiye pona naalu",
    "Namba pannradha seyyanum",
    "Seri, correct dhan",
    "Appdiye odi pona",
    "Thadavi pannu",
    "Inga vaa da, venuma?",
    "Adichu pottu ponga da",
    "Seetu podanum",
    "Naanga mattum dhan da",
    "Poda nee vaa da",
    "Engalukku kashtam dhan",
    "Seri, appo seydha matter",
    "Adhaan thaan matter",
    "Seri, enakku theriyum",
    "Athu pathu dhane",
    "Pochu da kanna",
    "Varen da, paarunga",
    "Indha matter epdi?",
    "Seriyaana kaalathu matter",
    "Pera pesaradhu vidunga da",
    "Seeru da",
    "Tharama, idhuvum dhane",
    "Enga veetla sollarathu",
    "Sema mass da",
    "Enna solra pora",
    "Mudiyadhu da",
    "Poi setha mathiri",
    "Namakku thaan enna, seri correct dhaan",
    "Adhuvum poi seyyum",
    "Yaaru solli kodutha?",
    "Namma kaariyam dhan",
    "Poda punda",
    "Seri, avan mattum dhan correct",
    "Yarukkum theriyaadhu da",
    "Aiyayo, paavam da",
    "Enna solradhu theriyalaye",
    "Sema plan",
    "Ada poda",
    "Irukeenga da",
    "Paathu thaan pona",
    "Enga veedu, naan thaan",
    "Vandhutu iruken",
    "Yaaru setha da",
    "Namma vishayam dhan",
    "Ooru ooru",
    "Mudiyadhu da kanna",
    "Pochu da",
    "Kadavul kitta vechu, ivaru dhan matter",
    "Poyi mudichitten da",
    "Naanga mattum thaan matter",
    "Innum sollala",
    "Enakku enna sollradhu theriyave theriyala",
    "Ada poda da",
    "Pochu da, namakku appo dhan theriyum",
    "Oru kaalathula sonnen da",
    "Thalaivare sollidu",
    "Avan enakku theriyum",
    "Mudichitten da",
    "Enna solradhu, kandippa mudichitten",
    "Seri seri thala",
    "Evanda pa ithu",
    "Ada paviya, thirumbi vanthiruken",
    "Sollavum theriyala",
    "Seri thambi, vara poren",
    "Kitta vendiyadhu dhan varuthu",
    "Aduthavanga dhan eduthukkanum",
    "Seriyaana plan thambi",
    "Indha matter ippo dhan sollanum",
    "Seriya thambi, correct thaan da",
    "Seri, naan poiduven",
    "Massu da, super scene",
    "Seri, thala vaazhga",
    "Avana sethu podunga",
    "Mudichivittanga da",
    "Namma matter than podunga",
    "Ada poda, vandhuten",
    "Idhuku namma thevaiya",
    "Kadavul irundhaalum ivar kooda koodadhu",
  ];
  
  const emojiMemeMeanings: { [key: string]: string } = {
    '😔': 'Na poren ney (I’m leaving, dude)', 
    '🔥': 'Neruppu da (Fire! Intensity or passion)',
    '⚰': 'Dei Abilash, sethutan da (Abilash, he’s dead, man)', 
    '😭': 'Nov enna vitru na (The pain, leave me alone, dude)', 
    '😰': 'Enna ney soldra (What are you saying, dude? Anxious)', 
    '😎': 'En vazhi Thani vazhi (My way is a unique way)', 
    '💀': 'Avlothan, nammala mudichu vitinga pong (That’s it, we’re done for)',
    '😁': 'Mudiyala da, semma santhosham (I can’t handle it, so happy!)',
    '🥳': 'Jolly da, party aagiduchu! (It’s party time!)', 
    '😡': 'Kadavule, kadupethuringa da! (God, you guys are making me so angry!)',
    '😅': 'Vera vazhi illa da (There’s no other way, dude)', 
    '🤯': 'Boom, mind blowing da! (Boom, that blew my mind!)', 
    '🤓': 'Padippu dhan, vera level (Study life is on another level)', 
    '💩': 'Sema waste da, full kachada (What a waste, complete trash)',
    '😏': 'Sollama poda (Whatever, don’t even bother telling me)', 
    '🤬': 'Dei thittathe da! (Hey, don’t curse at me!)',
    '👻': 'Ayyo, pei da ithu! (Oh no, it’s a ghost!)', 
    '🤢': 'Thuuu, ivlo kevalama! (Yuck, how disgusting!)', 
    '😴': 'Suthama thoongiduvom da (We’ll completely sleep off)', 
    '🙄': 'Suthama puriyala pa (Totally not understanding, man)', 
    '😇': 'Naa nallavan da (I’m a good guy)', 
    '🤗': 'Va da, hug pannu! (Come on, give me a hug!)', 
    '🤝': 'Deal fix da! (Deal’s done!)',
    '👏': 'Semma adi da, porumai thaan (Clap, you’ve got patience!)', 
    '🧐': 'Ithu enna da, ippo dhan purinjudhu (What’s this, just now understood)',
    '💪': 'Strong da, semma build up (Strong, great build-up!)', 
    '🎉': 'Paartiya vida porom! (Let’s throw a party!)', 
    '🤫': 'Shhh, evan evan paathu pesanum (Shhh, watch what you say)',
    '🥺': 'Ithu vera level da, romba cute (This is next level, so cute!)', 
    '💔': 'Heart break da, love set aagala (Heartbreak, love didn’t work out)',
    '🤡': 'Ithu ellam comedy piece da (This is all a joke)', 
    '🎓': 'Ithu namba vazhka da, padika vendiyathu thaan (This is our life, we must study)',
    '🚶‍♂️': 'Po da, suthama time waste (Just leave, complete waste of time)', 
    '🏃‍♂️': 'Odidu da, ivan varan (Run, he’s coming!)', 
    '🛏️': 'Thoongu da, naanum thoonguren (Sleep, I’m going to sleep too)',
    '📱': 'Text pannuren, irunda reply pannu (I’ll text you, reply if you’re there)', 
    '🍕': 'Sapdu sapdu, pizza saaptutu irruka (Eat, sitting and eating pizza)', 
    '👀': 'Kannu da, paathu iruken (Eyes wide open, watching everything)', 
    '😲': 'Ayyo shock da! (Oh no, I’m shocked!)', 
    '😩': 'Mudiyala da, ivlo kashtama? (I can’t do this, is it this hard?)', 
    '🎬': 'Cinema va dhan laam nadakudhu (It’s like a movie is playing out)', 
    '🎤': 'Oru song podunga, nalla irukkum (Play a song, it’ll be nice)',
    '🚗': 'Car la poga da, speed ah iruku (Let’s go in the car, it’s fast!)', 
    '🏠': 'Veetla irundhu padicha nalladhu (It’s better to study from home)', 
    '✈️': 'Flight ah edukka poren (I’m catching a flight)', 
    '💡': 'Light bulb moment da! (Got an idea!)',
    '⏰': 'Time over da! (Time’s up!)', 
    '🔔': 'Bell adikuthu, time to move! (Bell’s ringing, time to go)', 
    '📅': 'Calendar full ah booking, busy life (Calendar’s fully booked, busy life)', 
    '🎁': 'Surprise da, ithu onakku (Surprise, this is for you)', 
    '🤟': 'Love you da, ithu unakkaga (Love you, this is for you)',
    '💸': 'Cash illa da, yenna panradhu (No cash, what to do?)', 
    '💣': 'Boom, ivlo heavy ah? (Boom, is it this intense?)'
  };
  
  
  const emojiMemeInterpretation = data.emojis
    .split(' ')
    .map((emoji) => emojiMemeMeanings[emoji] || 'an unknown expression')
    .join(', ');
    
  
  const emojiInterpretation = data.emojis
    .split('')
    .map((emoji) => emojiMeaning[emoji] || 'an unknown expression')
    .join(', ');

    const prompt = `Create a ${genreText} story aimed at a young Tamil Nadu audience, specifically college-going students and IT professionals working in MNCs. The story should be relatable to their daily lives, incorporating popular Tamil movie references, memes, and social media trends that resonate with this group.

  The story should capture the contemporary vibe, referencing local culture, recent events, and common topics discussed among Chennai youth on platforms like Instagram, Twitter, and WhatsApp. Use broad and current social trends rather than focusing on specific events, so the story feels fresh and modern. Avoid overused references and instead highlight typical experiences of Chennai’s youth, such as their love for Kollywood movies, viral memes, local slang, and day-to-day humor.

  Consider the meaning and flow of the emojis: ${emojiInterpretation} as well as their corresponding meme interpretations like ${emojiMemeInterpretation}. Each emoji represents an emotion or action, and the story should creatively integrate these in a way that feels natural, adding to the humor and relatability of the narrative. The corresponding memes should be naturally woven into the plot, with each meme serving as a humorous or emotional punchline that ties the situation or character’s feelings together. For instance:
  
  - "😔 Na poren ney" can be used when a character is leaving or feeling sad.
  - "🔥 Neruppu da" can indicate moments of intensity or passion.
  - "💀 Avlothan, nammala mudichu vitinga pong" could fit a moment of hopelessness or despair.
  - "😭 Nov enna vitru na" would suit moments of extreme sadness or frustration.

  Use the following characters and their descriptions, including their appearance and behavior, in the story: ${characterText}. These characters should reflect typical Chennai college students or young professionals—relatable in their everyday struggles, friendships, ambitions, and lighthearted moments. 

  The story should be ${data.storyLength} words long, written in a jolly, lighthearted manner that brings a smile to the reader’s face. The humor should reflect the quick-witted, meme-driven culture prevalent among Tamil Nadu’s youth, incorporating playful, culturally relevant references to Tamil memes and local trends. Ensure the story remains engaging, entertaining, and true to the spirit of Tamil Nadu’s vibrant youth culture.

  The emojis ${data.emojis} and their meme-based interpretations (${emojiMemeInterpretation}) should be key elements of the story, enhancing the narrative without feeling forced or unnecessary. These should flow naturally with the story, adding humor, emotion, and personality to the characters and their experiences.

  Here’s how to incorporate the memes that is from the meme references: ${memeReferences.join(', ')}.
  - When a character finds themselves in a tough spot or hopeless situation, use memes like "Dei avan sethutan da" or "Namala mudichivitanga" to inject light-hearted humor.
  - If a character has to leave or promises to return, use "Irrunga bhai, naan varuven" to add a playful tone while indicating their departure or return.
  - Use relatable memes for moments of excitement or surprise, such as "Massu da" or "Seriyaana plan" when something exciting or funny happens.
  - Insert memes that relate to everyday challenges like college life, exams, job pressures, or even silly interactions between friends. For example, use "Appove sonnen" for ‘I told you so’ moments, or "Mudiyala pa" to express frustration or helplessness.
  - In situations involving friendly banter, use memes like "Enna ma neenga ipdi panreengale ma" to convey disbelief or "Vaa machi plan pannu" for moments of plotting or planning between friends.
  - During moments of luck or serendipity, the meme "Kadavul paakum pola" can add a playful divine intervention touch.

  The memes should be placed in a way that makes the story feel modern and reflective of the culture Tamil Nadu’s youth connect with. The story should not only focus on humorous or dramatic aspects but also celebrate the unique meme culture that resonates deeply with the region.

  The memes can add layers of sarcasm, emotional depth, and humor throughout the story. For instance, serious moments can be made lighter with the injection of a funny meme, or sarcastic dialogue can be heightened with meme references, all while maintaining the flow of the story.

  The story should include these characters, along with their traits and behavior as described by the user: ${characterText}. Ensure the dialogue and actions of the characters feel natural and relatable by using popular Tamil memes that fit their personalities and situations.

  Keep the tone jolly and light-hearted, ensuring the story leaves a smile on the face of the reader. The final story should be ${data.storyLength} words long and should incorporate local humor and memes in a way that is relevant and enjoyable for the Tamil audience, making sure that the emojis and memes are naturally embedded into the narrative flow.`;


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