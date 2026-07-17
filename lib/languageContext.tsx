"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode =
  | "en" | "hi" | "bn" | "te" | "mr" | "ta" | "ur" | "gu"
  | "kn" | "or" | "ml" | "pa" | "as" | "mai" | "kok";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechLang: string; // Speech synthesis / recognition code
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", speechLang: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechLang: "hi-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechLang: "bn-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechLang: "te-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechLang: "mr-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechLang: "ta-IN" },
  { code: "ur", name: "Urdu", nativeName: "اردو", speechLang: "ur-PK" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechLang: "gu-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechLang: "kn-IN" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", speechLang: "or-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speechLang: "ml-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speechLang: "pa-IN" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", speechLang: "as-IN" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", speechLang: "hi-IN" }, // Maithili often maps to hi-IN voices if not natively present
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", speechLang: "kok-IN" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    findSchemes: "Find Schemes",
    aiChat: "AI Chat",
    heroTitle: "Find the government schemes you actually qualify for",
    heroSubtitle: "Answer a few questions, get matched instantly, and ask SarkarGPT anything about eligibility or how to apply.",
    findMySchemesBtn: "Find my schemes",
    askSarkarGptBtn: "Ask SarkarGPT",
    quickPreview: "Quick preview",
    categoriesCovered: "Categories covered in this prototype",
    featuresTitle: "Why SarkarGPT?",
    howItWorks: "How it works",
    basics: "Basics",
    workIncome: "Work & income",
    specialCategories: "Special categories",
    state: "State",
    selectState: "Select state",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    occupation: "Occupation",
    selectOccupation: "Select occupation",
    farmer: "Farmer",
    student: "Student",
    salaried: "Salaried",
    selfEmployed: "Self-employed",
    unemployed: "Unemployed",
    incomeLabel: "Annual household income (₹)",
    studentCheck: "Student",
    farmerCheck: "Farmer",
    startupCheck: "Startup founder",
    msmeCheck: "MSME owner",
    womanCheck: "Woman entrepreneur",
    disabilityCheck: "Person with disability",
    seniorCheck: "Senior citizen",
    backBtn: "Back",
    nextBtn: "Next",
    seeSchemesBtn: "See my schemes",
    editProfile: "Edit profile",
    matchedText: "matched",
    noMatches: "No matches in this prototype's demo catalog — try adjusting your profile or ask SarkarGPT chat directly.",
    benefits: "Benefits",
    docsNeeded: "Documents needed",
    applyBtn: "Apply",
    learnMore: "Learn more",
    hideDetails: "Hide details",
    listenDetails: "Listen to Details",
    stopListening: "Stop",
    speakBtn: "Speak question",
    chatHeader: "SarkarGPT Chat",
    clearBtn: "Clear",
    chatPlaceholder: "Ask about a scheme...",
    suggestedTitle: "Ask about schemes in plain language.",
    listening: "Listening... speak now",
    docGuideTitle: "Document Guide",
    docWhat: "What is it?",
    docHow: "How to get it?",
    docTime: "Processing Time",
    docFees: "Fees & Charges",
    docOnlineLink: "Apply Online",
    readAloud: "Read Aloud",
    stopRead: "Stop Audio",
  },
  hi: {
    findSchemes: "योजनाएं खोजें",
    aiChat: "एआई चैट",
    heroTitle: "उन सरकारी योजनाओं को खोजें जिनके लिए आप वास्तव में पात्र हैं",
    heroSubtitle: "कुछ सवालों के जवाब दें, तुरंत मेल खाएं, और पात्रता या आवेदन करने के तरीके के बारे में सरकारजीपीटी से कुछ भी पूछें।",
    findMySchemesBtn: "मेरी योजनाएं खोजें",
    askSarkarGptBtn: "सरकारजीपीटी से पूछें",
    quickPreview: "त्वरित पूर्वावलोकन",
    categoriesCovered: "इस प्रोटोटाइप में शामिल श्रेणियां",
    featuresTitle: "सरकारजीपीटी क्यों?",
    howItWorks: "यह कैसे काम करता है",
    basics: "बुनियादी जानकारी",
    workIncome: "काम और आय",
    specialCategories: "विशेष श्रेणियां",
    state: "राज्य",
    selectState: "राज्य चुनें",
    age: "उम्र",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    occupation: "व्यवसाय",
    selectOccupation: "व्यवसाय चुनें",
    farmer: "किसान",
    student: "छात्र",
    salaried: "वेतनभोगी",
    selfEmployed: "स्व-नियोजित",
    unemployed: "बेरोजगार",
    incomeLabel: "वार्षिक पारिवारिक आय (₹)",
    studentCheck: "छात्र",
    farmerCheck: "किसान",
    startupCheck: "स्टार्टअप संस्थापक",
    msmeCheck: "एमएसएमई मालिक",
    womanCheck: "महिला उद्यमी",
    disabilityCheck: "दिव्यांग व्यक्ति",
    seniorCheck: "वरिष्ठ नागरिक",
    backBtn: "पीछे",
    nextBtn: "आगे",
    seeSchemesBtn: "मेरी योजनाएं देखें",
    editProfile: "प्रोफ़ाइल संपादित करें",
    matchedText: "योजनाएं मिलीं",
    noMatches: "इस प्रोटोटाइप के डेमो कैटलॉग में कोई मेल नहीं मिला — अपनी प्रोफ़ाइल को समायोजित करने का प्रयास करें या सीधे सरकारजीपीटी चैट से पूछें।",
    benefits: "लाभ",
    docsNeeded: "आवश्यक दस्तावेज़",
    applyBtn: "आवेदन करें",
    learnMore: "अधिक जानें",
    hideDetails: "विवरण छुपाएं",
    listenDetails: "विवरण सुनें",
    stopListening: "रोकें",
    speakBtn: "बोलकर पूछें",
    chatHeader: "सरकारजीपीटी चैट",
    clearBtn: "साफ करें",
    chatPlaceholder: "किसी योजना के बारे में पूछें...",
    suggestedTitle: "सरल भाषा में योजनाओं के बारे में पूछें।",
    listening: "सुन रहा हूँ... अब बोलें",
    docGuideTitle: "दस्तावेज़ गाइड",
    docWhat: "यह क्या है?",
    docHow: "इसे कैसे प्राप्त करें?",
    docTime: "प्रसंस्करण समय",
    docFees: "शुल्क और शुल्क",
    docOnlineLink: "ऑनलाइन आवेदन करें",
    readAloud: "जोर से सुनें",
    stopRead: "ऑडियो रोकें",
  },
  bn: {
    findSchemes: "পরিকল্পনা খুঁজুন",
    aiChat: "এআই চ্যাট",
    heroTitle: "আপনি আসলে যে সরকারী প্রকল্পগুলির জন্য যোগ্য তা সন্ধান করুন",
    heroSubtitle: "কয়েকটি প্রশ্নের উত্তর দিন, তাত্ক্ষণিকভাবে মিলে যান এবং যোগ্যতা বা কীভাবে আবেদন করবেন সে সম্পর্কে সরকারজিপিটি-কে জিজ্ঞাসা করুন।",
    findMySchemesBtn: "আমার প্রকল্প খুঁজুন",
    askSarkarGptBtn: "সরকারজিপিটি-কে জিজ্ঞাসা করুন",
    quickPreview: "দ্রুত পূর্বরূপ",
    categoriesCovered: "এই প্রোটোটাইপে অন্তর্ভুক্ত বিভাগসমূহ",
    featuresTitle: "কেন সরকারজিপিটি?",
    howItWorks: "এটি কীভাবে কাজ করে",
    basics: "প্রাথমিক তথ্য",
    workIncome: "কাজ এবং আয়",
    specialCategories: "বিশেষ বিভাগ",
    state: "রাজ্য",
    selectState: "রাজ্য নির্বাচন করুন",
    age: "বয়স",
    gender: "লিঙ্গ",
    male: "पुरुष",
    female: "মহিলা",
    other: "অন্যান্য",
    occupation: "পেশা",
    selectOccupation: "পেশা নির্বাচন করুন",
    farmer: "কৃষক",
    student: "ছাত্র",
    salaried: "চাকুরীজীবি",
    selfEmployed: "স্বনির্ভর",
    unemployed: "বেকার",
    incomeLabel: "বার্ষিক পারিবারিক আয় (₹)",
    studentCheck: "ছাত্র",
    farmerCheck: "কৃষক",
    startupCheck: "স্টার্টআপ প্রতিষ্ঠাতা",
    msmeCheck: "এমএসএমই মালিক",
    womanCheck: "মহিলা উদ্যোক্তা",
    disabilityCheck: "প্রতিবন্ধী ব্যক্তি",
    seniorCheck: "প্রবীণ নাগরিক",
    backBtn: "পিছনে",
    nextBtn: "পরবর্তী",
    seeSchemesBtn: "আমার প্রকল্পগুলি দেখুন",
    editProfile: "প্রোফাইল সম্পাদন করুন",
    matchedText: "টি প্রকল্প মিলেছে",
    noMatches: "এই প্রোটোটাইপের ডেমো ক্যাটালগে কোনও মিল পাওয়া যায়নি — আপনার প্রোফাইল পরিবর্তন করার চেষ্টা করুন বা সরাসরি সরকারজিপিটি চ্যাটকে জিজ্ঞাসা করুন।",
    benefits: "সুবিধাসমূহ",
    docsNeeded: "প্রয়োজনীয় কাগজপত্র",
    applyBtn: "আবেদন করুন",
    learnMore: "আরও জানুন",
    hideDetails: "তথ্য লুকান",
    listenDetails: "তথ্য শুনুন",
    stopListening: "থামুন",
    speakBtn: "বলুন",
    chatHeader: "সরকারজিপিটি চ্যাট",
    clearBtn: "মুছে ফেলুন",
    chatPlaceholder: "প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...",
    suggestedTitle: "সহজ ভাষায় প্রকল্পগুলি সম্পর্কে জিজ্ঞাসা করুন।",
    listening: "শুনছি... এখন বলুন",
    docGuideTitle: "নথিপত্র নির্দেশিকা",
    docWhat: "এটি কি?",
    docHow: "এটি কীভাবে পাবেন?",
    docTime: "প্রক্রিয়াকরণ সময়",
    docFees: "ফি এবং চার্জ",
    docOnlineLink: "অনলাইনে আবেদন করুন",
    readAloud: "শুনুন",
    stopRead: "অডিও বন্ধ করুন",
  },
  te: {
    findSchemes: "పథకాలు కనుగొనండి",
    aiChat: "AI చాట్",
    heroTitle: "మీరు నిజంగా అర్హత పొండే ప్రభుత్వ పథకాలను కనుగొనండి",
    heroSubtitle: "కొన్ని ప్రశ్నలకు సమాధానమివ్వండి, తక్షణమే సరిపోలండి మరియు అర్హత లేదా ఎలా దరఖాస్తు చేయాలనే దాని గురించి సర్కార్‌జిపిటిని అడగండి.",
    findMySchemesBtn: "నా పథకాలను కనుగొనండి",
    askSarkarGptBtn: "సర్కార్‌జిపిటిని అడగండి",
    quickPreview: "త్వరిత ప్రివ్యూ",
    categoriesCovered: "ఈ ప్రోటోటైప్‌లో ఉన్న వర్గాలు",
    featuresTitle: "సర్కార్‌జిపిటి ఎందుకు?",
    howItWorks: "ఇది ఎలా పని చేస్తుంది",
    basics: "ప్రాథమిక అంశాలు",
    workIncome: "పని & ఆదాయం",
    specialCategories: "ప్రత్యేక వర్గాలు",
    state: "రాష్ట్రం",
    selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
    age: "వయస్సు",
    gender: "లింగం",
    male: "పురుషుడు",
    female: "స్త్రీ",
    other: "ఇతర",
    occupation: "ఉద్యోగం",
    selectOccupation: "ఉద్యోగాన్ని ఎంచుకోండి",
    farmer: "రైతు",
    student: "విద్యార్థి",
    salaried: "ఉద్యోగి",
    selfEmployed: "స్వయం ఉపాధి",
    unemployed: "నిరుద్యోగి",
    incomeLabel: "వార్షిక కుటుంబ ఆదాయం (₹)",
    studentCheck: "విద్యార్థి",
    farmerCheck: "రైతు",
    startupCheck: "స్టార్టప్ వ్యవస్థాపకుడు",
    msmeCheck: "MSME యజమాని",
    womanCheck: "మహిళా పారిశ్రామికవేత్త",
    disabilityCheck: "వికలాంగుడు",
    seniorCheck: "సీనియర్ సిటిజన్",
    backBtn: "వెనుకకు",
    nextBtn: "తరువాత",
    seeSchemesBtn: "నా పథకాలను చూడండి",
    editProfile: "ప్రొఫైల్ సవరించండి",
    matchedText: "పథకాలు సరిపోలాయి",
    noMatches: "ఈ ప్రోటోటైప్ డెమో కేటలాగ్‌లో సరిపోలికలు లేవు — దయచేసి ప్రొఫైల్‌ను సవరించండి లేదా నేరుగా సర్కార్‌జిపిటిని అడగండి.",
    benefits: "ప్రయోజనాలు",
    docsNeeded: "కావలసిన పత్రాలు",
    applyBtn: "దరఖాస్తు చేయండి",
    learnMore: "మరింత తెలుసుకోండి",
    hideDetails: "ವಿವರಗಳನ್ನು దాచు",
    listenDetails: "ವಿವರಗಳು వినండి",
    stopListening: "ఆపండి",
    speakBtn: "మాట్లాడి అడగండి",
    chatHeader: "సర్కార్‌జిపిటి చాట్",
    clearBtn: "క్లియర్ చేయండి",
    chatPlaceholder: "పథకం గురించి అడగండి...",
    suggestedTitle: "సరళమైన భాషలో పథకాల గురించి అడగండి.",
    listening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
    docGuideTitle: "పత్రాల మార్గదర్శి",
    docWhat: "ఇది ఏమిటి?",
    docHow: "ఇది ఎలా పొందాలి?",
    docTime: "ప్రాసెసింగ్ సమయం",
    docFees: "రుసుము & ఛార్జీలు",
    docOnlineLink: "ఆన్‌లైన్ దరఖాస్తు",
    readAloud: "వినండి",
    stopRead: "ఆడియో ఆపండి",
  },
  mr: {
    findSchemes: "योजना शोधा",
    aiChat: "एआय चॅट",
    heroTitle: "तुम्ही खरोखर पात्र असलेल्या सरकारी योजना शोधा",
    heroSubtitle: "काही प्रश्नांची उत्तरे द्या, त्वरित पात्र योजना पहा आणि पात्रता किंवा अर्ज कसा करावा याबद्दल सरकारजीपीटीला विचारा.",
    findMySchemesBtn: "माझ्या योजना शोधा",
    askSarkarGptBtn: "सरकारजीपीटीला विचारा",
    quickPreview: "द्रुत पूर्वावलोकन",
    categoriesCovered: "या प्रोटोटाइपमधील श्रेणी",
    featuresTitle: "सरकारजीपीटी का?",
    howItWorks: "हे कसे काम करते",
    basics: "मूलभूत माहिती",
    workIncome: "काम आणि उत्पन्न",
    specialCategories: "विशेष श्रेणी",
    state: "राज्य",
    selectState: "राज्य निवडा",
    age: "वय",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "इतर",
    occupation: "व्यवसाय",
    selectOccupation: "व्यवसाय निवडा",
    farmer: "शेतकरी",
    student: "विद्यार्थी",
    salaried: "पगारदार",
    selfEmployed: "स्वयंरोजगार",
    unemployed: "बेरोजगार",
    incomeLabel: "वार्षिक कौटुंबिक उत्पन्न (₹)",
    studentCheck: "विद्यार्थी",
    farmerCheck: "शेतकरी",
    startupCheck: "स्टार्टअप संस्थापक",
    msmeCheck: "एमएसएमई मालक",
    womanCheck: "महिला उद्योजक",
    disabilityCheck: "दिव्यांग व्यक्ती",
    seniorCheck: "ज्येष्ठ नागरिक",
    backBtn: "मागे",
    nextBtn: "पुढे",
    seeSchemesBtn: "माझ्या योजना पहा",
    editProfile: "प्रोफाइल बदला",
    matchedText: "योजना मिळाल्या",
    noMatches: "या प्रोटोटाइपच्या डेमॉ कॅटलॉगमध्ये कोणताही मेळ आढळला नाही — तुमचे प्रोफाइल बदलून पहा किंवा थेट चॅटमध्ये विचारा.",
    benefits: "फायदे",
    docsNeeded: "आवश्यक कागदपत्रे",
    applyBtn: "अर्ज करा",
    learnMore: "अधिक जाणून घ्या",
    hideDetails: "माहिती लपवा",
    listenDetails: "माहिती ऐका",
    stopListening: "थांबवा",
    speakBtn: "बोलून विचारा",
    chatHeader: "सरकारजीपीटी चॅट",
    clearBtn: "साफ करा",
    chatPlaceholder: "योजनेबद्दल विचारा...",
    suggestedTitle: "सोप्या भाषेत योजनांबद्दल विचारा.",
    listening: "ऐकत आहे... आता बोला",
    docGuideTitle: "कागदपत्र मार्गदर्शक",
    docWhat: "हे काय आहे?",
    docHow: "हे कसे मिळवायचे?",
    docTime: "प्रक्रियेचा वेळ",
    docFees: "शुल्क आणि आकारणी",
    docOnlineLink: "ऑनलाइन अर्ज करा",
    readAloud: "ऐका",
    stopRead: "ऑडिओ थांबवा",
  },
  ta: {
    findSchemes: "திட்டங்களைக் கண்டறி",
    aiChat: "AI அரட்டை",
    heroTitle: "நீங்கள் உண்மையிலேயே தகுதிபெறும் அரசு திட்டங்களைக் கண்டறியுங்கள்",
    heroSubtitle: "சில கேள்விகளுக்குப் பதிலளிக்கவும், உடனடியாகப் பொருத்தமான திட்டங்களைப் பெறவும், தகுதி அல்லது விண்ணப்பிப்பது எப்படி என்று சர்க்கார்ஜிபிடியிடம் கேட்கவும்.",
    findMySchemesBtn: "என் திட்டங்களைக் காண்க",
    askSarkarGptBtn: "சர்க்கார்ஜிபிடியிடம் கேள்",
    quickPreview: "விரைவான முன்னோட்டம்",
    categoriesCovered: "இந்த முன்மாதிரியில் உள்ள பிரிவுகள்",
    featuresTitle: "ஏன் சர்க்கார்ஜிபிடி?",
    howItWorks: "இது எவ்வாறு செயல்படுகிறது",
    basics: "அடிப்படை விவரங்கள்",
    workIncome: "வேலை & வருமானம்",
    specialCategories: "சிறப்பு பிரிவுகள்",
    state: "மாநிலம்",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    age: "வயது",
    gender: "பாலினம்",
    male: "ஆண்",
    female: "பெண்",
    other: "இதர",
    occupation: "தொழில்",
    selectOccupation: "தொழிலைத் தேர்ந்தெடுக்கவும்",
    farmer: "விவசாயி",
    student: "மாணவர்",
    salaried: "மாத சம்பளம் பெறுபவர்",
    selfEmployed: "சுயதொழில் செய்பவர்",
    unemployed: "வேலையில்லாதவர்",
    incomeLabel: "ஆண்டு குடும்ப வருமானம் (₹)",
    studentCheck: "மாணவர்",
    farmerCheck: "விவசாயி",
    startupCheck: "தொழில்முனைவோர்",
    msmeCheck: "MSME உரிமையாளர்",
    womanCheck: "பெண் தொழில்முனைவோர்",
    disabilityCheck: "மாற்றுத்திறனாளி",
    seniorCheck: "முதியவர்",
    backBtn: "பின்னால்",
    nextBtn: "அடுத்து",
    seeSchemesBtn: "எனது திட்டங்களைப் பார்",
    editProfile: "விவரங்களை மாற்று",
    matchedText: "திட்டங்கள் பொருந்துகின்றன",
    noMatches: "இந்த முன்மாதிரி தரவுத்தளத்தில் பொருந்தக்கூடிய திட்டங்கள் இல்லை — விவரங்களை மாற்றி முயற்சிக்கவும் அல்லது சர்க்கார்ஜிபிடியிடம் நேரடியாகக் கேட்கவும்.",
    benefits: "பலன்கள்",
    docsNeeded: "தேவையான ஆவணங்கள்",
    applyBtn: "விண்ணப்பி",
    learnMore: "மேலும் அறிய",
    hideDetails: "விவரங்களை மறை",
    listenDetails: "விவரங்களைக் கேள்",
    stopListening: "நிறுத்து",
    speakBtn: "பேசி கேட்கவும்",
    chatHeader: "சர்க்கார்ஜிபிடி அரட்டை",
    clearBtn: "அழி",
    chatPlaceholder: "திட்டங்களைப் பற்றிக் கேளுங்கள்...",
    suggestedTitle: "எளிய மொழியில் திட்டங்களைப் பற்றிக் கேளுங்கள்.",
    listening: "கேட்கிறது... இப்போது பேசுங்கள்",
    docGuideTitle: "ஆவண வழிகாட்டி",
    docWhat: "இது என்ன?",
    docHow: "இதை எப்படி பெறுவது?",
    docTime: "செயலாக்க நேரம்",
    docFees: "கட்டணம்",
    docOnlineLink: "ஆன்லைனில் விண்ணப்பி",
    readAloud: "ஒலிவடிவில் கேள்",
    stopRead: "ஒலியை நிறுத்து",
  },
  ur: {
    findSchemes: "اسکیمیں تلاش کریں",
    aiChat: "آئی چیٹ",
    heroTitle: "سرکاری اسکیمیں تلاش کریں جن کے لیے آپ اہل ہیں",
    heroSubtitle: "چند سوالات کے جواب دیں، فوری طور پر اہل اسکیمیں دیکھیں، اور سرکار جی پی ٹی سے کچھ بھی پوچھیں۔",
    findMySchemesBtn: "میری اسکیمیں تلاش کریں",
    askSarkarGptBtn: "سرکار جی پی ٹی سے پوچھیں",
    quickPreview: "فوری پیش نظارہ",
    categoriesCovered: "اس پروٹوٹائپ میں شامل زمرے",
    featuresTitle: "سرکار جی پی ٹی کیوں؟",
    howItWorks: "یہ کیسے کام کرتا ہے",
    basics: "بنیادی باتیں",
    workIncome: "کام اور آمدنی",
    specialCategories: "خصوصی زمرے",
    state: "ریاست",
    selectState: "ریاست منتخب کریں",
    age: "عمر",
    gender: "جنس",
    male: "مرد",
    female: "عورت",
    other: "دیگر",
    occupation: "پیشہ",
    selectOccupation: "پیشہ منتخب کریں",
    farmer: "کسان",
    student: "طالب علم",
    salaried: "ملازم پیشہ",
    selfEmployed: "خود روزگار",
    unemployed: "بے روزگار",
    incomeLabel: "سالانہ خاندانی آمدنی (₹)",
    studentCheck: "طالب علم",
    farmerCheck: "کسان",
    startupCheck: "اسٹارٹ اپ بانی",
    msmeCheck: "MSME مالک",
    womanCheck: "خاتون کاروباری",
    disabilityCheck: "معذور شخص",
    seniorCheck: "بزرگ شہری",
    backBtn: "پیچھے",
    nextBtn: "آگے",
    seeSchemesBtn: "मेरी اسکیمیں دیکھیں",
    editProfile: "پروفائل تبدیل کریں",
    matchedText: "اسکیمیں ملیں",
    noMatches: "اس ڈیمو کیٹلاگ میں کوئی مطابقت نہیں ملی — اپنی تفصیلات بدلیں یا سرکار جی پی ٹی سے براہ راست چیٹ کریں۔",
    benefits: "فوائد",
    docsNeeded: "مطلوبہ دستاویزات",
    applyBtn: "درخواست دیں",
    learnMore: "مزید معلومات",
    hideDetails: "تفصیلات چھپائیں",
    listenDetails: "تفصیلات سنیں",
    stopListening: "روکیں",
    speakBtn: "بول کر پوچھیں",
    chatHeader: "سرکار جی پی ٹی چیٹ",
    clearBtn: "صاف کریں",
    chatPlaceholder: "اسکیم کے بارے में پوچھیں...",
    suggestedTitle: "سادہ زبان میں اسکیموں کے بارے میں پوچھیں۔",
    listening: "سن رہا ہوں... اب بولیں",
    docGuideTitle: "دستاویز گائیڈ",
    docWhat: "یہ کیا ہے؟",
    docHow: "اسے کیسے حاصل کریں؟",
    docTime: "پروسیسنگ کا وقت",
    docFees: "فیس اور چارجز",
    docOnlineLink: "آن لائن درخواست دیں",
    readAloud: "آواز میں سنیں",
    stopRead: "آواز روکیں",
  },
  gu: {
    findSchemes: "યોજનાઓ શોધો",
    aiChat: "AI ચેટ",
    heroTitle: "તમે ખરેખર લાયક છો તેવી સરકારી યોજનાઓ શોધો",
    heroSubtitle: "થોડા પ્રશ્નોના જવાબો આપો, તરત જ યોજનાઓ મેળવો અને પાત્રતા અથવા અરજી વિશે સરકારજીપીટીને પૂછો.",
    findMySchemesBtn: "મારી યોજનાઓ શોધો",
    askSarkarGptBtn: "સરકારજીપીટીને પૂછો",
    quickPreview: "ઝડપી પૂર્વાવલોકન",
    categoriesCovered: "આ પ્રોટોટાઇપમાં આવરી લેવાયેલ શ્રેણીઓ",
    featuresTitle: "શા માટે સરકારજીપીટી?",
    howItWorks: "તે કેવી રીતે કામ કરે છે",
    basics: "મૂળભૂત બાબતો",
    workIncome: "કામ અને આવક",
    specialCategories: "ખાસ શ્રેણીઓ",
    state: "રાજ્ય",
    selectState: "રાજ્ય પસંદ કરો",
    age: "ઉંમર",
    gender: "જાતિ",
    male: "પુરુષ",
    female: "સ્ત્રી",
    other: "અન્ય",
    occupation: "વ્યવસાય",
    selectOccupation: "વ્યવસાય પસંદ કરો",
    farmer: "ખેડૂત",
    student: "વિદ્યાર્થી",
    salaried: "નોકરીયાત",
    selfEmployed: "સ્વ-રોજગાર",
    unemployed: "બેરોજગાર",
    incomeLabel: "વાર્ષિક કૌટુંબિક આવક (₹)",
    studentCheck: "વિદ્યાર્થી",
    farmerCheck: "ખેડૂત",
    startupCheck: "સ્ટાર્ટઅપ સ્થાપક",
    msmeCheck: "MSME માલિક",
    womanCheck: "મહિલા ઉદ્યોગસાહસિક",
    disabilityCheck: "દિવ્યાંગ વ્યક્તિ",
    seniorCheck: "વરિષ્ઠ નાગરિક",
    backBtn: "પાછળ",
    nextBtn: "આગળ",
    seeSchemesBtn: "મારી યોજનાઓ જુઓ",
    editProfile: "પ્રોફાઇલ સંપાદિત કરો",
    matchedText: "યોજનાઓ મળી",
    noMatches: "આ પ્રોટોટાઇપના ડેમો કેટલોગમાં કોઈ મેળ મળ્યો નથી — તમારી પ્રોફાઇલ સુધારો અથવા સીધા ચેટમાં પૂછો.",
    benefits: "લાભો",
    docsNeeded: "જરૂરી દસ્તાવેજો",
    applyBtn: "અરજી કરો",
    learnMore: "વધુ જાણો",
    hideDetails: "વિગતો છુપાવો",
    listenDetails: "વિગતો સાંભળો",
    stopListening: "રોકો",
    speakBtn: "બોલીને પૂછો",
    chatHeader: "સરકારજીપીટી ચેટ",
    clearBtn: "સાફ કરો",
    chatPlaceholder: "યોજના વિશે પૂછો...",
    suggestedTitle: "સરળ ભાષામાં યોજનાઓ વિશે પૂછો.",
    listening: "સાંભળી રહ્યું છે... હવે બોલો",
    docGuideTitle: "દસ્તાવેજ માર્ગદર્શિકા",
    docWhat: "આ શું છે?",
    docHow: "તે કેવી રીતે મેળવવું?",
    docTime: "પ્રોસેસિંગ સમય",
    docFees: "ફી અને ચાર્જીસ",
    docOnlineLink: "ઓનલાઇન અરજી કરો",
    readAloud: "સાંભળો",
    stopRead: "ઓડિયો રોકો",
  },
  kn: {
    findSchemes: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    aiChat: "AI ಚಾಟ್",
    heroTitle: "ನೀವು ನಿಜವಾಗಿಯೂ ಅರ್ಹರಾಗಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    heroSubtitle: "ಕೆಲವು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ, ತಕ್ಷಣವೇ ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ ಮತ್ತು ಅರ್ಹತೆ ಅಥವಾ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಬಗ್ಗೆ ಸರ್ಕಾರ್‌ಜಿಪಿಟಿಯನ್ನು ಕೇಳಿ.",
    findMySchemesBtn: "ನನ್ನ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    askSarkarGptBtn: "ಸರ್ಕಾರ್‌ಜಿಪಿಟಿಯನ್ನು ಕೇಳಿ",
    quickPreview: "ತ್ವರಿತ ಮುನ್ನೋಟ",
    categoriesCovered: "ಈ ಪ್ರೊಟೊಟೈಪ್‌ನಲ್ಲಿರುವ ವರ್ಗಗಳು",
    featuresTitle: "ಸರ್ಕಾರ್‌ಜಿಪಿಟಿ ಏಕೆ?",
    howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    basics: "ಮೂಲಭೂತ ಸಂಗತಿಗಳು",
    workIncome: "ಕೆಲಸ ಮತ್ತು ಆದಾಯ",
    specialCategories: "ವಿಶೇಷ ವರ್ಗಗಳು",
    state: "ರಾಜ್ಯ",
    selectState: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    age: "ವಯಸ್ಸು",
    gender: "ಲಿಂಗ",
    male: "ಪುರುಷ",
    female: "ಮಹಿಳೆ",
    other: "ಇತರ",
    occupation: "ಉದ್ಯೋಗ",
    selectOccupation: "ಉದ್ಯೋಗ ಆಯ್ಕೆಮಾಡಿ",
    farmer: "ರೈತ",
    student: "ವಿದ್ಯಾರ್ಥಿ",
    salaried: "ವೇತನದಾರ",
    selfEmployed: "ಸ್ವಯಂ ಉದ್ಯೋಗಿ",
    unemployed: "ನಿರುದ್ಯೋಗಿ",
    incomeLabel: "ವಾರ್ಷಿಕ ಕೌಟುಂಬಿಕ ಆದಾಯ (₹)",
    studentCheck: "ವಿದ್ಯಾರ್ಥಿ",
    farmerCheck: "ರೈತ",
    startupCheck: "ಸ್ಟಾರ್ಟ್ಅಪ್ ಸಂಸ್ಥಾಪಕ",
    msmeCheck: "MSME ಮಾಲೀಕ",
    womanCheck: "ಮಹಿಳಾ ಉದ್ಯಮಿ",
    disabilityCheck: "ವಿಕಲಚೇತನ ವ್ಯಕ್ತಿ",
    seniorCheck: "ಹಿರಿಯ ನಾಗರಿಕ",
    backBtn: "ಹಿಂದಕ್ಕೆ",
    nextBtn: "ಮುಂದಕ್ಕೆ",
    seeSchemesBtn: "ನನ್ನ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ",
    editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    matchedText: "ಯೋಜನೆಗಳು ಹೊಂದಾಣಿಕೆಯಾಗಿವೆ",
    noMatches: "ಈ ಪ್ರೊಟೊಟೈಪ್‌ನ ಡೆಮೊ ಕ್ಯಾಟಲಾಗ್‌ನಲ್ಲಿ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಗಳಿಲ್ಲ — ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಹೊಂದಿಸಿ ಅಥವಾ ಚಾಟ್‌ನಲ್ಲಿ ಕೇಳಿ.",
    benefits: "ಪ್ರಯೋಜನಗಳು",
    docsNeeded: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು",
    applyBtn: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    learnMore: "ಹೆಚ್ಚು ತಿಳಿಯಿರಿ",
    hideDetails: "ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ",
    listenDetails: "ವಿವರಗಳನ್ನು ಕೇಳಿ",
    stopListening: "ನಿಲ್ಲಿಸಿ",
    speakBtn: "ಮಾತನಾಡಿ ಕೇಳಿ",
    chatHeader: "ಸರ್ಕಾರ್‌ಜಿಪಿಟಿ ಚಾಟ್",
    clearBtn: "ತೆರವುಗೊಳಿಸಿ",
    chatPlaceholder: "ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಿ...",
    suggestedTitle: "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    docGuideTitle: "ದಾಖಲೆ ಮಾರ್ಗದರ್ಶಿ",
    docWhat: "ಇದು ಏನು?",
    docHow: "ಇದನ್ನು ಪಡೆಯುವುದು ಹೇಗೆ?",
    docTime: "ಪ್ರಕ್ರಿಯೆಯ ಸಮಯ",
    docFees: "ಶುಲ್ಕಗಳು",
    docOnlineLink: "ಆನ್‌ಲೈನ್ ಅರ್ಜಿ",
    readAloud: "ಕೇಳಿ",
    stopRead: "ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ",
  },
  or: {
    findSchemes: "ଯୋଜନା ଖୋଜନ୍ତୁ",
    aiChat: "AI ଚାଟ୍",
    heroTitle: "ଆପଣ ପ୍ରକୃତରେ ଯୋଗ୍ୟ ଥିବା ସରକାରୀ ଯୋଜନାଗୁଡିକ ଖୋଜନ୍ତು",
    heroSubtitle: "କିଛି ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତু, ସଙ୍ଗେ ସଙ୍ଗେ ଯୋଗ୍ୟ ଯୋଜନା ଦେଖନ୍ତୁ ଏବଂ ସରକାରଜିପିଟିକୁ ପଚାରନ୍ତୁ।",
    findMySchemesBtn: "ମୋ ଯୋଜନା ଖୋଜନ୍ତୁ",
    askSarkarGptBtn: "ସରକାରଜିପିଟିକୁ ପଚାରନ୍ତୁ",
    quickPreview: "ଶୀଘ୍ର ପୂର୍ବାବଲୋକନ",
    categoriesCovered: "ଏହି ପ୍ରୋଟୋଟାଇପ୍‌ରେ ଥିବା ବିଭାଗ",
    featuresTitle: "କାହିଁକି ସରକାରଜିପିଟି?",
    howItWorks: "ଏହା କିପରି କାମ କରେ",
    basics: "ମୌଳିକ ସୂଚନା",
    workIncome: "କାର୍ଯ್ಯ ଏବଂ ଆୟ",
    specialCategories: "ବିଶେଷ ବିଭାଗ",
    state: "ରାଜ୍ୟ",
    selectState: "ରାଜ୍ୟ ଚୟନ କରନ୍ତୁ",
    age: "ବୟସ",
    gender: "ଲିଙ୍ଗ",
    male: "ପୁରୁଷ",
    female: "ମହିଳା",
    other: "ଅନ୍ୟାନ୍ୟ",
    occupation: "ପେଶା",
    selectOccupation: "ପେଶା ଚୟନ କରନ୍ତು",
    farmer: "ਚାଷୀ",
    student: "ଛାତ୍ର",
    salaried: "ଚାକିରିଆ",
    selfEmployed: "ସ୍ୱ-ନିଯୁକ୍ତ",
    unemployed: "ବେକାର",
    incomeLabel: "ବାର୍ଷିକ ପାରିବାରିକ ଆୟ (₹)",
    studentCheck: "ଛാତ୍ର",
    farmerCheck: "ਚାଷୀ",
    startupCheck: "ଷ୍ଟାର୍ଟଅପ୍ ପ୍ରତିଷ୍ଠାତା",
    msmeCheck: "MSME ମାଲିକ",
    womanCheck: "ମହିଳା ଉଦ୍ୟୋଗୀ",
    disabilityCheck: "ଭିନ୍ନକ୍ଷମ ବ୍ୟକ୍ତି",
    seniorCheck: "ବରିଷ୍ଠ ନାଗରିକ",
    backBtn: "ପଛକୁ",
    nextBtn: "ଆଗକୁ",
    seeSchemesBtn: "ମୋ ଯୋଜନା ଦେଖନ୍ତୁ",
    editProfile: "ପ୍ରୋଫାଇଲ୍ ସଂଶୋଧନ",
    matchedText: "ଯୋଜନା ମିଳିଲା",
    noMatches: "ଏହି ଡେମୋ କାଟାଲଗ୍‌ରେ କୌଣସି ଯੋଜନା ମିଳିଲା ନାହିଁ — ପ୍ରୋଫାଇଲ୍ ବଦଳାନ୍ତୁ କିମ୍ବା ଚାଟ୍‌ରେ ପଚାରନ୍ତୁ।",
    benefits: "ଲାଭ",
    docsNeeded: "ଆବଶ୍ୟକୀୟ ଦଲିଲ୍",
    applyBtn: "ଆବେଦନ କରନ୍ତୁ",
    learnMore: "ଅଧିକ ଜାଣନ୍ତୁ",
    hideDetails: "ତଥ୍ୟ ଲୁଚାନ୍ତୁ",
    listenDetails: "ତଥ୍ୟ ଶୁଣନ୍ତୁ",
    stopListening: "ବନ୍ଦ କରନ୍ତು",
    speakBtn: "କହିକି ପଚାରନ୍ତୁ",
    chatHeader: "ସରକାରଜିପିଟି ଚାଟ୍",
    clearBtn: "ସଫା କରନ୍ତု",
    chatPlaceholder: "ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତು...",
    suggestedTitle: "ସରଳ ଭାଷାରେ ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତು।",
    listening: "ଶୁଣୁଛି... ଏବେ କୁହନ୍ତು",
    docGuideTitle: "ଦଲିଲ୍ ମାର୍ଗଦର୍ଶିକା",
    docWhat: "ଏହା କଣ?",
    docHow: "ଏହା କେମିତି ମିଳିବ?",
    docTime: "ପ୍ରକ୍ରିୟାକରଣ ସମୟ",
    docFees: "ଫି ଏବଂ ଦେୟ",
    docOnlineLink: "ଅନଲାଇନ୍ ଆବେଦନ",
    readAloud: "ଶୁଣନ୍ତୁ",
    stopRead: "ଅଡିଓ ବନ୍ଦ କରନ୍ତು",
  },
  ml: {
    findSchemes: "പദ്ധതികൾ കണ്ടെത്തുക",
    aiChat: "AI ചാറ്റ്",
    heroTitle: "നിങ്ങൾക്ക് അർഹതയുള്ള സർക്കാർ പദ്ധതികൾ കണ്ടെത്തുക",
    heroSubtitle: "ചില ചോദ്യങ്ങൾക്ക് മറുപടി നൽകൂ, അനുയോജ്യമായ പദ്ധതികൾ ഉടൻ കാണൂ, സംശയങ്ങൾ സർക്കാർജിപിറ്റിയോട് ചോദിക്കൂ.",
    findMySchemesBtn: "എന്റെ പദ്ധതികൾ കണ്ടെത്തുക",
    askSarkarGptBtn: "സർക്കാർജിപിറ്റിയോട് ചോദിക്കുക",
    quickPreview: "ദ്രുത പ്രിവ്യൂ",
    categoriesCovered: "ഈ പ്രോട്ടോടൈപ്പിലുള്ള വിഭാഗങ്ങൾ",
    featuresTitle: "എന്തുകൊണ്ട് സർക്കാർജിപിറ്റി?",
    howItWorks: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    basics: "അടിസ്ഥാന വിവരങ്ങൾ",
    workIncome: "തൊഴിലും വരുമാനവും",
    specialCategories: "പ്രത്യേക വിഭാഗങ്ങൾ",
    state: "സംസ്ഥാനം",
    selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    age: "പ്രായം",
    gender: "ലിംഗം",
    male: "പുരുഷൻ",
    female: "സ്ത്രീ",
    other: "മറ്റുള്ളവ",
    occupation: "തൊഴിൽ",
    selectOccupation: "തൊഴിൽ തിരഞ്ഞെടുക്കുക",
    farmer: "കർഷകൻ",
    student: "വിദ്യാർത്ഥി",
    salaried: "ശമ്പളക്കാരൻ",
    selfEmployed: "സ്വയം തൊഴിൽ",
    unemployed: "തൊഴിലില്ലാത്തയാൾ",
    incomeLabel: "വാർഷിക കുടുംബ വരുമാനം (₹)",
    studentCheck: "വിദ്യാർത്ഥി",
    farmerCheck: "കർഷകൻ",
    startupCheck: "സ്റ്റാർട്ടപ്പ് സംരംഭകൻ",
    msmeCheck: "MSME ഉടമ",
    womanCheck: "വനിതാ സംരംഭക",
    disabilityCheck: "ഭിന്നശേഷിക്കാരൻ",
    seniorCheck: "മുതിർന്ന പൗരൻ",
    backBtn: "പുറകോട്ട്",
    nextBtn: "അടുത്തത്",
    seeSchemesBtn: "എന്റെ പദ്ധതികൾ കാണുക",
    editProfile: "വിവരങ്ങൾ തിരുത്തുക",
    matchedText: "പദ്ധതികൾ കണ്ടെത്തി",
    noMatches: "ഈ പ്രോട്ടോടൈപ്പ് കാറ്റലോഗിൽ അനുയോജ്യമായ പദ്ധതികളില്ല — പ്രൊഫൈൽ മാറ്റുകയോ ചാറ്റിൽ ചോദിക്കുകയോ ചെയ്യുക.",
    benefits: "ആനുകൂല്യങ്ങൾ",
    docsNeeded: "ആവശ്യമായ രേഖകൾ",
    applyBtn: "അപേക്ഷിക്കുക",
    learnMore: "കൂടുതലറിയാൻ",
    hideDetails: "വിവരങ്ങൾ മറയ്ക്കുക",
    listenDetails: "വിവരങ്ങൾ കേൾക്കുക",
    stopListening: "നിർത്തുക",
    speakBtn: "സംസാരിച്ചു ചോദിക്കുക",
    chatHeader: "സർക്കാർജിപിറ്റി ചാറ്റ്",
    clearBtn: "വ്യത്തിയാക്കുക",
    chatPlaceholder: "പദ്ധതികളെക്കുറിച്ച് ചോദിക്കൂ...",
    suggestedTitle: "ലളിതമായ ഭാഷയിൽ പദ്ധതികളെക്കുറിച്ച് ചോദിക്കുക.",
    listening: "ശ്രദ്ധിക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
    docGuideTitle: "രേഖാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
    docWhat: "ഇത് എന്താണ്?",
    docHow: "ഇത് എങ്ങനെ ലഭിക്കും?",
    docTime: "പ്രോസസ്സിംഗ് സമയം",
    docFees: "ഫീസും ചാർജുകളും",
    docOnlineLink: "ഓൺലൈനായി അപേക്ഷിക്കുക",
    readAloud: "കേൾക്കുക",
    stopRead: "ഓഡിയോ നിർത്തുക",
  },
  pa: {
    findSchemes: "ਯੋਜਨਾਵਾਂ ਲੱਭੋ",
    aiChat: "AI ਚੈਟ",
    heroTitle: "ਉਹ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਲੱਭੋ ਜਿਨ੍ਹਾਂ ਲਈ ਤੁਸੀਂ ਯੋਗ ਹੋ",
    heroSubtitle: "ਕੁਝ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ, ਤੁਰੰਤ ਯੋਗ ਯੋਜਨਾਵਾਂ ਦੇਖੋ, ਅਤੇ ਸਰਕਾਰਜੀਪੀਟੀ ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
    findMySchemesBtn: "ਮੇਰੀਆਂ ਯੋਜਨਾਵਾਂ ਲੱਭੋ",
    askSarkarGptBtn: "ਸਰਕਾਰਜੀਪੀਟੀ ਨੂੰ ਪੁੱਛੋ",
    quickPreview: "ਤੁਰੰਤ ਝਲਕ",
    categoriesCovered: "ਇਸ ਪ੍ਰੋਟੋਟਾਈਪ ਵਿੱਚ ਸ਼ਾਮਲ ਸ਼੍ਰੇਣੀਆਂ",
    featuresTitle: "ਸਰਕਾਰਜੀਪੀਟੀ ਕਿਉਂ?",
    howItWorks: "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    basics: "ਬੁਨਿਆਦੀ ਜਾਣਕਾਰੀ",
    workIncome: "ਕੰਮ ਅਤੇ ਆਮਦਨ",
    specialCategories: "ਵਿਸ਼ੇਸ਼ ਸ਼੍ਰੇਣੀਆਂ",
    state: "ਰਾਜ",
    selectState: "ਰਾਜ ਚੁਣੋ",
    age: "ਉਮਰ",
    gender: "ਲਿੰਗ",
    male: "ਮਰਦ",
    female: "ਔਰਤ",
    other: "ਹੋਰ",
    occupation: "ਕਿੱਤਾ",
    selectOccupation: "ਕਿੱਤਾ ਚੁਣੋ",
    farmer: "ਕਿਸਾਨ",
    student: "ਵਿਦਿਆਰਥੀ",
    salaried: "ਨੌਕਰੀਪੇਸ਼ਾ",
    selfEmployed: "ਸਵੈ-ਰੁਜ਼ਗਾਰ",
    unemployed: "ਬੇਰੁਜ਼ਗਾਰ",
    incomeLabel: "ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ (₹)",
    studentCheck: "ਵਿਦਿਆਰਥੀ",
    farmerCheck: "ਕਿਸਾਨ",
    startupCheck: "ਸਟਾਰਟਅਪ ਸੰਸਥਾਪਕ",
    msmeCheck: "MSME ਮਾਲਕ",
    womanCheck: "ਮਹਿਲਾ ਉਦਮੀ",
    disabilityCheck: "ਦਿਵਿਆਂਗ ਵਿਅਕਤੀ",
    seniorCheck: "ਬਜ਼ੁਰਗ ਨਾਗਰਿਕ",
    backBtn: "ਪਿੱਛੇ",
    nextBtn: "ਅੱਗੇ",
    seeSchemesBtn: "ਮੇਰੀਆਂ ਯੋਜਨਾਵਾਂ ਦੇਖੋ",
    editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
    matchedText: "ਯੋਜਨਾਵਾਂ ਮਿਲੀਆਂ",
    noMatches: "ਇਸ ਪ੍ਰੋਟੋਟਾਈਪ ਦੇ ਡੈਮੋ ਕੈਟਾਲਾਗ ਵਿੱਚ ਕੋਈ ਮੇਲ ਨਹੀਂ ਮਿਲਿਆ — ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਬਦਲੋ ਜਾਂ ਸਿੱਧਾ ਚੈਟ ਵਿੱਚ ਪੁੱਛੋ।",
    benefits: "ਲਾਭ",
    docsNeeded: "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼",
    applyBtn: "ਅਪਲਾਈ ਕਰੋ",
    learnMore: "ਹੋਰ ਜਾਣੋ",
    hideDetails: "ਵੇਰਵਾ ਛੁਪਾਓ",
    listenDetails: "ਵੇਰਵਾ ਸੁਣੋ",
    stopListening: "ਰੋਕੋ",
    speakBtn: "ਬੋਲ ਕੇ ਪੁੱਛੋ",
    chatHeader: "ਸਰਕਾਰਜੀਪੀਟੀ ਚੈਟ",
    clearBtn: "ਸਾਫ਼ ਕਰੋ",
    chatPlaceholder: "ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛੋ...",
    suggestedTitle: "ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
    listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਹੁਣ ਬੋਲੋ",
    docGuideTitle: "ਦਸਤਾਵੇਜ਼ ਮਾਰਗਦਰਸ਼ਕ",
    docWhat: "ਇਹ ਕੀ ਹੈ?",
    docHow: "ਇਹ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ?",
    docTime: "ਪ੍ਰੋਸੈਸਿੰਗ ਦਾ ਸਮਾਂ",
    docFees: "ਫੀਸਾਂ ਅਤੇ ਖਰਚੇ",
    docOnlineLink: "ਔਨਲਾਈਨ ਅਪਲਾਈ ਕਰੋ",
    readAloud: "ਸੁਣੋ",
    stopRead: "ਆਡੀਓ ਰੋਕੋ",
  },
  as: {
    findSchemes: "আঁচনিসমূহ বিচাৰক",
    aiChat: "AI চ্যট",
    heroTitle: "আপুনি প্ৰকৃততে যোগ্য চৰকাৰী আঁচনিসমূহ বিচাৰি উলিয়াওক",
    heroSubtitle: "কেইটামান প্ৰশ্নৰ উত্তৰ দিয়ক, লগে লগে যোগ্যতা থকা আঁচনিসমূহ দেখক আৰু চৰকাৰজীপিটিক সোধক।",
    findMySchemesBtn: "মোৰ আঁচনি বিচাৰক",
    askSarkarGptBtn: "চৰকাৰজীপিটিক সোধক",
    quickPreview: "আভাস",
    categoriesCovered: "এই প্রোটোটাইপত থকা বিভাগসমূহ",
    featuresTitle: "চৰকাৰজীপিটি কিয়?",
    howItWorks: "এইটো কেনেকৈ কাম কৰে",
    basics: "প্ৰাথমিক তথ্য",
    workIncome: "কাম আৰু উপাৰ্জন",
    specialCategories: "বিশেষ শ্ৰেণীসমূহ",
    state: "ৰাজ্য",
    selectState: "ৰাজ্য বাছনি কৰক",
    age: "বয়স",
    gender: "লিংগ",
    male: "পুৰুষ",
    female: "মহিলা",
    other: "অন্যান্য",
    occupation: "পেশা",
    selectOccupation: "পেশা বাছনি কৰক",
    farmer: "কৃষক",
    student: "ছাত্ৰ",
    salaried: "চাকৰিয়াল",
    selfEmployed: "স্বনিযুক্ত",
    unemployed: "বেকাৰ",
    incomeLabel: "বাৰ্ষিক পাৰিবাৰিক উপাৰ্জন (₹)",
    studentCheck: "ছাত্ৰ",
    farmerCheck: "কৃষক",
    startupCheck: "ষ্টাৰ্টআপ প্ৰতিষ্ঠাপক",
    msmeCheck: "MSME মালিক",
    womanCheck: "মহিলা উদ্যমী",
    disabilityCheck: "বিশেষভাৱে সক্ষম ব্যক্তি",
    seniorCheck: "জ্যেষ্ঠ নাগৰিক",
    backBtn: "পিছলক",
    nextBtn: "আগলক",
    seeSchemesBtn: "মোৰ আঁচনিসমূহ চাওক",
    editProfile: "প্ৰফাইল সম্পাদনা কৰক",
    matchedText: "আঁচনি মিলিছে",
    noMatches: "কোনো আঁচনি পোৱা নগ’ল — প্ৰফাইল সলনি কৰি চেষ্টা কৰক নতুবা চাটত সোধক।",
    benefits: "সুবিধাসমূহ",
    docsNeeded: "প্ৰয়োজনীয় নথিপত্ৰ",
    applyBtn: "আবেদন কৰক",
    learnMore: "অধিক জানক",
    hideDetails: "তথ্য লুকুৱাওক",
    listenDetails: "তথ্য শুনক",
    stopListening: "বন্ধ কৰক",
    speakBtn: "কৈ সোধক",
    chatHeader: "চৰকাৰজীপিটি চাট",
    clearBtn: "মচি পেলাওক",
    chatPlaceholder: "আঁচনিৰ বিষয়ে সোধক...",
    suggestedTitle: "সহজ ভাষাত আঁচনিৰ বিষয়ে সোধক।",
    listening: "শুনি আছোঁ... এতিয়া কওক",
    docGuideTitle: "নথিপত্রৰ নিৰ্দেশিকা",
    docWhat: "এইটো কি?",
    docHow: "এইটো কেনেকৈ পাব?",
    docTime: "প্ৰক্ৰিয়াকৰণ সময়",
    docFees: "মাচুল",
    docOnlineLink: "অনলাইন আবেদন কৰক",
    readAloud: "শুনক",
    stopRead: "বন্ধ কৰক",
  },
  mai: {
    findSchemes: "योजना सभ खोजू",
    aiChat: "एआई चैट",
    heroTitle: "ओइ सरकारी योजना सभ कें खोजू जाहि लेल अहां वास्तव मे पात्र छी",
    heroSubtitle: "किछु प्रश्नक उत्तर दिय, तुरंत योजनाक मिलान करू, आ पात्रता वा आवेदन करबाक तरीकाक बारे मे सरकारजीपीटी सँ पूछू।",
    findMySchemesBtn: "हमर योजना खोजू",
    askSarkarGptBtn: "सरकारजीपीटी सँ पूछू",
    quickPreview: "त्वरित पूर्वावलोकन",
    categoriesCovered: "एहि प्रोटोटाइप मे शामिल श्रेणी सभ",
    featuresTitle: "सरकारजीपीटी किएक?",
    howItWorks: "ई कोना काज करैत अछि",
    basics: "बुनियादी जानकारी",
    workIncome: "काज आ आय",
    specialCategories: "विशेष श्रेणी सभ",
    state: "राज्य",
    selectState: "राज्य चुनू",
    age: "उम्र",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "आन",
    occupation: "पेशा",
    selectOccupation: "पेशा चुनू",
    farmer: "किसान",
    student: "विद्यार्थी",
    salaried: "नौकरीपेशा",
    selfEmployed: "स्वरोजगार",
    unemployed: "बेरोजगार",
    incomeLabel: "वार्षिक पारिवारिक आय (₹)",
    studentCheck: "विद्यार्थी",
    farmerCheck: "किसान",
    startupCheck: "स्टार्टअप संस्थापक",
    msmeCheck: "एमएसएमई मालिक",
    womanCheck: "महिला उद्यमी",
    disabilityCheck: "दिव्यांग व्यक्ति",
    seniorCheck: "वरिष्ठ नागरिक",
    backBtn: "पाछा",
    nextBtn: "आगा",
    seeSchemesBtn: "हमर योजना सभ देखू",
    editProfile: "प्रोफ़ाइल संपादित करू",
    matchedText: "योजना सभ भेटल",
    noMatches: "एहि प्रोटोटाइप मे कोनो मेल नै भेटल — अपन प्रोफ़ाइल सुधारू वा सीधे चैट मे पूछू।",
    benefits: "लाभ",
    docsNeeded: "आवश्यक दस्तावेज़ सभ",
    applyBtn: "आवेदन करू",
    learnMore: "विस्तार सँ जानू",
    hideDetails: "विवरण नुकाउ",
    listenDetails: "विवरण सुनू",
    stopListening: "रोकूं",
    speakBtn: "बजल क' पूछू",
    chatHeader: "सरकारजीपीटी चैट",
    clearBtn: "साफ करू",
    chatPlaceholder: "कोनो योजनाक बारे मे पूछू...",
    suggestedTitle: "सोझ भाषा मे योजना सभक बारे मे पूछू।",
    listening: "सुनि रहल छी... आब बाजू",
    docGuideTitle: "दस्तावेज़ गाइड",
    docWhat: "ई की अछि?",
    docHow: "ई कोना भेटत?",
    docTime: "प्रसंस्करण समय",
    docFees: "शुल्क आ प्रभार",
    docOnlineLink: "ऑनलाइन आवेदन करू",
    readAloud: "सुनू",
    stopRead: "बंद करू",
  },
  kok: {
    findSchemes: "योजना सोदात",
    aiChat: "एआय चॅट",
    heroTitle: "तुमकां खरोच लागू जावपी सरकारी योजना सोदून काढात",
    heroSubtitle: "थोड्या प्रस्नांचे जाप dयात, रोखडेच योग्य योजना पळयात, आनी सरकारजीपीटी कडेन कसलीय माहिती विचारात.",
    findMySchemesBtn: "मज्यो योजना सोदात",
    askSarkarGptBtn: "सरकारजीपीटीक विचारात",
    quickPreview: "थोडक्यात पळोवणी",
    categoriesCovered: "ह्या प्रोटोटाइपांत आस्पावपी वर्ग",
    featuresTitle: "सरकारजीपीटी कित्याक?",
    howItWorks: "हें कशें काम करता",
    basics: "बुनियादी माहिती",
    workIncome: "काम आनी उत्पन्न",
    specialCategories: "विशेश वर्ग",
    state: "राज्य",
    selectState: "राज्य वेंचून काढात",
    age: "पिराय",
    gender: "लिंग",
    male: "दादलो",
    female: "बायलमनीस",
    other: "इतर",
    occupation: "धंदो",
    selectOccupation: "धंदो वेंचून काढात",
    farmer: "शेतकार",
    student: "विद्यार्थी",
    salaried: "नोकरेदार",
    selfEmployed: "स्वयंरोजगारी",
    unemployed: "बेकारी",
    incomeLabel: "वर्सुकी उत्पन्न (₹)",
    studentCheck: "विद्यार्थी",
    farmerCheck: "शेतकार",
    startupCheck: "स्टार्टअप संस्थापक",
    msmeCheck: "एमएसएमई धनी",
    womanCheck: "बायलां उद्योजक",
    disabilityCheck: "अपंग व्यक्ती",
    seniorCheck: "ज्येश्ठ नागरीक",
    backBtn: "फाटीं",
    nextBtn: "मुखार",
    seeSchemesBtn: "मज्यो योजना पळयात",
    editProfile: "माहिती बदलात",
    matchedText: "योजना मेळ्ळ्यो",
    noMatches: "ह्या डेमॉ कॅटलॉगांत कसलीच योजना लागू जायना — तुमची माहिती बदलात वा थेट चॅटांत विचारात.",
    benefits: "फायदे",
    docsNeeded: "लागपी कागदपत्रां",
    applyBtn: "अर्ज करात",
    learnMore: "अदीक जाणून घ्यात",
    hideDetails: "माहिती लिपयात",
    listenDetails: "माहिती आयकात",
    stopListening: "थापयात",
    speakBtn: "उलpathून विचारात",
    chatHeader: "सरकारजीपीटी चॅट",
    clearBtn: "नितळ करात",
    chatPlaceholder: "योजने विशीं विचारात...",
    suggestedTitle: "साद्या भाशेंत योजनां विशीं विचारात.",
    listening: "आयकता... आतां उल्यात",
    docGuideTitle: "कागदपत्र मार्गदर्शक",
    docWhat: "हें कितें?",
    docHow: "हें कशें मेळोवचें?",
    docTime: "लागपी वेळ",
    docFees: "खर्च आनी फी",
    docOnlineLink: "ऑनलायन अर्ज करात",
    readAloud: "आयकात",
    stopRead: "ऑडिओ बंद करात",
  },
};

const isIndianVoice = (v: SpeechSynthesisVoice) => {
  const langLower = v.lang.toLowerCase();
  const nameLower = v.name.toLowerCase();
  return (
    langLower.includes("-in") ||
    nameLower.includes("india") ||
    nameLower.includes("neerja") ||
    nameLower.includes("prabhat") ||
    nameLower.includes("ravi") ||
    nameLower.includes("heera") ||
    nameLower.includes("swara") ||
    nameLower.includes("madhur") ||
    nameLower.includes("hemant") ||
    nameLower.includes("हिन्दी") ||
    nameLower.includes("kavita") ||
    nameLower.includes("sangeeta") ||
    nameLower.includes("shruti")
  );
};

export function configureSpeechUtterance(
  utterance: SpeechSynthesisUtterance,
  gender: "male" | "female",
  selectedVoiceName?: string
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  const lang = utterance.lang;

  // Filter voices that match the language prefix and are Indian voices
  const langVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(lang.toLowerCase().split("-")[0]) && isIndianVoice(v)
  );

  let selectedVoice = null;

  // If user selected a specific voice, attempt to use it
  if (selectedVoiceName) {
    selectedVoice = voices.find((v) => v.name === selectedVoiceName);
  }

  // Fallback to automatic neural scoring if no voice selected or selected voice not found
  if (!selectedVoice) {
    // Smart scoring system — heavily prioritizes Natural/Neural Indian voices
    // for a soft, warm, humanized speaking experience
    const getVoiceScore = (voice: SpeechSynthesisVoice, targetGender: "male" | "female") => {
      const name = voice.name.toLowerCase();
      let score = 0;

      // ──────────────────────────────────────────────────────────
      // TIER 1: Natural / Neural voices (sound genuinely human)
      // These are Microsoft Edge/Chrome's premium voices and should
      // ALWAYS be selected over offline robotic synthesizers.
      // ──────────────────────────────────────────────────────────
      const isNatural = name.includes("natural") || name.includes("neural");
      if (isNatural) {
        score += 200; // Massive priority — these sound like real Indian people
      }

      // ──────────────────────────────────────────────────────────
      // TIER 2: Specific Indian voice name matches
      // ──────────────────────────────────────────────────────────
      if (targetGender === "female") {
        // Premium Indian female voices (warm, soft, nurturing tone)
        if (name.includes("neerja"))    score += 150; // Microsoft Neerja — best quality
        if (name.includes("swara"))     score += 140;
        if (name.includes("kavita"))    score += 130;
        if (name.includes("sangeeta"))  score += 120;
        if (name.includes("shruti"))    score += 110;
        if (name.includes("heera"))     score += 100;
        if (name.includes("ananya"))    score += 100;
        if (name.includes("priya"))     score += 100;
      } else {
        // Premium Indian male voices
        if (name.includes("ravi"))      score += 150; // Microsoft Ravi — best quality
        if (name.includes("prabhat"))   score += 130;
        if (name.includes("madhur"))    score += 120;
        if (name.includes("hemant"))    score += 110;
      }

      // ──────────────────────────────────────────────────────────
      // TIER 3: Gender match indicators
      // ──────────────────────────────────────────────────────────
      if (targetGender === "female") {
        if (name.includes("female") || name.includes("woman")) score += 15;
      } else {
        if (name.includes("male") && !name.includes("female")) score += 15;
      }

      // ──────────────────────────────────────────────────────────
      // TIER 4: Cloud/Online voices (better than offline but not as good as Natural)
      // ──────────────────────────────────────────────────────────
      if (!isNatural) {
        if (name.includes("online") || name.includes("cloud") || name.includes("google")) {
          score += 25;
        }
      }

      // Penalize desktop/offline robotic voices
      if (name.includes("desktop") || name.includes("compact") || name.includes("espeak")) {
        score -= 50;
      }

      return score;
    };

    if (langVoices.length > 0) {
      // Sort descending by score — Natural Indian voices always come first
      langVoices.sort((a, b) => getVoiceScore(b, gender) - getVoiceScore(a, gender));
      selectedVoice = langVoices[0];
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else if (langVoices.length > 0) {
    utterance.voice = langVoices[0];
  }

  // ──────────────────────────────────────────────────────────
  // Voice tuning for soft, warm, humanized Indian delivery
  // ──────────────────────────────────────────────────────────
  const selectedName = selectedVoice ? selectedVoice.name.toLowerCase() : "";
  const isNatural = selectedName.includes("natural") || selectedName.includes("neural");
  const isOnline = selectedName.includes("online") || selectedName.includes("cloud") || selectedName.includes("google");

  if (isNatural) {
    // Natural voices already sound human — subtle tuning only
    utterance.pitch = gender === "female" ? 1.05 : 0.95;  // Slightly warm
    utterance.rate = 0.88;   // Slow, deliberate, caring pace
    utterance.volume = 0.92; // Slightly soft — feels intimate, not aggressive
  } else if (isOnline) {
    // Online voices — moderate tuning
    utterance.pitch = gender === "female" ? 1.08 : 0.9;
    utterance.rate = 0.85;   // Slower for warmth
    utterance.volume = 0.9;
  } else {
    // Offline robotic voices — maximum tuning to reduce harshness
    utterance.pitch = gender === "female" ? 1.12 : 0.82;
    utterance.rate = 0.8;    // Slow enough to sound deliberate, not rushed
    utterance.volume = 0.85; // Softer output to mask synthesis artifacts
  }
}

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  currentSpeechLang: string;
  voiceGender: "male" | "female";
  setVoiceGender: (gender: "male" | "female") => void;
  selectedVoiceName: string;
  setSelectedVoiceName: (name: string) => void;
  availableVoices: SpeechSynthesisVoice[];
  fontSize: "normal" | "large" | "xl";
  setFontSize: (size: "normal" | "large" | "xl") => void;
  autoPlaySpeech: boolean;
  setAutoPlaySpeech: (val: boolean) => void;
  soundEffects: boolean;
  setSoundEffects: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [voiceGender, setVoiceGenderState] = useState<"male" | "female">("female");
  const [selectedVoiceName, setSelectedVoiceNameState] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [fontSize, setFontSizeState] = useState<"normal" | "large" | "xl">("normal");
  const [autoPlaySpeech, setAutoPlaySpeechState] = useState<boolean>(false);
  const [soundEffects, setSoundEffectsState] = useState<boolean>(true);

  // Function to load system voices
  const loadVoices = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const allVoices = window.speechSynthesis.getVoices();
      const indianOnly = allVoices.filter(isIndianVoice);
      setAvailableVoices(indianOnly);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("sarkargpt_lang") as LanguageCode;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
    const savedGender = localStorage.getItem("sarkargpt_voice_gender") as "male" | "female";
    if (savedGender === "male" || savedGender === "female") {
      setVoiceGenderState(savedGender);
    }
    const savedVoice = localStorage.getItem("sarkargpt_selected_voice_name");
    if (savedVoice) {
      setSelectedVoiceNameState(savedVoice);
    }
    const savedFontSize = localStorage.getItem("sarkargpt_font_size") as "normal" | "large" | "xl";
    if (savedFontSize === "normal" || savedFontSize === "large" || savedFontSize === "xl") {
      setFontSizeState(savedFontSize);
    }
    const savedAutoplay = localStorage.getItem("sarkargpt_autoplay");
    if (savedAutoplay !== null) {
      setAutoPlaySpeechState(savedAutoplay === "true");
    }
    const savedSounds = localStorage.getItem("sarkargpt_sounds");
    if (savedSounds !== null) {
      setSoundEffectsState(savedSounds === "true");
    }
    
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Update root typography scaling class when fontSize changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("font-normal", "font-large", "font-xl");
      document.documentElement.classList.add(`font-${fontSize}`);
    }
  }, [fontSize]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("sarkargpt_lang", lang);
  };

  const setVoiceGender = (gender: "male" | "female") => {
    setVoiceGenderState(gender);
    localStorage.setItem("sarkargpt_voice_gender", gender);
  };

  const setSelectedVoiceName = (name: string) => {
    setSelectedVoiceNameState(name);
    localStorage.setItem("sarkargpt_selected_voice_name", name);
  };

  const setFontSize = (size: "normal" | "large" | "xl") => {
    setFontSizeState(size);
    localStorage.setItem("sarkargpt_font_size", size);
  };

  const setAutoPlaySpeech = (val: boolean) => {
    setAutoPlaySpeechState(val);
    localStorage.setItem("sarkargpt_autoplay", val.toString());
  };

  const setSoundEffects = (val: boolean) => {
    setSoundEffectsState(val);
    localStorage.setItem("sarkargpt_sounds", val.toString());
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  };

  const currentSpeechLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language)?.speechLang || "en-US";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentSpeechLang,
        voiceGender,
        setVoiceGender,
        selectedVoiceName,
        setSelectedVoiceName,
        availableVoices,
        fontSize,
        setFontSize,
        autoPlaySpeech,
        setAutoPlaySpeech,
        soundEffects,
        setSoundEffects,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
