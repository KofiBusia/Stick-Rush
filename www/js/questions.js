// ═══════════════════════════════════════════════════════
//  STICK RUSH — QUESTION BANK
//  Tier 1: Ages 8-10 | Tier 2: Ages 11-13 | Tier 3: Ages 14-16
// ═══════════════════════════════════════════════════════

const QUESTION_BANK = {

  tier1: {
    math: [
      { q: "What is 7 × 8?", options: ["54","56","58","52"], answer: 1, points: 50 },
      { q: "What is 45 ÷ 9?", options: ["4","5","6","7"], answer: 1, points: 50 },
      { q: "If you have 3 bags with 12 oranges each, how many oranges total?", options: ["36","32","30","38"], answer: 0, points: 60 },
      { q: "What is 100 − 37?", options: ["53","63","73","43"], answer: 1, points: 50 },
      { q: "Which number is closest to 50? 44, 47, 53, 58", options: ["44","47","53","58"], answer: 2, points: 60 },
      { q: "What is 9 + 6 + 8?", options: ["21","23","22","24"], answer: 1, points: 50 },
      { q: "A market woman sells 6 tomatoes for GHS 3. What is 1 tomato?", options: ["GHS 0.50","GHS 1","GHS 2","GHS 3"], answer: 0, points: 70 },
      { q: "What is ½ of 80?", options: ["20","30","40","50"], answer: 2, points: 50 },
      { q: "What is 15 × 4?", options: ["50","55","60","65"], answer: 2, points: 50 },
      { q: "How many sides does a hexagon have?", options: ["5","6","7","8"], answer: 1, points: 50 },
      { q: "What is 36 + 48?", options: ["74","82","84","86"], answer: 2, points: 50 },
      { q: "Round 67 to the nearest ten.", options: ["60","65","70","80"], answer: 2, points: 50 },
    ],
    english: [
      { q: "Which word is a NOUN? 'The dog runs fast.'", options: ["runs","fast","dog","The"], answer: 2, points: 50 },
      { q: "Choose the correct spelling:", options: ["beutiful","beautiful","beautifull","butiful"], answer: 1, points: 60 },
      { q: "What is the plural of 'child'?", options: ["childs","childes","children","childrens"], answer: 2, points: 50 },
      { q: "Fill in: 'She ___ her homework yesterday.'", options: ["do","does","did","doing"], answer: 2, points: 50 },
      { q: "Which sentence is correct?", options: ["He go to school","He goes to school","He going to school","He goed to school"], answer: 1, points: 60 },
      { q: "What is the opposite of 'hot'?", options: ["warm","cool","cold","icy"], answer: 2, points: 50 },
      { q: "Choose the VERB: 'Kofi quickly ran to the market.'", options: ["Kofi","quickly","ran","market"], answer: 2, points: 50 },
      { q: "Which punctuation ends a question?", options: ["!",".",",","?"], answer: 3, points: 50 },
      { q: "What does 'enormous' mean?", options: ["tiny","average","very large","colourful"], answer: 2, points: 60 },
      { q: "Correct the sentence: 'they went to the beach'", options: ["They went to the beach.","they Went to the beach.","They went To the beach.","they went to the Beach."], answer: 0, points: 60 },
    ]
  },

  tier2: {
    math: [
      { q: "What is 15% of 200?", options: ["20","25","30","35"], answer: 2, points: 80 },
      { q: "Solve: 3x + 7 = 22. What is x?", options: ["3","4","5","6"], answer: 2, points: 100 },
      { q: "A rectangle is 12cm × 8cm. What is the area?", options: ["40cm²","80cm²","96cm²","108cm²"], answer: 2, points: 80 },
      { q: "What is the LCM of 4 and 6?", options: ["8","10","12","24"], answer: 2, points: 80 },
      { q: "If 20% of a class of 40 are absent, how many are present?", options: ["28","30","32","34"], answer: 2, points: 100 },
      { q: "What is √144?", options: ["11","12","13","14"], answer: 1, points: 80 },
      { q: "Simplify: 18/24", options: ["1/2","2/3","3/4","4/5"], answer: 2, points: 80 },
      { q: "What is 2³ × 3?", options: ["12","18","24","48"], answer: 2, points: 80 },
      { q: "A shirt costs GHS 80. It's discounted 25%. New price?", options: ["GHS 55","GHS 60","GHS 65","GHS 70"], answer: 1, points: 100 },
      { q: "What is the perimeter of a square with side 9cm?", options: ["18cm","27cm","36cm","45cm"], answer: 2, points: 80 },
    ],
    english: [
      { q: "Identify the ADJECTIVE: 'The clever boy solved the puzzle.'", options: ["clever","boy","solved","puzzle"], answer: 0, points: 80 },
      { q: "Which is correct? Past perfect tense:", options: ["She has eaten","She had eaten","She eating","She ate"], answer: 1, points: 100 },
      { q: "What is a synonym for 'brave'?", options: ["afraid","courageous","weak","timid"], answer: 1, points: 80 },
      { q: "Identify the type: 'Although it rained, they played outside.'", options: ["Simple sentence","Compound","Complex","Fragment"], answer: 2, points: 100 },
      { q: "Choose the correct form: 'Neither the boys nor the girl ___ ready.'", options: ["are","were","was","is"], answer: 2, points: 100 },
      { q: "What literary device is: 'The stars danced in the sky'?", options: ["Simile","Metaphor","Personification","Alliteration"], answer: 2, points: 100 },
      { q: "Correct spelling:", options: ["recieve","receive","recive","reciev"], answer: 1, points: 80 },
      { q: "What is the passive voice of: 'Kofi writes the letter'?", options: ["The letter writes Kofi","The letter is written by Kofi","Kofi is written the letter","The letter was writing"], answer: 1, points: 100 },
      { q: "What does 'ambiguous' mean?", options: ["very clear","having two meanings","extremely fast","very old"], answer: 1, points: 80 },
      { q: "Identify the ADVERB: 'She spoke softly to the child.'", options: ["She","spoke","softly","child"], answer: 2, points: 80 },
    ]
  },

  tier3: {
    math: [
      { q: "Factorise: x² + 5x + 6", options: ["(x+1)(x+6)","(x+2)(x+3)","(x+3)(x+2)","(x-2)(x-3)"], answer: 1, points: 150 },
      { q: "A car travels 180km in 2.5 hours. What is the average speed?", options: ["60km/h","65km/h","70km/h","72km/h"], answer: 3, points: 120 },
      { q: "What is sin(30°)?", options: ["0","0.5","√2/2","1"], answer: 1, points: 150 },
      { q: "Solve: 2x² − 8 = 0. x = ?", options: ["±1","±2","±3","±4"], answer: 1, points: 150 },
      { q: "What is the gradient of y = 3x − 7?", options: ["-7","3","7","-3"], answer: 1, points: 120 },
      { q: "A sum of GHS 5,000 earns 8% simple interest per year. Interest after 3 years?", options: ["GHS 800","GHS 1,000","GHS 1,200","GHS 1,500"], answer: 2, points: 150 },
      { q: "What is log₁₀(1000)?", options: ["2","3","4","5"], answer: 1, points: 150 },
      { q: "If P(A) = 0.3 and P(B) = 0.5 and they're independent, P(A and B) = ?", options: ["0.15","0.8","0.2","0.35"], answer: 0, points: 150 },
      { q: "Differentiate y = 4x³ + 2x", options: ["12x² + 2","12x + 2","4x² + 2","12x³"], answer: 0, points: 150 },
      { q: "A circle has circumference 44cm. What is its radius? (π=22/7)", options: ["5cm","6cm","7cm","8cm"], answer: 2, points: 150 },
    ],
    english: [
      { q: "What is the subjunctive mood? 'I suggest that he ___ early.'", options: ["comes","came","come","will come"], answer: 2, points: 150 },
      { q: "Identify the rhetorical device: 'To be or not to be, that is the question.'", options: ["Anaphora","Antithesis","Chiasmus","Epistrophe"], answer: 1, points: 150 },
      { q: "What is the meaning of the prefix 'circum-'?", options: ["against","around","between","above"], answer: 1, points: 120 },
      { q: "Choose the correct sentence (subjective case):", options: ["Between you and I","Between you and me","Between I and you","Betwen me and you"], answer: 1, points: 150 },
      { q: "What literary device is used in 'Peter Piper picked a peck'?", options: ["Assonance","Onomatopoeia","Alliteration","Consonance"], answer: 2, points: 120 },
      { q: "Which type of narrator knows all characters' thoughts?", options: ["First person","Third person limited","Third person omniscient","Second person"], answer: 2, points: 150 },
      { q: "What is a 'non sequitur'?", options: ["A Latin phrase meaning 'it follows'","A conclusion that does not follow from premises","A type of metaphor","A formal argument"], answer: 1, points: 150 },
      { q: "Identify the mood: 'If I were you, I would study harder.'", options: ["Indicative","Imperative","Subjunctive","Interrogative"], answer: 2, points: 150 },
      { q: "What does 'perspicacious' mean?", options: ["slow to understand","having a ready insight","extremely brave","very talkative"], answer: 1, points: 150 },
      { q: "Which is an example of dramatic irony?", options: ["A character says one thing but means another","The audience knows something characters don't","Two characters have opposite traits","A series of misunderstandings"], answer: 1, points: 150 },
    ]
  }
};

// Randomly sample n questions from a pool
function getQuestions(tier, count = 3) {
  const t = QUESTION_BANK[tier] || QUESTION_BANK.tier1;
  const mathPool    = [...t.math].sort(() => Math.random() - 0.5);
  const englishPool = [...t.english].sort(() => Math.random() - 0.5);
  const questions = [];
  const mathCount = Math.ceil(count / 2);
  const engCount  = count - mathCount;
  for (let i = 0; i < mathCount; i++)   questions.push({ ...mathPool[i],    subject: 'Math' });
  for (let i = 0; i < engCount; i++)    questions.push({ ...englishPool[i], subject: 'English' });
  return questions.sort(() => Math.random() - 0.5);
}

// Get tier from age
function getTierFromAge(age) {
  if (age <= 10) return 'tier1';
  if (age <= 13) return 'tier2';
  return 'tier3';
}
