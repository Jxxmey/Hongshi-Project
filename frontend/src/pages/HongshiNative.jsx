import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext'; // นำเข้า LanguageContext เพื่อรองรับ TH/EN

// ==========================================
// ชุดคำถามภาษาไทย (TH)
// ==========================================
const quizDataTH = [
  {
    part: 1,
    title: "ข้อมูลส่วนตัว (Personal Info)",
    questions: [
      { q: "ฮง (Hong LYKN) มีชื่อจริงเขียนว่าอย่างไร?", options: ["พิเชฐพงศ์ จิรเดชสกุลวงศ์", "พิชญ์พงษ์ จิระเดชสกุลวงศ์", "พิเชษฐ์พงศ์ จิรเดชสกุลวงศ์", "พิชญ์พล จิรเดชสกุล"], answer: 0 },
      { q: "ฮงเกิดวันที่เท่าไหร่?", options: ["14 ตุลาคม 2003", "16 ตุลาคม 2003", "16 พฤศจิกายน 2003", "18 ตุลาคม 2003"], answer: 1 },
      { q: "ฮงจบการศึกษาระดับมัธยมจากโรงเรียนอะไร?", options: ["เตรียมอุดมศึกษา", "กรุงเทพคริสเตียนวิทยาลัย", "สวนกุหลาบวิทยาลัย", "อัสสัมชัญ"], answer: 2 },
      { q: "ปัจจุบันฮงกำลังศึกษาอยู่ที่คณะ/หลักสูตรใด ในระดับปริญญาตรี?", options: ["สถาบันนวัตกรรมบูรณาการฯ (BAScii) จุฬาฯ", "คณะนิเทศศาสตร์ จุฬาฯ", "วิทยาลัยนวัตกรรมสื่อสารสังคม มศว", "คณะศิลปกรรมศาสตร์ ม.ธรรมศาสตร์"], answer: 0 },
      { q: "สีโปรดที่ฮงชอบมากที่สุดคือสีอะไร?", options: ["สีฟ้า", "สีดำ", "สีส้ม", "สีแดง"], answer: 2 },
      { q: "ส่วนสูงของฮงคือเท่าไหร่?", options: ["175 cm", "178 cm", "181 cm", "183 cm"], answer: 1 },
      { q: "กรุ๊ปเลือดของฮงคือกรุ๊ปอะไร?", options: ["A", "B", "O", "AB"], answer: 2 },
      { q: "ฮงมีเชื้อสายอะไรบ้าง?", options: ["ไทย-จีน", "ไทย-ญี่ปุ่น", "ไทย-เกาหลี", "ไทยแท้"], answer: 0 },
      { q: "ก่อนจะมาประกวด Project Alpha ฮงเคยทำกิจกรรมอะไรในโรงเรียนมัธยมมาก่อน?", options: ["ประธานนักเรียน", "นักเต้นและเชียร์ลีดเดอร์", "นักร้องนำวงโรงเรียน", "นักบาสเกตบอล"], answer: 1 },
      { q: "กีฬาที่ฮงชอบเล่นมากที่สุดคืออะไร?", options: ["ฟุตบอล", "บาสเกตบอล", "ว่ายน้ำ", "แบดมินตัน"], answer: 0 }
    ]
  },
  {
    part: 2,
    title: "ในวงการบันเทิง (Entertainment)",
    questions: [
      { q: "ฮงเดบิวต์เป็นศิลปินมาจากรายการเซอร์ไววัลชื่อว่าอะไร?", options: ["Project Alpha", "LAZ iCON", "The Star Idol", "789 Survival"], answer: 0 },
      { q: "ตำแหน่งหลัก (Role) ของฮงในวง LYKN คืออะไร?", options: ["Main Vocal", "Main Rapper & Lead Dancer", "Visual", "Leader"], answer: 1 },
      { q: "ฮงเริ่มค้นพบตัวเองว่าชอบ 'แร็ป' (Rap) ตั้งแต่เมื่อไหร่?", options: ["ตอนเรียนมัธยม", "ตอนเรียนมหาลัย", "ตอนแข่งรายการ Project Alpha", "ตอนไปออดิชั่นค่ายเพลง"], answer: 2 },
      { q: "ฮงมีส่วนร่วมในการทำเพลงใดของวง LYKN ในฐานะผู้ช่วยแต่งเนื้อเพลง (Co-lyricist / Assistant writer)?", options: ["UMM UMM", "แอบรักไม่ทำให้ใครตาย", "ฉ่ำ (Charm)", "โฮ่ง! (SUGOI) และ หยอกไม่หลอก"], answer: 3 },
      { q: "เพลงโซโล่ (Solo Debut) เพลงแรกของฮงมีชื่อว่าอะไร?", options: ["ถูกสเปก (Let's Go)", "เกินต้าน", "น่ารักชิบเป๋ง", "ตกหลุมรักรอบที่ล้าน"], answer: 0 },
      { q: "ซีรีส์เรื่องแรกที่ฮงได้เป็นนักแสดงนำคือเรื่องอะไร?", options: ["Only Friends", "Thame-Po Heart That Skips a Beat", "My School President", "Enigma 2"], answer: 1 },
      { q: "ในซีรีส์เรื่อง Thame-Po ฮงรับบทเป็นตัวละครชื่ออะไร?", options: ["ดีแลน (Dylan)", "มาร์ค (Mark)", "เคน (Ken)", "เจค (Jake)"], answer: 0 },
      { q: "วง LYKN ได้รับรางวัล Best New Artist ประจำปี 2024 จากงานประกาศรางวัลใด?", options: ["TOTY Music Awards", "The Guitar Mag Awards", "Komchadluek Awards", "Kazz Awards"], answer: 2 },
      { q: "ฮงเคยไปปรากฏตัวใน MV เพลง 'บอกหน่อย (Tell Me You're Not Dead)' ของศิลปินท่านใด?", options: ["NONT TANONT", "Mercury Goldfish", "Tilly Birds", "Zom Marie"], answer: 1 },
      { q: "ชื่อแฟนคลับอย่างเป็นทางการของวง LYKN คืออะไร?", options: ["LYKYOU", "ALPHA", "LYKNER", "WOLF"], answer: 0 }
    ]
  },
  {
    part: 3,
    title: "เกร็ดความรู้ (Trivia & Fun Facts)",
    questions: [
      { q: "กลิ่นที่ฮงชื่นชอบที่สุดคือกลิ่นแบบไหน?", options: ["กลิ่นกาแฟคั่ว", "กลิ่นน้ำหอมแนวสปอร์ต", "กลิ่นของสนามบิน (Airport smell)", "กลิ่นดินหลังฝนตก"], answer: 2 },
      { q: "สิ่งที่ฮงชอบกินมากๆ ถึงขั้น 'พกช้อนไปทุกที่ และกินได้เป็นแกลลอน' คืออะไร?", options: ["บิงซู", "ไอศกรีม", "โยเกิร์ต", "พุดดิ้ง"], answer: 1 },
      { q: "สัตว์เลี้ยงที่ฮงเคยบอกว่าอยากเลี้ยง (เพราะชอบการ์ตูน Phineas and Ferb) คือตัวอะไร?", options: ["ตุ่นปากเป็ด", "แรคคูน", "เฟอร์เรท", "ชินชิลล่า"], answer: 0 },
      { q: "ของสะสมที่ฮงชื่นชอบคืออะไร?", options: ["รองเท้าผ้าใบ (Sneakers)", "แผ่นเสียง", "โมเดลรถ", "การ์ดโปเกมอน"], answer: 3 },
      { q: "อนิเมะที่ฮงชื่นชอบคือเรื่องอะไร?", options: ["Jujutsu Kaisen", "Kaiju No. 8", "Demon Slayer", "One Piece"], answer: 1 },
      { q: "อาหารที่ฮงชื่นชอบที่สุดคืออาหารแนวไหน?", options: ["อาหารญี่ปุ่น", "อาหารเกาหลี", "อาหารอิตาเลียน และ อาหารอีสาน", "ฟาสต์ฟู้ด"], answer: 2 },
      { q: "ศิลปินที่ฮงชื่นชอบและถือเป็นไอดอลที่อยากเจอมากที่สุดคือใคร?", options: ["IU (ไอยู)", "Taeyeon", "Lisa BLACKPINK", "Jennie BLACKPINK"], answer: 0 },
      { q: "ฮงเกลียดเสียงหรือความรู้สึกแบบไหนมากที่สุด?", options: ["เสียงโฟมเสียดสีกัน", "เสียงเล็บขูดกับกระดาษ", "เสียงคนเคี้ยวอาหารดังๆ", "เสียงเหล็กขูดกัน"], answer: 1 },
      { q: "ชื่อแฟนคลับเดี่ยว (Fandom Name) ของฮงชื่อว่าอะไร?", options: ["ฮงฮง", "เรดฮง", "ฮงชิ (Hongshi)", "พิกเล็ต"], answer: 2 },
      { q: "บ้านในฝันของฮงมีลักษณะเป็นแบบไหน?", options: ["บ้านสไตล์โมเดิร์นลอฟท์", "บ้านพักตากอากาศริมทะเล", "เพนท์เฮาส์หรูใจกลางเมือง", "สไตล์ญี่ปุ่นผสมจีน มีสวนเซนอยู่ตรงกลาง"], answer: 3 }
    ]
  }
];

// ==========================================
// ชุดคำถามภาษาอังกฤษ (EN)
// ==========================================
const quizDataEN = [
  {
    part: 1,
    title: "Personal Info",
    questions: [
      { q: "What is Hong's (Hong LYKN) official real name?", options: ["Pichetpong Chiradatesakunvong", "Phitpong Chiradatesakunvong", "Pichetphong Chiradatesakun", "Phitpon Chiradatesakun"], answer: 0 },
      { q: "When is Hong's birthday?", options: ["October 14, 2003", "October 16, 2003", "November 16, 2003", "October 18, 2003"], answer: 1 },
      { q: "Which high school did Hong graduate from?", options: ["Triam Udom Suksa", "Bangkok Christian College", "Suankularb Wittayalai", "Assumption College"], answer: 2 },
      { q: "Where is Hong currently studying for his Bachelor's degree?", options: ["BAScii, Chulalongkorn University", "Communication Arts, Chulalongkorn University", "COSCI, Srinakharinwirot University", "Fine Arts, Thammasat University"], answer: 0 },
      { q: "What is Hong's favorite color?", options: ["Blue", "Black", "Orange", "Red"], answer: 2 },
      { q: "What is Hong's approximate height?", options: ["175 cm", "178 cm", "181 cm", "183 cm"], answer: 1 },
      { q: "What is Hong's blood type?", options: ["A", "B", "O", "AB"], answer: 2 },
      { q: "What is Hong's descent/ethnicity?", options: ["Thai-Chinese", "Thai-Japanese", "Thai-Korean", "Pure Thai"], answer: 0 },
      { q: "Before competing in Project Alpha, what activity was Hong known for in high school?", options: ["Student Council President", "Dancer & Cheerleader", "School Band Lead Singer", "Basketball Player"], answer: 1 },
      { q: "What sport does Hong enjoy playing the most?", options: ["Football (Soccer)", "Basketball", "Swimming", "Badminton"], answer: 0 }
    ]
  },
  {
    part: 2,
    title: "Entertainment & Career",
    questions: [
      { q: "Which survival show did Hong debut from?", options: ["Project Alpha", "LAZ iCON", "The Star Idol", "789 Survival"], answer: 0 },
      { q: "What is Hong's main role in LYKN?", options: ["Main Vocal", "Main Rapper & Lead Dancer", "Visual", "Leader"], answer: 1 },
      { q: "When did Hong discover his passion for 'Rap'?", options: ["During High School", "During University", "While competing in Project Alpha", "During an agency audition"], answer: 2 },
      { q: "Which LYKN song(s) did Hong co-write the lyrics for?", options: ["UMM UMM", "แอบรักไม่ทำให้ใครตาย (Secret Love)", "ฉ่ำ (Charm)", "โฮ่ง! (SUGOI) & หยอกไม่หลอก (Tease)"], answer: 3 },
      { q: "What is the title of Hong's first solo debut song?", options: ["ถูกสเปก (Let's Go)", "เกินต้าน", "น่ารักชิบเป๋ง", "ตกหลุมรักรอบที่ล้าน"], answer: 0 },
      { q: "What is Hong's first series as a lead actor?", options: ["Only Friends", "Thame-Po Heart That Skips a Beat", "My School President", "Enigma 2"], answer: 1 },
      { q: "In the series 'Thame-Po', what is the name of Hong's character?", options: ["Dylan", "Mark", "Ken", "Jake"], answer: 0 },
      { q: "LYKN won the 'Best New Artist 2024' award from which event?", options: ["TOTY Music Awards", "The Guitar Mag Awards", "Komchadluek Awards", "Kazz Awards"], answer: 2 },
      { q: "Hong appeared in the Music Video 'Tell Me You're Not Dead' by which artist?", options: ["NONT TANONT", "Mercury Goldfish", "Tilly Birds", "Zom Marie"], answer: 1 },
      { q: "What is the official fandom name of LYKN?", options: ["LYKYOU", "ALPHA", "LYKNER", "WOLF"], answer: 0 }
    ]
  },
  {
    part: 3,
    title: "Trivia & Fun Facts",
    questions: [
      { q: "What is Hong's absolute favorite scent?", options: ["Roasted Coffee", "Sporty Cologne", "The Airport Smell", "Petrichor (Rain on dry earth)"], answer: 2 },
      { q: "What food does Hong love so much that he carries a spoon and 'could eat a gallon of it'?", options: ["Bingsu", "Ice Cream", "Yogurt", "Pudding"], answer: 1 },
      { q: "Which pet did Hong once say he wanted to own (inspired by Phineas and Ferb)?", options: ["Platypus", "Raccoon", "Ferret", "Chinchilla"], answer: 0 },
      { q: "What is one of Hong's favorite collectibles?", options: ["Sneakers", "Vinyl Records", "Model Cars", "Pokémon Cards"], answer: 3 },
      { q: "Which of these anime series does Hong love?", options: ["Jujutsu Kaisen", "Kaiju No. 8", "Demon Slayer", "One Piece"], answer: 1 },
      { q: "What is Hong's favorite type of cuisine?", options: ["Japanese", "Korean", "Italian & Isan (Northeastern Thai)", "Fast Food"], answer: 2 },
      { q: "Which artist is Hong's ultimate idol whom he wishes to meet?", options: ["IU", "Taeyeon", "Lisa BLACKPINK", "Jennie BLACKPINK"], answer: 0 },
      { q: "What sound or sensation does Hong hate the most?", options: ["Styrofoam rubbing together", "Nails scratching on paper", "Loud chewing sounds", "Metal scraping"], answer: 1 },
      { q: "What is Hong's individual fandom name?", options: ["HongHong", "RedHong", "Hongshi", "Piglet"], answer: 2 },
      { q: "What does Hong's dream house look like?", options: ["Modern Loft", "Beachside Villa", "Luxury Penthouse in the city", "Japanese-Chinese style with a Zen garden in the middle"], answer: 3 }
    ]
  }
];


export default function HongshiNative() {
  const { language } = useLanguage(); // ดึงค่าภาษาปัจจุบัน ('th' หรือ 'en')
  
  // เลือกใช้ข้อมูลตามภาษา
  const quizData = language === 'en' ? quizDataEN : quizDataTH;

  // gameState มี: 'intro', 'playing', 'partTransition', 'result'
  const [gameState, setGameState] = useState('intro'); 
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  
  // สำหรับแสดงแอนิเมชันเฉลย
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentPart(0);
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const correctAns = quizData[currentPart].questions[currentQuestion].answer;
    
    if (optionIndex === correctAns) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }

    // รอ 1.2 วินาทีเพื่อดูเฉลย แล้วเปลี่ยนข้อ
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      
      if (currentQuestion < 9) {
        // ไปข้อถัดไปในพาร์ทเดิม
        setCurrentQuestion(prev => prev + 1);
      } else {
        // จบพาร์ท! เช็คว่าจบเกมหรือแค่เปลี่ยนพาร์ท
        if (currentPart < 2) {
          // ยังมีพาร์ทต่อไป -> ไปหน้า Part Transition คั่นกลางก่อน
          setGameState('partTransition');
        } else {
          // จบเกม (พาร์ท 3 แล้ว)
          setGameState('result');
        }
      }
    }, 1200);
  };

  // ฟังก์ชันเริ่มพาร์ทถัดไป (หลังจากกดปุ่มในหน้า Part Transition)
  const continueNextPart = () => {
    setCurrentPart(prev => prev + 1);
    setCurrentQuestion(0);
    setGameState('playing');
  };

  // คำนวณความคืบหน้า (Progress) เป็นเปอร์เซ็นต์
  const totalQuestionNumber = (currentPart * 10) + currentQuestion + 1;
  const progressPercent = (totalQuestionNumber / 30) * 100;

  // ฟังก์ชันจัดระดับติ่งตามคะแนน (รองรับ 2 ภาษา)
  const getRank = () => {
    if (language === 'en') {
      if (score === 30) return { title: "👑 Pure-Blood Hongshi Legend", desc: "Incredible! You know absolutely everything about Hong. A true ultimate fan!" };
      if (score >= 21) return { title: "🌟 Top-Tier Hongshi", desc: "Great job! You are an elite fan who follows Hong's life closely." };
      if (score >= 11) return { title: "💖 Rookie Hongshi", desc: "You know quite a lot! You're definitely falling deep into the fandom." };
      return { title: "🍼 Baby Hongshi", desc: "You might not know much yet, but that's okay! Let's get to know Hong together!" };
    } else {
      if (score === 30) return { title: "👑 ตำนานฮงชิสายเลือดแท้", desc: "สุดยอดมาก! คุณรู้ลึกรู้จริงทุกเรื่องเกี่ยวกับฮง แฟนพันธุ์แท้ตัวจริงเสียงจริง!" };
      if (score >= 21) return { title: "🌟 ฮงชิตัวเต็ง", desc: "เก่งมาก! คุณคือแฟนคลับระดับหัวกะทิ ตามติดชีวิตฮงแบบไม่คลาดสายตาเลยทีเดียว" };
      if (score >= 11) return { title: "💖 ฮงชิมือใหม่ไฟแรง", desc: "ถือว่ารู้เยอะเลยนะเนี่ย! กำลังโดนตกเข้าด้อมเต็มตัวแล้วใช่มั้ยล่ะ" };
      return { title: "🍼 มัมหมีฝึกหัด", desc: "ยังไม่ค่อยรู้ข้อมูลเท่าไหร่ แต่ไม่เป็นไรนะ มาโดนฮงตกไปด้วยกันเรื่อยๆ นะครับ!" };
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full selection:bg-azalea selection:text-white pb-20 flex items-center justify-center font-body px-4">
      
      {/* ---------------- INTRO STATE ---------------- */}
      {gameState === 'intro' && (
        <ScrollReveal>
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-[40px] shadow-lg max-w-lg w-full text-center border-t-8 border-skyblue">
            <span className="text-6xl block mb-6 animate-bounce">🎓</span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-4">
              {language === 'en' ? "Hongshi Native" : "แบบทดสอบ"}<br/>
              <span className="text-azalea">{language === 'en' ? "Quiz" : "Hongshi Native"}</span>
            </h1>
            <p className="text-navy/70 leading-relaxed mb-8">
              {language === 'en' 
                ? "Let's test your Hongshi knowledge! This quiz consists of 30 questions divided into 3 parts (Personal Info, Entertainment, and Trivia). Ready? Let's go! 🩵"
                : "มาวัดระดับความเป๊ะของคุณกัน! แบบทดสอบนี้มีทั้งหมด 30 ข้อ แบ่งเป็น 3 พาร์ท (ข้อมูลส่วนตัว, วงการบันเทิง, และเกร็ดความรู้) พร้อมแล้วไปลุยกันเลย! 🩵"
              }
            </p>
            <button 
              onClick={startQuiz}
              className="w-full bg-navy text-white font-heading font-bold text-xl py-4 rounded-2xl shadow-md hover:bg-azalea hover:-translate-y-1 transition-all duration-300"
            >
              {language === 'en' ? "Start Quiz 🚀" : "เริ่มทำแบบทดสอบ 🚀"}
            </button>
          </div>
        </ScrollReveal>
      )}


      {/* ---------------- PLAYING STATE ---------------- */}
      {gameState === 'playing' && (
        <div className="max-w-xl w-full animate-fade-in">
          
          {/* แถบ Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="bg-white/80 backdrop-blur-sm text-navy px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                {language === 'en' ? `Part ${currentPart + 1}/3 : ` : `พาร์ทที่ ${currentPart + 1}/3 : `} 
                {quizData[currentPart].title}
              </span>
              <span className="bg-white/80 backdrop-blur-sm text-navy/80 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                {language === 'en' ? `Q ${totalQuestionNumber} / 30` : `ข้อ ${totalQuestionNumber} / 30`}
              </span>
            </div>
            <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-3 shadow-inner">
              <div 
                className="bg-azalea h-3 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <ScrollReveal key={totalQuestionNumber}>
            <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[35px] shadow-md border border-gray-100 min-h-[400px] flex flex-col relative">
              
              <span className="absolute top-4 left-4 text-skyblue opacity-50">✦</span>
              <span className="absolute top-6 right-6 text-[#8b5a2b] opacity-50">★</span>

              <h2 className="text-xl md:text-2xl font-bold text-navy mb-8 text-center leading-relaxed relative z-10 mt-4">
                Q: {quizData[currentPart].questions[currentQuestion].q}
              </h2>

              <div className="space-y-3 flex-grow flex flex-col justify-center">
                {quizData[currentPart].questions[currentQuestion].options.map((opt, idx) => {
                  
                  const isCorrectAnswer = idx === quizData[currentPart].questions[currentQuestion].answer;
                  const isSelected = selectedOption === idx;
                  
                  let btnColor = "bg-gray-50 border-gray-100 hover:bg-skyblue/10 hover:border-skyblue text-navy"; 
                  
                  if (selectedOption !== null) {
                    if (isCorrectAnswer) {
                      btnColor = "bg-green-100 border-green-400 text-green-800 scale-[1.02] shadow-sm"; 
                    } else if (isSelected && !isCorrectAnswer) {
                      btnColor = "bg-red-100 border-red-400 text-red-800 scale-[0.98]"; 
                    } else {
                      btnColor = "bg-gray-50 border-gray-100 text-gray-400 opacity-50"; 
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-300 font-medium md:text-lg ${btnColor}`}
                    >
                      {opt}
                      {selectedOption !== null && isCorrectAnswer && <span className="float-right">✅</span>}
                      {selectedOption !== null && isSelected && !isCorrectAnswer && <span className="float-right">❌</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}


      {/* ---------------- PART TRANSITION STATE (หน้าคั่นกลาง) ---------------- */}
      {gameState === 'partTransition' && (
        <ScrollReveal>
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-[40px] shadow-lg max-w-lg w-full text-center border-t-8 border-yellow-300">
            <span className="text-6xl block mb-6 animate-bounce">☕</span>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-4">
              {language === 'en' ? `Part ${currentPart + 1} Completed!` : `จบพาร์ทที่ ${currentPart + 1} แล้ว!`}
            </h1>
            <p className="text-navy/70 leading-relaxed mb-8">
              {language === 'en' 
                ? `Take a deep breath. You're doing great! Get ready for Part ${currentPart + 2} : ${quizData[currentPart + 1].title}`
                : `พักหายใจสักนิด เก่งมากเลยครับ! เตรียมตัวเข้าสู่พาร์ทที่ ${currentPart + 2} : ${quizData[currentPart + 1].title} กันต่อเลย`
              }
            </p>
            <button 
              onClick={continueNextPart}
              className="w-full bg-skyblue text-navy font-heading font-bold text-xl py-4 rounded-2xl shadow-md hover:bg-azalea hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              {language === 'en' ? "Continue to Next Part ➡️" : "ไปต่อพาร์ทถัดไป ➡️"}
            </button>
          </div>
        </ScrollReveal>
      )}


      {/* ---------------- RESULT STATE ---------------- */}
      {gameState === 'result' && (
        <ScrollReveal>
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-[40px] shadow-xl max-w-lg w-full text-center border-t-8 border-azalea relative">
            
            <span className="absolute top-6 left-10 text-2xl animate-bounce">🎉</span>
            <span className="absolute top-10 right-10 text-2xl animate-ping opacity-50">✨</span>

            <h1 className="text-2xl font-heading font-bold text-navy mb-2">
              {language === 'en' ? "Your Quiz Result" : "ผลการทดสอบของคุณ"}
            </h1>
            
            <div className="my-8">
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-[10px] border-skyblue bg-skyblue/10 mb-4">
                <span className="text-5xl font-heading font-bold text-navy">{score}<span className="text-2xl text-navy/50">/30</span></span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-azalea mb-2">
                {getRank().title}
              </h2>
              <p className="text-navy/70 px-4 font-medium">
                {getRank().desc}
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  const shareTextTH = encodeURIComponent(`ฉันได้คะแนน ${score}/30 ในแบบทดสอบ "Hongshi Native" 🎂 มาร่วมวัดระดับความเป๊ะและอวยพรวันเกิดฮงชิได้ที่เว็บเลย 🩵 #Hongshihoshi #OnemorestepWithHongshi`);
                  const shareTextEN = encodeURIComponent(`I scored ${score}/30 on the "Hongshi Native" Quiz! 🎂 Come test your knowledge and send birthday wishes to Hong here! 🩵 #Hongshihoshi #OnemorestepWithHongshi`);
                  const shareText = language === 'en' ? shareTextEN : shareTextTH;
                  window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
                }}
                className="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                𝕏 {language === 'en' ? "Share Result on X" : "แชร์ผลลัพธ์ลง X (Twitter)"}
              </button>
              
              <button 
                onClick={startQuiz}
                className="w-full bg-skyblue/20 text-navy font-bold py-3.5 rounded-2xl hover:bg-skyblue/40 transition-colors"
              >
                🔄 {language === 'en' ? "Try Again" : "ลองเล่นอีกครั้ง"}
              </button>

              <Link 
                to="/"
                className="block w-full text-navy/60 hover:text-navy font-bold py-2 underline"
              >
                {language === 'en' ? "Back to Home" : "กลับหน้าหลัก"}
              </Link>
            </div>

          </div>
        </ScrollReveal>
      )}

      {/* CSS สำหรับแอนิเมชันตอนแสดงผล */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}