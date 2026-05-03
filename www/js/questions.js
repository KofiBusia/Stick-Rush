// ═══════════════════════════════════════════════════════
//  STICK RUSH — QUESTION BANK (v2 — 120 questions, no repeats)
// ═══════════════════════════════════════════════════════

const QUESTION_BANK = {
  tier1: [ // Ages 8-10
    // MATH
    {subject:'Math',q:'What is 7 × 8?',options:['54','56','58','64'],answer:1,points:50},
    {subject:'Math',q:'What is 144 ÷ 12?',options:['11','12','13','14'],answer:1,points:50},
    {subject:'Math',q:'A bag of rice costs GHS 12. How much do 5 bags cost?',options:['GHS 55','GHS 60','GHS 65','GHS 70'],answer:1,points:60},
    {subject:'Math',q:'What is 25% of 80?',options:['15','20','25','30'],answer:1,points:60},
    {subject:'Math',q:'What is the next number? 2, 4, 8, 16, ___',options:['24','30','32','36'],answer:2,points:50},
    {subject:'Math',q:'If you have GHS 50 and spend GHS 17, how much is left?',options:['GHS 27','GHS 33','GHS 37','GHS 43'],answer:1,points:50},
    {subject:'Math',q:'What is 9 × 9?',options:['72','81','90','99'],answer:1,points:50},
    {subject:'Math',q:'What is half of 96?',options:['42','46','48','52'],answer:2,points:50},
    {subject:'Math',q:'A market woman has 3 dozen eggs. How many eggs is that?',options:['24','30','36','42'],answer:2,points:60},
    {subject:'Math',q:'Round 347 to the nearest hundred.',options:['300','340','350','400'],answer:0,points:50},
    {subject:'Math',q:'What is 15 + 28 + 37?',options:['70','75','80','85'],answer:2,points:50},
    {subject:'Math',q:'Which fraction is biggest? 1/2, 1/3, 1/4, 1/5',options:['1/5','1/4','1/3','1/2'],answer:3,points:60},
    {subject:'Math',q:'What is 6 squared?',options:['12','18','36','42'],answer:2,points:60},
    {subject:'Math',q:'A rectangle is 8cm long and 5cm wide. What is its area?',options:['13cm²','26cm²','40cm²','45cm²'],answer:2,points:70},
    {subject:'Math',q:'What is 1000 − 357?',options:['543','553','643','653'],answer:2,points:60},
    {subject:'Math',q:'What is 3/4 of 40?',options:['20','25','30','35'],answer:2,points:60},
    {subject:'Math',q:'How many minutes in 2 and a half hours?',options:['120','130','150','180'],answer:2,points:60},
    {subject:'Math',q:'A shop sells 8 items at GHS 6 each. Total?',options:['GHS 42','GHS 48','GHS 54','GHS 56'],answer:1,points:60},
    // ENGLISH
    {subject:'English',q:'Which word is a noun? "The dog runs fast."',options:['The','dog','runs','fast'],answer:1,points:50},
    {subject:'English',q:'What is the plural of "child"?',options:['childs','childen','children','childrens'],answer:2,points:50},
    {subject:'English',q:'Choose the correct sentence:',options:['She go to school','She goes to school','She going to school','She gone to school'],answer:1,points:50},
    {subject:'English',q:'What does "enormous" mean?',options:['Tiny','Average','Very large','Very fast'],answer:2,points:60},
    {subject:'English',q:'Which is the opposite of "ancient"?',options:['Old','Broken','Modern','Slow'],answer:2,points:60},
    {subject:'English',q:'Fill in: "He ___ football every day."',options:['play','plays','playing','played'],answer:1,points:50},
    {subject:'English',q:'What punctuation ends a question?',options:['.','!','?',','],answer:2,points:50},
    {subject:'English',q:'Which word is an adjective? "The tall boy ran quickly."',options:['The','tall','boy','ran'],answer:1,points:50},
    {subject:'English',q:'What is the synonym of "happy"?',options:['Sad','Angry','Joyful','Tired'],answer:2,points:60},
    {subject:'English',q:'"She has ___ apple." Which word fits?',options:['a','an','the','some'],answer:1,points:50},
    {subject:'English',q:'What is the past tense of "run"?',options:['runned','ranned','ran','runs'],answer:2,points:60},
    {subject:'English',q:'What does "predict" mean?',options:['To look back','To guess what will happen','To remember','To forget'],answer:1,points:70},
    {subject:'English',q:'How many syllables in "beautiful"?',options:['2','3','4','5'],answer:1,points:60},
    {subject:'English',q:'What is the plural of "ox"?',options:['oxes','oxen','ox','oxs'],answer:1,points:70},
    {subject:'English',q:'What does "curious" mean?',options:['Bored','Eager to know','Afraid','Angry'],answer:1,points:50},
    {subject:'English',q:'Fill in: "There ___ many students in the class."',options:['is','am','are','was'],answer:2,points:50},
  ],

  tier2: [ // Ages 11-13
    // MATH
    {subject:'Math',q:'A trader buys 40 oranges for GHS 12. Sells each for GHS 0.50. Profit or loss?',options:['Profit GHS 8','Loss GHS 4','No profit/loss','Profit GHS 20'],answer:0,points:80},
    {subject:'Math',q:'What is 15% of 200?',options:['20','25','30','35'],answer:2,points:80},
    {subject:'Math',q:'Solve: 3x + 7 = 22. What is x?',options:['3','4','5','6'],answer:2,points:90},
    {subject:'Math',q:'Area of a triangle: base 10cm, height 6cm?',options:['16cm²','30cm²','60cm²','32cm²'],answer:1,points:90},
    {subject:'Math',q:'If 3 pens cost GHS 4.50, what does 1 pen cost?',options:['GHS 1.00','GHS 1.50','GHS 2.00','GHS 1.25'],answer:1,points:80},
    {subject:'Math',q:'What is √169?',options:['11','12','13','14'],answer:2,points:90},
    {subject:'Math',q:'A car travels 90km in 1.5 hours. What is its speed?',options:['45km/h','60km/h','90km/h','135km/h'],answer:1,points:90},
    {subject:'Math',q:'What is 2/3 + 1/4?',options:['3/7','5/6','7/12','11/12'],answer:3,points:100},
    {subject:'Math',q:'Ratio of boys:girls = 3:5. If 24 boys, how many girls?',options:['30','35','40','45'],answer:2,points:90},
    {subject:'Math',q:'What is the LCM of 4, 6 and 8?',options:['12','16','24','48'],answer:2,points:90},
    {subject:'Math',q:'A shirt costs GHS 80 with 20% discount. Sale price?',options:['GHS 60','GHS 64','GHS 68','GHS 72'],answer:1,points:100},
    {subject:'Math',q:'What is 0.75 as a fraction in simplest form?',options:['75/100','3/4','7/10','15/20'],answer:1,points:80},
    {subject:'Math',q:'Perimeter of a square is 36cm. What is its area?',options:['36cm²','72cm²','81cm²','144cm²'],answer:2,points:100},
    {subject:'Math',q:'What is 5! (5 factorial)?',options:['25','60','120','720'],answer:2,points:100},
    {subject:'Math',q:'Express 0.4 as a percentage.',options:['4%','0.4%','40%','400%'],answer:2,points:80},
    {subject:'Math',q:'Solve: 2(x − 3) = 10. What is x?',options:['4','5','7','8'],answer:3,points:90},
    {subject:'Math',q:'What is the HCF of 24 and 36?',options:['6','8','12','18'],answer:2,points:90},
    {subject:'Math',q:'A principal of GHS 1000 at 10% per annum. Simple interest after 2 years?',options:['GHS 100','GHS 150','GHS 200','GHS 250'],answer:2,points:100},
    // ENGLISH
    {subject:'English',q:'What literary device is: "The wind whispered through the trees"?',options:['Simile','Metaphor','Personification','Alliteration'],answer:2,points:80},
    {subject:'English',q:'Identify the clause type: "Although it was raining, we played."',options:['Simple','Compound','Complex','Compound-complex'],answer:2,points:90},
    {subject:'English',q:'Meaning of prefix "mis-" in "mislead"?',options:['Again','Before','Wrongly','Not'],answer:2,points:80},
    {subject:'English',q:'Correct: "Neither the boys ___ the girl was ready."',options:['or','nor','and','but'],answer:1,points:90},
    {subject:'English',q:'Tense of: "By tomorrow I will have finished"?',options:['Simple future','Future continuous','Future perfect','Present perfect'],answer:2,points:100},
    {subject:'English',q:'Antonym of "transparent"?',options:['Clear','Obvious','Opaque','Bright'],answer:2,points:80},
    {subject:'English',q:'What does "amiable" mean?',options:['Angry','Friendly','Brave','Clever'],answer:1,points:90},
    {subject:'English',q:'Figure of speech: "He is as brave as a lion."',options:['Metaphor','Simile','Hyperbole','Irony'],answer:1,points:80},
    {subject:'English',q:'Passive voice of "The dog bit the man":',options:['The man bit the dog','The man was bitten by the dog','The man is bitten','The dog was biting the man'],answer:1,points:90},
    {subject:'English',q:'Which word is correctly spelled?',options:['Accomodate','Accommodate','Acomodate','Acommodate'],answer:1,points:80},
    {subject:'English',q:'Noun form of "decide"?',options:['Decided','Decision','Decisive','Deciding'],answer:1,points:80},
    {subject:'English',q:'Correct: "The news ___ shocking."',options:['are','were','is','have been'],answer:2,points:90},
    {subject:'English',q:'What does "benevolent" mean?',options:['Evil','Kind and generous','Stubborn','Weak'],answer:1,points:100},
    {subject:'English',q:'Identify: "She sells seashells by the seashore."',options:['Simile','Alliteration','Metaphor','Onomatopoeia'],answer:1,points:80},
    {subject:'English',q:'What is an "idiom"?',options:['A type of poem','A phrase with non-literal meaning','A grammar rule','A punctuation mark'],answer:1,points:80},
    {subject:'English',q:'What does "eloquent" mean?',options:['Ugly','Well-spoken','Timid','Greedy'],answer:1,points:90},
  ],

  tier3: [ // Ages 14-16
    // MATH
    {subject:'Math',q:'Solve: x² − 5x + 6 = 0',options:['x=2,x=3','x=−2,x=−3','x=1,x=6','x=2,x=−3'],answer:0,points:120},
    {subject:'Math',q:'What is sin(30°)?',options:['√3/2','1/2','√2/2','1'],answer:1,points:130},
    {subject:'Math',q:'Differentiate y = 3x² + 2x − 1. What is dy/dx?',options:['6x + 2','3x + 2','6x − 1','3x² + 2'],answer:0,points:150},
    {subject:'Math',q:'Cylinder: radius 7cm, height 10cm. Volume? (π≈22/7)',options:['1540cm³','770cm³','2200cm³','1100cm³'],answer:0,points:140},
    {subject:'Math',q:'If log₂(x) = 5, what is x?',options:['10','25','32','64'],answer:2,points:150},
    {subject:'Math',q:'Expand (2x + 3)²',options:['4x²+9','4x²+6x+9','4x²+12x+9','2x²+12x+9'],answer:2,points:130},
    {subject:'Math',q:'Gradient of the line 3y = 6x + 9?',options:['2','3','6','9'],answer:0,points:120},
    {subject:'Math',q:'Solve: 2x−3y=7 and x+y=6. Find x.',options:['4','5','6','7'],answer:1,points:140},
    {subject:'Math',q:'Sum of interior angles of a hexagon?',options:['540°','640°','720°','900°'],answer:2,points:120},
    {subject:'Math',q:'GHS 5000 at 12% simple interest p.a. for 3 years?',options:['GHS 1200','GHS 1500','GHS 1800','GHS 2000'],answer:2,points:130},
    {subject:'Math',q:'What is ³√216?',options:['4','6','8','12'],answer:1,points:120},
    {subject:'Math',q:'What is cos(60°)?',options:['√3/2','1/2','0','1'],answer:1,points:130},
    {subject:'Math',q:'Simplify: (x² − 4)/(x − 2)',options:['x−2','x+2','x²+2','x'],answer:1,points:140},
    {subject:'Math',q:'Range of: 4, 7, 2, 9, 1, 5, 8, 3?',options:['7','8','9','10'],answer:1,points:120},
    {subject:'Math',q:'Integrate 4x³. What is the result?',options:['4x²','12x²','x⁴','4x⁴/4'],answer:2,points:150},
    {subject:'Math',q:'Probability of rolling a 5 on a fair die?',options:['1/4','1/5','1/6','1/3'],answer:2,points:120},
    {subject:'Math',q:'Nth term of sequence 3, 7, 11, 15...?',options:['4n−1','4n+1','3n+1','2n+1'],answer:0,points:130},
    {subject:'Math',q:'Angle in a semicircle is always?',options:['45°','60°','90°','180°'],answer:2,points:120},
    // ENGLISH
    {subject:'English',q:'What does "vicarious" mean?',options:['Direct','Experienced through another','Selfish','Generous'],answer:1,points:120},
    {subject:'English',q:'Mood of: "If I were rich, I would travel the world."',options:['Indicative','Imperative','Subjunctive','Interrogative'],answer:2,points:130},
    {subject:'English',q:'Literary device: "It was the best of times, it was the worst of times"',options:['Paradox','Metaphor','Simile','Allusion'],answer:0,points:130},
    {subject:'English',q:'Correct parallel structure?',options:['She likes swimming, to run and cycling','She likes to swim, run and cycling','She likes swimming, running and cycling','She likes swim, run and cycle'],answer:2,points:140},
    {subject:'English',q:'What is a "denouement"?',options:['The opening','The rising action','The resolution after climax','The conflict'],answer:2,points:150},
    {subject:'English',q:'What does "sycophant" mean?',options:['A brave leader','A flatterer who seeks favour','A wise teacher','A fierce warrior'],answer:1,points:140},
    {subject:'English',q:'"Ask not what your country can do for you..." — rhetorical device?',options:['Anaphora','Chiasmus','Epistrophe','Alliteration'],answer:1,points:150},
    {subject:'English',q:'What is an "oxymoron"?',options:['An exaggeration','Two contradictory words together','A hidden meaning','A repeated sound'],answer:1,points:130},
    {subject:'English',q:'Example of dramatic irony?',options:['Character says one thing means another','Audience knows what character doesn\'t','Two opposites in one phrase','Comparison using like'],answer:1,points:140},
    {subject:'English',q:'Correct: "Neither she nor they ___ wrong."',options:['was','is','are','were'],answer:2,points:130},
    {subject:'English',q:'What does "ephemeral" mean?',options:['Lasting forever','Short-lived','Very large','Very small'],answer:1,points:120},
    {subject:'English',q:'"The pen is mightier than the sword." — identify:',options:['Simile','Personification','Metaphor','Hyperbole'],answer:2,points:120},
    {subject:'English',q:'What is "anaphora"?',options:['Repetition at end of lines','Repetition at start of lines','A type of rhyme','A narrative technique'],answer:1,points:150},
    {subject:'English',q:'What does "juxtaposition" mean?',options:['A type of rhythm','Placing contrasting things side by side','A form of exaggeration','A metaphor about nature'],answer:1,points:140},
    {subject:'English',q:'What does "laconic" mean?',options:['Talkative','Using very few words','Very emotional','Highly intelligent'],answer:1,points:140},
    {subject:'English',q:'What is "hubris" in literature?',options:['Excessive pride leading to downfall','A type of narrator','A plot twist','A moral lesson'],answer:0,points:150},
  ]
};

// Track used questions per session to prevent repeats
const _usedQuestions = { tier1: new Set(), tier2: new Set(), tier3: new Set() };

function getQuestions(tier, count) {
  const bank = QUESTION_BANK[tier] || QUESTION_BANK.tier1;
  const used = _usedQuestions[tier] || new Set();

  // If we've used most questions, reset
  let available = bank.filter((_, i) => !used.has(i));
  if (available.length < count) {
    _usedQuestions[tier] = new Set();
    available = [...bank];
  }

  // Shuffle
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  // Pick balanced Math/English mix
  const mathQ    = shuffled.filter(q => q.subject === 'Math');
  const engQ     = shuffled.filter(q => q.subject === 'English');
  const picked   = [];
  const mathCount = Math.ceil(count / 2);

  for (let i = 0; i < mathCount    && mathQ.length > 0; i++) picked.push(mathQ.shift());
  for (let i = 0; i < count - mathCount && engQ.length  > 0; i++) picked.push(engQ.shift());
  while (picked.length < count && shuffled.length > 0) {
    const q = shuffled.shift();
    if (!picked.includes(q)) picked.push(q);
  }

  // Mark as used
  picked.forEach(q => { const idx = bank.indexOf(q); if (idx !== -1) used.add(idx); });
  _usedQuestions[tier] = used;

  return picked.sort(() => Math.random() - 0.5);
}

function getTierFromAge(age) {
  const a = parseInt(age);
  if (a <= 10) return 'tier1';
  if (a <= 13) return 'tier2';
  return 'tier3';
}

function resetUsedQuestions() {
  _usedQuestions.tier1 = new Set();
  _usedQuestions.tier2 = new Set();
  _usedQuestions.tier3 = new Set();
}
