import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Language = "en" | "hi" | "te"

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, variables?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar & Common
    home: "Home",
    updates: "Updates",
    jobs: "Jobs",
    schemes: "Schemes",
    echs: "ECHS",
    pension: "Pension",
    helplines: "Helplines",
    about: "About",
    signIn: "Sign in",
    signOut: "Sign out",
    profile: "Profile",
    admin: "Admin",
    adminConsole: "Admin Console",
    backToSite: "Back to site",
    viewAll: "View all",
    loading: "Loading latest data...",
    error: "Error loading data",
    save: "Save",
    saved: "Saved",
    search: "Search",
    all: "All",
    officialDisclaimer: "Official notices and documents are presented in their original publication language (English).",

    // Landing Page
    heroTitle: "Veer Connect",
    heroSubtitle: "Automated Ex-Servicemen Information Portal",
    heroTagline: "Real-time updates, job placements, welfare schemes, pension guidance, and AI support for veterans and their families.",
    searchPlaceholder: "Search updates, jobs, schemes...",
    statsSources: "Official Sources",
    statsJobs: "Active Placements",
    statsSchemes: "Welfare Schemes",
    statsUpdates: "Recent Updates",
    syncAlert: "New updates found! Click to sync in real-time.",
    latestContent: "Latest Content",
    filterAll: "All",
    filterUpdates: "Updates",
    filterJobs: "Jobs",
    filterSchemes: "Schemes",
    readMore: "Read more",
    noResults: "No results found matching your search.",
    loadMore: "Load more",

    // Dashboard Page
    dashboardTitle: "Your Dashboard",
    dashboardSubtitle: "Latest notifications, jobs and schemes — refreshed daily from official sources.",
    trendingUpdates: "Trending updates",
    latestAnnouncements: "Recent announcements",
    recommendedForYou: "Recommended for you",
    recSavedText: "Based on what you've saved, you might also want to check the latest pension and medical updates —",
    recEmptyText: "Save a few jobs or schemes (tap the bookmark icon) and recommendations will appear here based on what matters to you. Or just ask",
    veerAssistantDirect: "Veer Assistant directly.",

    // ECHS Page
    echsTitle: "ECHS Polyclinics & Healthcare",
    echsSubtitle: "Access ECHS smart card application guidelines, polyclinic directories, and empanelled hospital procedures.",
    echsCardTitle: "Apply for 64KB Smart Card",
    echsCardDesc: "Ex-servicemen can apply online for the ECHS 64KB Smart Card to access cashless medical treatments across India.",
    echsPortalBtn: "ECHS Smart Card Portal",
    echsSearchPlaceholder: "Search polyclinic directories...",
    echsStatusActive: "Active",
    echsSearchLabel: "Polyclinic Location Finder",

    // Pension Page
    pensionTitle: "Pension Status Tracker (SPARSH)",
    pensionSubtitle: "Check your pension migration status, PCDA circulars, and learn how to complete SPARSH identification.",
    pensionCardTitle: "SPARSH Pension Status Check",
    pensionInputPlaceholder: "Enter SPARSH PPO / Service Number",
    pensionCheckBtn: "Check Status",
    pensionMockResultTitle: "Status Query Result",
    pensionMockActive: "Pension Migrated & Active",
    pensionMockPending: "Migration Pending - Please wait for sms notification from PCDA.",
    pensionIdentifyTitle: "How to complete annual identification",
    pensionStep1: "1. Log in to SPARSH portal using your PPO number.",
    pensionStep2: "2. Navigate to 'Identification' section and select 'Aadhaar' or 'DLC'.",
    pensionStep3: "3. Complete biometric verification or submit digitial life certificate via Jeevan Pramaan app.",

    // Helplines Page
    helplinesTitle: "Official Helplines & Sainik Boards",
    helplinesSubtitle: "Direct emergency contacts, support desk numbers, and coordinates for Sainik Boards across India.",
    helplinesEmerTitle: "Emergency Helpline Numbers",
    helplinesDirectEmer: "Emergency Contacts",
    helplinesStateBoards: "Rajya & Zila Sainik Boards",

    // About Page
    aboutTitle: "About Veer Connect",
    aboutSubtitle: "An automated public information portal making official welfare resources accessible to ex-servicemen, veterans, and their families.",
    aboutMissionTitle: "Our Mission",
    aboutMissionDesc: "To build a transparent, automated gateway that compiles critical information from scattered official websites (ECHS, DGR, KSB, SPARSH) and delivers it in one easy-to-use platform.",
    aboutSourceTitle: "Data Orchestration",
    aboutSourceDesc: "Our automated scraper scans official directories and press bulletins every day to push the latest notifications, jobs, and welfare benefits directly to this public portal.",
    aboutFaqTitle: "Frequently Asked Questions",

    // AI Assistant Page
    aiTitle: "Veer AI Assistant",
    aiSubtitle: "Ask questions about welfare schemes, job eligibility, pension calculations, and polyclinic benefits.",
    aiInputPlaceholder: "Ask Veer Assistant anything (e.g., 'What are the schemes for daughter marriage?')...",
    aiDefaultResponse: "Hello! I am your Veer Assistant. I can help guide you through welfare schemes, ECHS rules, and DGR jobs. Ask me a question!",
  },
  hi: {
    // Navbar & Common
    home: "मुख्य पृष्ठ",
    updates: "अपडेट्स",
    jobs: "नौकरियां",
    schemes: "योजनाएं",
    echs: "ईसीएचएस",
    pension: "पेंशन",
    helplines: "हेल्पलाइन",
    about: "हमारे बारे में",
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    profile: "प्रोफ़ाइल",
    admin: "एडमिन",
    adminConsole: "एडमिन कंसोल",
    backToSite: "मुख्य साइट",
    viewAll: "सभी देखें",
    loading: "नवीनतम डेटा लोड हो रहा है...",
    error: "डेटा लोड करने में त्रुटि",
    save: "सहेजें",
    saved: "सहेजा गया",
    search: "खोजें",
    all: "सभी",
    officialDisclaimer: "आधिकारिक सूचनाएं और दस्तावेज उनकी मूल प्रकाशन भाषा (अंग्रेजी) में प्रस्तुत किए गए हैं।",

    // Landing Page
    heroTitle: "वीर कनेक्ट",
    heroSubtitle: "स्वचालित पूर्व सैनिक सूचना पोर्टल",
    heroTagline: "पूर्व सैनिकों और उनके परिवारों के लिए वास्तविक समय अपडेट, नौकरी प्लेसमेंट, कल्याण योजनाएं, पेंशन मार्गदर्शन और एआई सहायता।",
    searchPlaceholder: "अपडेट्स, नौकरियां, योजनाएं खोजें...",
    statsSources: "आधिकारिक स्रोत",
    statsJobs: "सक्रिय नौकरियां",
    statsSchemes: "कल्याणकारी योजनाएं",
    statsUpdates: "हाल के अपडेट्स",
    syncAlert: "नए अपडेट मिले हैं! वास्तविक समय में सिंक करने के लिए क्लिक करें।",
    latestContent: "नवीनतम सामग्री",
    filterAll: "सभी",
    filterUpdates: "अपडेट्स",
    filterJobs: "नौकरियां",
    filterSchemes: "योजनाएं",
    readMore: "और पढ़ें",
    noResults: "आपकी खोज से मेल खाता कोई परिणाम नहीं मिला।",
    loadMore: "अधिक लोड करें",

    // Dashboard Page
    dashboardTitle: "आपका डैशबोर्ड",
    dashboardSubtitle: "नवीनतम सूचनाएं, नौकरियां और योजनाएं — आधिकारिक स्रोतों से दैनिक रूप से अपडेट।",
    trendingUpdates: "प्रचलित अपडेट्स",
    latestAnnouncements: "हाल की घोषणाएं",
    recommendedForYou: "आपके लिए अनुशंसित",
    recSavedText: "आपके द्वारा सहेजी गई जानकारी के आधार पर, आप नवीनतम पेंशन और चिकित्सा अपडेट भी देख सकते हैं —",
    recEmptyText: "कुछ नौकरियों या योजनाओं को सहेजें (बुकमार्क आइकन पर टैप करें) और आपकी प्राथमिकताओं के आधार पर सिफारिशें यहां दिखाई देंगी। या सीधे पूछें",
    veerAssistantDirect: "वीर एआई सहायक से सीधे संपर्क करें।",

    // ECHS Page
    echsTitle: "ईसीएचएस पॉलीक्लिनिक और स्वास्थ्य सेवा",
    echsSubtitle: "ईसीएचएस स्मार्ट कार्ड आवेदन दिशानिर्देश, पॉलीक्लिनिक निर्देशिकाएं और सूचीबद्ध अस्पताल प्रक्रियाओं तक पहुंचें।",
    echsCardTitle: "64KB स्मार्ट कार्ड के लिए आवेदन करें",
    echsCardDesc: "पूर्व सैनिक पूरे भारत में कैशलेस चिकित्सा उपचार का लाभ उठाने के लिए ईसीएचएस 64KB स्मार्ट कार्ड के लिए ऑनलाइन आवेदन कर सकते हैं।",
    echsPortalBtn: "ईसीएचएस स्मार्ट कार्ड पोर्टल",
    echsSearchPlaceholder: "पॉलीक्लिनिक निर्देशिकाओं में खोजें...",
    echsStatusActive: "सक्रिय",
    echsSearchLabel: "पॉलीक्लिनिक स्थान खोजक",

    // Pension Page
    pensionTitle: "पेंशन स्थिति ट्रैकर (स्पर्श)",
    pensionSubtitle: "अपनी पेंशन माइग्रेशन स्थिति, पीसीडीए परिपत्रों की जांच करें और जानें कि स्पर्श पहचान कैसे पूरी करें।",
    pensionCardTitle: "स्पर्श पेंशन स्थिति की जांच",
    pensionInputPlaceholder: "स्पर्श पीपीओ / सेवा संख्या दर्ज करें",
    pensionCheckBtn: "स्थिति जांचें",
    pensionMockResultTitle: "स्थिति क्वेरी परिणाम",
    pensionMockActive: "पेंशन स्थानांतरित और सक्रिय",
    pensionMockPending: "स्थानांतरण लंबित - कृपया पीसीडीए से एसएमएस अधिसूचना की प्रतीक्षा करें।",
    pensionIdentifyTitle: "वार्षिक पहचान कैसे पूरी करें",
    pensionStep1: "1. अपनी पीपीओ संख्या का उपयोग करके स्पर्श पोर्टल पर लॉग इन करें।",
    pensionStep2: "2. 'पहचान' अनुभाग पर जाएं और 'आधार' या 'डीएलसी' चुनें।",
    pensionStep3: "3. बायोमेट्रिक सत्यापन पूरा करें या जीवन प्रमाण ऐप के माध्यम से डिजिटल जीवन प्रमाण पत्र जमा करें।",

    // Helplines Page
    helplinesTitle: "आधिकारिक हेल्पलाइन और सैनिक बोर्ड",
    helplinesSubtitle: "पूरे भारत में सैनिक बोर्डों के लिए सीधे आपातकालीन संपर्क, सहायता डेस्क नंबर और संपर्क सूत्र।",
    helplinesEmerTitle: "आपातकालीन हेल्पलाइन नंबर",
    helplinesDirectEmer: "आपातकालीन संपर्क",
    helplinesStateBoards: "राज्य और जिला सैनिक बोर्ड",

    // About Page
    aboutTitle: "वीर कनेक्ट के बारे में",
    aboutSubtitle: "एक स्वचालित सार्वजनिक सूचना पोर्टल जो आधिकारिक कल्याण संसाधनों को पूर्व सैनिकों, दिग्गजों और उनके परिवारों के लिए सुलभ बनाता है।",
    aboutMissionTitle: "हमारा उद्देश्य",
    aboutMissionDesc: "एक पारदर्शी, स्वचालित प्रवेश द्वार बनाना जो विभिन्न आधिकारिक वेबसाइटों (ईसीएचएस, डीजीआर, केएसबी, स्पर्श) से महत्वपूर्ण जानकारी संकलित करता है और इसे एक आसान मंच पर प्रदान करता है।",
    aboutSourceTitle: "डेटा ऑर्केस्ट्रेशन",
    aboutSourceDesc: "हमारा स्वचालित स्क्रैपर हर दिन आधिकारिक निर्देशिकाओं और प्रेस बुलेटिनों को स्कैन करता है ताकि सीधे इस सार्वजनिक पोर्टल पर नवीनतम सूचनाएं, नौकरियां और कल्याणकारी लाभ भेजे जा सकें।",
    aboutFaqTitle: "अक्सर पूछे जाने वाले प्रश्न",

    // AI Assistant Page
    aiTitle: "वीर एआई सहायक",
    aiSubtitle: "कल्याणकारी योजनाओं, नौकरी की पात्रता, पेंशन गणना और पॉलीक्लिनिक लाभों के बारे में प्रश्न पूछें।",
    aiInputPlaceholder: "वीर सहायक से कुछ भी पूछें (उदा. 'बेटियों की शादी के लिए कौन सी योजनाएं हैं?')...",
    aiDefaultResponse: "नमस्ते! मैं आपका वीर सहायक हूँ। मैं कल्याणकारी योजनाओं, ईसीएचएस नियमों और डीजीआर नौकरियों में आपका मार्गदर्शन कर सकता हूँ। मुझसे कोई भी प्रश्न पूछें!",
  },
  te: {
    // Navbar & Common
    home: "ప్రధాన పేజీ",
    updates: "అప్‌డేట్స్",
    jobs: "ఉద్యోగాలు",
    schemes: "పథకాలు",
    echs: "ఈసీహెచ్ఎస్",
    pension: "పెన్షన్",
    helplines: "హెల్ప్‌లైన్",
    about: "మా గురించి",
    signIn: "లాగిన్ అవ్వండి",
    signOut: "లాగ్ అవుట్",
    profile: "ప్రొఫైల్",
    admin: "అడ్మిన్",
    adminConsole: "అడ్మిన్ కన్సోల్",
    backToSite: "ప్రధాన సైట్",
    viewAll: "అన్నీ చూడండి",
    loading: "తాజా సమాచారం లోడ్ అవుతోంది...",
    error: "సమాచారం లోడ్ చేయడంలో లోపం",
    save: "సేవ్ చేయండి",
    saved: "సేవ్ చేయబడింది",
    search: "వెతకండి",
    all: "అన్నీ",
    officialDisclaimer: "ఆధికారిక నోటీసులు మరియు పత్రాలు వాటి అసలు ప్రచురణ భాషలో (ఇంగ్లీష్) ప్రదర్శించబడతాయి.",

    // Landing Page
    heroTitle: "వీర్ కనెక్ట్",
    heroSubtitle: "స్వయంచాలక మాజీ సైనికుల సమాచార పోర్టల్",
    heroTagline: "మాజీ సైనికులు మరియు వారి కుటుంబాల కోసం నిజ సమయ అప్‌డేట్లు, ఉద్యోగ అవకాశాలు, సంక్షేమ పథకాలు, పెన్షన్ మార్గదర్శకత్వం మరియు ఏఐ సహాయం.",
    searchPlaceholder: "అప్‌డేట్లు, ఉద్యోగాలు, పథకాలు వెతకండి...",
    statsSources: "ఆధికారిక వనరులు",
    statsJobs: "సక్రియ ఉద్యోగాలు",
    statsSchemes: "సంక్షేమ పథకాలు",
    statsUpdates: "ఇటీవలి అప్‌డేట్లు",
    syncAlert: "కొత్త అప్‌డేట్లు వచ్చాయి! నిజ సమయంలో సమకాలీకరించడానికి ఇక్కడ క్లిక్ చేయండి.",
    latestContent: "తాజా కంటెంట్",
    filterAll: "అన్నీ",
    filterUpdates: "అప్‌డేట్స్",
    filterJobs: "ఉద్యోగాలు",
    filterSchemes: "పథకాలు",
    readMore: "మరింత చదవండి",
    noResults: "మీ శోధనకు సరిపోయే ఫలితాలు ఏవీ లేవు.",
    loadMore: "మరిన్ని చూడండి",

    // Dashboard Page
    dashboardTitle: "మీ డ్యాష్‌బోర్డ్",
    dashboardSubtitle: "తాజా నోటిఫికేషన్లు, ఉద్యోగాలు మరియు పథకాలు — అధికారిక వనరుల నుండి ప్రతిరోజూ అప్‌డేట్ చేయబడతాయి.",
    trendingUpdates: "ట్రెండింగ్ అప్‌డేట్స్",
    latestAnnouncements: "ఇటీవలి ప్రకటనలు",
    recommendedForYou: "మీ కోసం సిఫార్సు చేయబడినవి",
    recSavedText: "మీరు సేవ్ చేసిన సమాచారం ఆధారంగా, మీరు తాజా పెన్షన్ మరియు వైద్య అప్‌డేట్‌లను కూడా చూడవచ్చు —",
    recEmptyText: "కొన్ని ఉద్యోగాలు లేదా పథకాలను సేవ్ చేయండి (బుక్‌మార్క్ ఐకాన్‌ను నొక్కండి) మరియు మీ ప్రాధాన్యతల ఆధారంగా సిఫార్సులు ఇక్కడ కనిపిస్తాయి. లేదా నేరుగా అడగండి",
    veerAssistantDirect: "వీర్ ఏఐ సహాయకుడిని నేరుగా అడగండి.",

    // ECHS Page
    echsTitle: "ఈసీహెచ్ఎస్ పాలీక్లినిక్‌లు & వైద్య సేవలు",
    echsSubtitle: "ఈసీహెచ్ఎస్ స్మార్ట్ కార్డ్ దరఖాస్తు మార్గదర్శకాలు, పాలీక్లినిక్ డైరెక్టరీలు మరియు అనుబంధ ఆసుపత్రి విధానాలను యాక్సెస్ చేయండి.",
    echsCardTitle: "64KB స్మార్ట్ కార్డ్ కోసం దరఖాస్తు చేసుకోండి",
    echsCardDesc: "మాజీ సైనికులు భారతదేశం అంతటా నగదు రహిత వైద్య చికిత్సలను పొందేందుకు ఈసీహెచ్ఎస్ 64KB స్మార్ట్ కార్డ్ కోసం ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవచ్చు.",
    echsPortalBtn: "ఈసీహెచ్ఎస్ స్మార్ట్ కార్డ్ పోర్టల్",
    echsSearchPlaceholder: "పాలీక్లినిక్ డైరెక్టరీలలో వెతకండి...",
    echsStatusActive: "యాక్టివ్",
    echsSearchLabel: "పాలీక్లినిక్ స్థానాన్ని కనుగొనండి",

    // Pension Page
    pensionTitle: "పెన్షన్ స్టేటస్ ట్రాకర్ (స్పర్స్)",
    pensionSubtitle: "మీ పెన్షన్ మైగ్రేషన్ స్థితి, పీసీడీఏ సర్క్యులర్లను తనిఖీ చేయండి మరియు స్పర్స్ గుర్తింపును ఎలా పూర్తి చేయాలో తెలుసుకోండి.",
    pensionCardTitle: "స్పర్స్ పెన్షన్ స్థితి తనిఖీ",
    pensionInputPlaceholder: "స్పర్స్ పీపీఓ / సర్వీస్ నంబర్ నమోదు చేయండి",
    pensionCheckBtn: "స్థితిని తనిఖీ చేయండి",
    pensionMockResultTitle: "స్థితి ప్రశ్న ఫలితం",
    pensionMockActive: "పెన్షన్ విజయవంతంగా బదిలీ చేయబడింది మరియు యాక్టివ్‌గా ఉంది",
    pensionMockPending: "మైగ్రేషన్ పెండింగ్‌లో ఉంది - దయచేసి పీసీడీఏ నుండి ఎస్ఎంఎస్ నోటిఫికేషన్ కోసం వేచి ఉండండి.",
    pensionIdentifyTitle: "వార్షిక గుర్తింపును ఎలా పూర్తి చేయాలి",
    pensionStep1: "1. మీ పీపీఓ నంబర్‌ను ఉపయోగించి స్పర్స్ పోర్టల్‌లోకి లాగిన్ అవ్వండి.",
    pensionStep2: "2. 'ఐడెంటిఫికేషన్' విభాగానికి వెళ్లి, 'ఆధార్' లేదా 'డీఎల్‌సీ' ఎంచుకోండి.",
    pensionStep3: "3. బయోమెట్రిక్ ధృవీకరణను పూర్తి చేయండి లేదా జీవన్ ప్రమాణ్ యాప్ ద్వారా డిజిటల్ లైఫ్ సర్టిఫికేట్‌ను సమర్పించండి.",

    // Helplines Page
    helplinesTitle: "అధికారిక హెల్ప్‌లైన్లు & సైనిక్ బోర్డులు",
    helplinesSubtitle: "భారతదేశం అంతటా సైనిక్ బోర్డుల కోసం నేరుగా అత్యవసర సంప్రదింపులు, మద్దతు డెస్క్ నంబర్లు మరియు సంప్రదింపు సమాచారం.",
    helplinesEmerTitle: "అత్యవసర హెల్ప్‌లైన్ నంబర్లు",
    helplinesDirectEmer: "అత్యవసర సంప్రదింపులు",
    helplinesStateBoards: "రాజ్య & జిల్లా సైనిక్ బోర్డులు",

    // About Page
    aboutTitle: "వీర్ కనెక్ట్ గురించి",
    aboutSubtitle: "మాజీ సైనికులు, అనుభవజ్ఞులు మరియు వారి కుటుంబాలకు అధికారిక సంక్షేమ వనరులను అందుబాటులోకి తెచ్చే ఒక స్వయంచాలక ప్రజా సమాచార పోర్టల్.",
    aboutMissionTitle: "మా లక్ష్యం",
    aboutMissionDesc: "వివిధ అధికారిక వెబ్‌సైట్ల (ఈసీహెచ్ఎస్, డీజీఆర్, కేఎస్‌బీ, స్పర్స్) నుండి కీలకమైన సమాచారాన్ని సేకరించి, ఒకే సులభమైన వేదికపై అందించే పారదర్శక, స్వయంచాలక గేట్‌వేను నిర్మించడం.",
    aboutSourceTitle: "సమాచార నిర్వహణ",
    aboutSourceDesc: "ఈ పబ్లిక్ పోర్టల్‌కు నేరుగా తాజా నోటిఫికేషన్లు, ఉద్యోగాలు మరియు సంక్షేమ ప్రయోజనాలను పంపడానికి మా స్వయంచాలక స్క్రాపర్ ప్రతిరోజూ అధికారిక డైరెక్టరీలు మరియు ప్రెస్ బులెటిన్లను తనిఖీ చేస్తుంది.",
    aboutFaqTitle: "తరచుగా అడిగే ప్రశ్నలు",

    // AI Assistant Page
    aiTitle: "వీర్ ఏఐ సహాయకుడు",
    aiSubtitle: "సంక్షేమ పథకాలు, ఉద్యోగ అర్హత, పెన్షన్ లెక్కలు మరియు పాలీక్లినిక్ ప్రయోజనాల గురించి ప్రశ్నలు అడగండి.",
    aiInputPlaceholder: "వీర్ సహాయకుడిని ఏదైనా అడగండి (ఉదా. 'కూతురి పెళ్లి కోసం ఉన్న పథకాలు ఏమిటి?')...",
    aiDefaultResponse: "నమస్కారం! నేను మీ వీర్ ఏఐ సహాయకుడిని. సంక్షేమ పథకాలు, ఈసీహెచ్ఎస్ నియమాలు మరియు డీజీఆర్ ఉద్యోగాలపై నేను మీకు మార్గనిర్దేశం చేయగలను. నన్ను ఏదైనా ప్రశ్న అడగండి!",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("esm-portal:lang") as Language | null
    if (stored === "en" || stored === "hi" || stored === "te") return stored
    return "en"
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("esm-portal:lang", lang)
  }

  const t = (key: string, variables?: Record<string, string>): string => {
    const translation = translations[language]?.[key] || translations["en"]?.[key] || key
    if (!variables) return translation
    
    return Object.entries(variables).reduce((acc, [k, v]) => {
      return acc.replace(new RegExp(`{${k}}`, "g"), v)
    }, translation)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
