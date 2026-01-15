import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Crop Production",
    difficulty: "easy",
    question: "Which crop is known as the 'King of Cereals'?",
    questionHindi: "किस फसल को 'अनाजों का राजा' कहा जाता है?",
    options: ["Rice", "Wheat", "Maize", "Barley"],
    correctAnswerIndex: 1, // Wheat
    explanation: "Wheat is globally referred to as the King of Cereals due to its vast cultivation area and importance as a staple food."
  },
  {
    id: 2,
    category: "Soil Science",
    difficulty: "easy",
    question: "What is the ideal pH range for most agricultural crops?",
    questionHindi: "अधिकांश कृषि फसलों के लिए आदर्श pH सीमा क्या है?",
    options: ["3.0 - 4.5", "6.0 - 7.5", "8.5 - 10.0", "1.0 - 3.0"],
    correctAnswerIndex: 1,
    explanation: "A neutral pH range of 6.0 to 7.5 allows for maximum nutrient availability for most crops."
  },
  {
    id: 3,
    category: "Agronomy",
    difficulty: "easy",
    question: "Which of the following is a leguminous crop?",
    questionHindi: "निम्नलिखित में से कौन सी दलहनी फसल है?",
    options: ["Sugarcane", "Cotton", "Gram (Chickpea)", "Jute"],
    correctAnswerIndex: 2,
    explanation: "Gram (Chickpea) is a legume, meaning it has nodules in its roots that fix atmospheric nitrogen."
  },
  {
    id: 4,
    category: "Irrigation",
    difficulty: "easy",
    question: "Which irrigation method has the highest water use efficiency?",
    questionHindi: "किस सिंचाई पद्धति की जल उपयोग दक्षता सबसे अधिक है?",
    options: ["Flood Irrigation", "Sprinkler Irrigation", "Drip Irrigation", "Furrow Irrigation"],
    correctAnswerIndex: 2,
    explanation: "Drip irrigation delivers water directly to the root zone, minimizing evaporation and runoff, achieving 90-95% efficiency."
  },
  {
    id: 5,
    category: "Entomology",
    difficulty: "medium",
    question: "The 'Pink Bollworm' is a major pest of which crop?",
    questionHindi: "'गुलाबी बॉलवर्म' किस फसल का प्रमुख कीट है?",
    options: ["Wheat", "Cotton", "Tomato", "Mango"],
    correctAnswerIndex: 1,
    explanation: "Pink Bollworm (Pectinophora gossypiella) is the most destructive pest of cotton causing damage to the bolls."
  },
  {
    id: 6,
    category: "Horticulture",
    difficulty: "medium",
    question: "Which fruit is known as the 'Queen of Fruits' in India?",
    questionHindi: "भारत में किस फल को 'फलों की रानी' कहा जाता है?",
    options: ["Mango", "Banana", "Litchi", "Mangosteen"],
    correctAnswerIndex: 3,
    explanation: "While Mango is the King, Mangosteen is often referred to as the Queen of Fruits due to its exquisite taste and nutritional value."
  },
  {
    id: 7,
    category: "Soil Science",
    difficulty: "medium",
    question: "Khaira disease in rice is caused by the deficiency of which nutrient?",
    questionHindi: "धान में खैरा रोग किस पोषक तत्व की कमी से होता है?",
    options: ["Nitrogen", "Iron", "Zinc", "Boron"],
    correctAnswerIndex: 2,
    explanation: "Khaira disease is a zinc deficiency disorder characterized by reddish-brown discoloration of leaves."
  },
  {
    id: 8,
    category: "Technology",
    difficulty: "medium",
    question: "What does 'SRI' stand for in rice cultivation?",
    questionHindi: "धान की खेती में 'SRI' का क्या अर्थ है?",
    options: ["System of Rice Intensification", "Sustainable Rice Initiative", "Scientific Rice Innovation", "Soil and Rice Integration"],
    correctAnswerIndex: 0,
    explanation: "SRI stands for System of Rice Intensification, a methodology aimed at increasing the yield of rice produced in farming."
  },
  {
    id: 9,
    category: "Plant Pathology",
    difficulty: "hard",
    question: "Which fungicide is commonly used to treat seed before sowing?",
    questionHindi: "बुवाई से पहले बीज के उपचार के लिए आमतौर पर किस कवकनाशी का उपयोग किया जाता है?",
    options: ["Urea", "Thiram", "DDT", "Glyphosate"],
    correctAnswerIndex: 1,
    explanation: "Thiram is a protective fungicide widely used for seed treatment to control damping off and other seed-borne diseases."
  },
  {
    id: 10,
    category: "Extension",
    difficulty: "hard",
    question: "In which year was the Kisan Credit Card (KCC) scheme introduced in India?",
    questionHindi: "भारत में किसान क्रेडिट कार्ड (KCC) योजना किस वर्ष शुरू की गई थी?",
    options: ["1991", "1998", "2004", "2010"],
    correctAnswerIndex: 1,
    explanation: "The KCC scheme was introduced in August 1998 to provide adequate and timely credit support to farmers."
  },
  {
    id: 11,
    category: "Genetics",
    difficulty: "hard",
    question: "Who is known as the 'Father of Green Revolution' in the world?",
    questionHindi: "विश्व में 'हरित क्रांति का जनक' किसे माना जाता है?",
    options: ["M.S. Swaminathan", "Norman Borlaug", "Verghese Kurien", "Gregor Mendel"],
    correctAnswerIndex: 1,
    explanation: "Dr. Norman Borlaug is the Father of the Green Revolution worldwide. M.S. Swaminathan is the Father of the Green Revolution in India."
  },
  {
    id: 12,
    category: "Agronomy",
    difficulty: "hard",
    question: "Botanical name of Finger Millet is?",
    questionHindi: "रागी (Finger Millet) का वानस्पतिक नाम क्या है?",
    options: ["Pennisetum glaucum", "Sorghum bicolor", "Eleusine coracana", "Zea mays"],
    correctAnswerIndex: 2,
    explanation: "Eleusine coracana is the scientific name for Finger Millet, a staple grain in many parts of Africa and India."
  },
  {
    id: 13,
    category: "Soil Fertility",
    difficulty: "hard",
    question: "Which bio-fertilizer is mainly used for Sugarcane?",
    questionHindi: "गन्ने के लिए मुख्य रूप से किस जैव उर्वरक का उपयोग किया जाता है?",
    options: ["Rhizobium", "Azotobacter", "Azospirillum", "Acetobacter"],
    correctAnswerIndex: 3,
    explanation: "Acetobacter diazotrophicus is an endophytic nitrogen-fixing bacterium specifically beneficial for sugarcane crops."
  },
  {
    id: 14,
    category: "Machinery",
    difficulty: "hard",
    question: "A 'Rotavator' is primarily used for?",
    questionHindi: "'रोटावेटर' का मुख्य उपयोग क्या है?",
    options: ["Harvesting", "Seed Bed Preparation", "Spraying", "Threshing"],
    correctAnswerIndex: 1,
    explanation: "A Rotavator is a tractor-drawn implement used for seed bed preparation by pulverizing the soil."
  },
  {
    id: 15,
    category: "Economics",
    difficulty: "hard",
    question: "What is the minimum support price (MSP) recommended by?",
    questionHindi: "न्यूनतम समर्थन मूल्य (MSP) की सिफारिश किसके द्वारा की जाती है?",
    options: ["NABARD", "ICAR", "CACP", "FCI"],
    correctAnswerIndex: 2,
    explanation: "The Commission for Agricultural Costs and Prices (CACP) recommends MSPs for mandated crops."
  }
];
