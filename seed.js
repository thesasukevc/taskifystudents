require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('./models/Subject');

const seedData = [
  {
    name: 'IT / Cyber Security',
    accentColor: '#00f2ff',
    youtubePlaylistUrl: 'https://www.youtube.com/embed/playlist?list=PLu_v2VatR7X_R8T0G68PIn_T1I_Pz4B2W',
    quizzes: [
      { question: 'What does VPN stand for?', options: ['Virtual Private Network', 'Variable Public Node', 'Visual Private Network', 'Virtual Protocol Net'], correctAnswerIndex: 0 },
      { question: 'Which port is commonly used for HTTP?', options: ['443', '21', '80', '22'], correctAnswerIndex: 2 },
      { question: 'What is the main goal of Encryption?', options: ['Data compression', 'Data confidentiality', 'Increasing speed', 'Data deletion'], correctAnswerIndex: 1 }
    ]
  },
  {
    name: 'Mathematics',
    accentColor: '#fbbf24',
    youtubePlaylistUrl: 'https://www.youtube.com/embed/playlist?list=PLu_v2VatR7X_S7L_N4Pz8C_N_7I_Pz4B2W',
    quizzes: [
      { question: 'What is the value of Pi rounded to two decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswerIndex: 1 },
      { question: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctAnswerIndex: 2 },
      { question: 'A triangle with all sides equal is called?', options: ['Isosceles', 'Scalene', 'Equilateral', 'Right-angled'], correctAnswerIndex: 2 }
    ]
  },
  {
    name: 'Physics',
    accentColor: '#3b82f6',
    youtubePlaylistUrl: 'https://www.youtube.com/embed/playlist?list=PLu_v2VatR7X_P7L_N4Pz8C_N_7I_Pz4B2W',
    quizzes: [
      { question: 'What is the unit of force?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correctAnswerIndex: 2 },
      { question: 'What is the speed of light in vacuum?', options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '500,000 km/s'], correctAnswerIndex: 0 },
      { question: 'Who formulated the laws of motion?', options: ['Einstein', 'Tesla', 'Newton', 'Galileo'], correctAnswerIndex: 2 }
    ]
  },
  {
    name: 'Chemistry',
    accentColor: '#ec4899',
    youtubePlaylistUrl: 'https://www.youtube.com/embed/playlist?list=PLu_v2VatR7X_C7L_N4Pz8C_N_7I_Pz4B2W',
    quizzes: [
      { question: 'What is the chemical symbol for Gold?', options: ['Ag', 'Fe', 'Au', 'Pb'], correctAnswerIndex: 2 },
      { question: 'What is the pH of pure water?', options: ['5', '7', '9', '12'], correctAnswerIndex: 1 },
      { question: 'Which gas is essential for human breathing?', options: ['Nitrogen', 'Carbon Dioxide', 'Oxygen', 'Argon'], correctAnswerIndex: 2 }
    ]
  },
  {
    name: 'Biology',
    accentColor: '#84cc16',
    youtubePlaylistUrl: 'https://www.youtube.com/embed/playlist?list=PLu_v2VatR7X_B7L_N4Pz8C_N_7I_Pz4B2W',
    quizzes: [
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'], correctAnswerIndex: 2 },
      { question: 'Which pigment gives plants their green color?', options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'], correctAnswerIndex: 1 },
      { question: 'How many chambers does a human heart have?', options: ['2', '3', '4', '6'], correctAnswerIndex: 2 }
    ]
  },
  {
    name: 'English',
    accentColor: '#10b981',
    youtubePlaylistUrl: 'https://www.youtube.com/embed/playlist?list=PLu_v2VatR7X_E7L_N4Pz8C_N_7I_Pz4B2W',
    quizzes: [
      { question: 'Which of these is a noun?', options: ['Quickly', 'Beautiful', 'Elephant', 'Run'], correctAnswerIndex: 2 },
      { question: 'What is the opposite of "Ancient"?', options: ['Old', 'Modern', 'Historic', 'Fragile'], correctAnswerIndex: 1 },
      { question: 'Identify the verb: "The student studies hard"', options: ['Student', 'Hard', 'Studies', 'The'], correctAnswerIndex: 2 }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Subject.deleteMany({});
    console.log('Cleared existing subjects...');

    await Subject.insertMany(seedData);
    console.log('✅ Successfully seeded 6 subjects with quizzes!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
