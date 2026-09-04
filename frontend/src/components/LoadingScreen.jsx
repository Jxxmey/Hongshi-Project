import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  
  // State สำหรับสลับภาษาในหน้า T&C (th / en)
  const [tcLang, setTcLang] = useState('th');
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  // 1. ตรวจสอบ LocalStorage ก่อนว่าเคยกดยอมรับไปแล้วหรือยัง
  useEffect(() => {
    const checkTermsStatus = () => {
      const hasAccepted = localStorage.getItem('hasAcceptedTerms');
      if (hasAccepted === 'true') {
        // ถ้าเคยกดยอมรับแล้ว ให้ข้ามหน้านี้ไปเลยทันที
        if (onComplete) onComplete();
      } else {
        // ถ้ายังไม่เคย ให้เริ่มแสดงหน้าโหลด
        setIsCheckingStorage(false);
        startLoadingProcess();
      }
    };
    checkTermsStatus();
  }, [onComplete]);

  // แยกฟังก์ชันการโหลดตัวเลขออกมา
  const startLoadingProcess = () => {
    setProgress(0);
    setIsComplete(false);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = prev < 65 ? 2 : prev < 88 ? 1 : 0.5;
        const nextProgress = Math.round((prev + increment) * 10) / 10;
        
        if (nextProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return nextProgress;
      });
    }, 75);
    
    return timer;
  };

  // 2. ฟังก์ชันเมื่อผู้ใช้กดยอมรับเงื่อนไข
  const handleAcceptTerms = () => {
    // บันทึกค่าลงใน LocalStorage ว่ายอมรับแล้ว
    localStorage.setItem('hasAcceptedTerms', 'true');
    // เรียก onComplete เพื่อเข้าสู่หน้าหลัก
    if (onComplete) onComplete();
  };

  // ถ้ากำลังเช็ค LocalStorage อยู่ จะเรนเดอร์หน้าจอเปล่าๆ สีพื้นหลังไปก่อน (กันหน้าเค้กกระพริบ)
  if (isCheckingStorage) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fffafa, #fdf2f6)' }}></div>;
  }

  return (
    <>
      <style>
        {`
          :root {
            --ink: #5d5d72;
            --pink: #ff8fb8;
            --pink-deep: #ef6595;
            --blue: #95cef4;
            --blue-deep: #63aee2;
            --grey: #e9eaf1;
            --cream: #fffafa;
          }

          .loading-container {
            margin: 0;
            width: 100%;
            min-height: 100vh;
            overflow: hidden;
            font-family: "DM Sans", sans-serif;
            color: var(--ink);
            background: linear-gradient(to bottom, var(--cream), #fdf2f6);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .birthday-shell {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            isolation: isolate;
            padding: 28px;
          }

          .birthday-shell::before,
          .birthday-shell::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            z-index: -1;
            filter: blur(1px);
          }

          .birthday-shell::before {
            width: 46vw;
            height: 46vw;
            max-width: 640px;
            max-height: 640px;
            background: rgba(255, 172, 203, .24);
            top: -24%;
            left: -9%;
          }

          .birthday-shell::after {
            width: 40vw;
            height: 40vw;
            max-width: 540px;
            max-height: 540px;
            background: rgba(143, 207, 244, .26);
            right: -12%;
            bottom: -28%;
          }

          .loading-card {
            width: min(100%, 680px);
            position: relative;
            text-align: center;
            padding: clamp(30px, 5vw, 58px) clamp(20px, 7vw, 72px);
            border: 1px solid rgba(255,255,255,.9);
            border-radius: 40px;
            background: rgba(255, 255, 255, .68);
            box-shadow: 0 28px 80px rgba(105, 103, 133, .16);
            backdrop-filter: blur(14px);
            animation: arrive .75s cubic-bezier(.2,.8,.2,1) both;
          }

          .celebration-tag {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            border-radius: 999px;
            letter-spacing: .08em;
            text-transform: uppercase;
            font-size: .73rem;
            font-weight: 800;
            background: var(--blue);
            color: white;
          }

          .celebration-tag::before { content: "✦"; font-size: 1rem; }
          .title { font-family: "Fraunces", serif; font-size: 2.5rem; line-height: 1.03; margin: 18px auto 12px; color: var(--ink); }
          .message { margin: 0 auto; max-width: 440px; line-height: 1.55; }

          .cake-stage { height: 205px; position: relative; margin: 19px auto 15px; width: 285px; animation: cake-float 3.7s ease-in-out infinite; }
          .cake-shadow { position: absolute; height: 17px; width: 205px; left: 40px; bottom: 5px; border-radius: 50%; background: rgba(104, 107, 132, .13); animation: shadow-pulse 3.7s ease-in-out infinite; }
          .plate { position: absolute; left: 32px; bottom: 18px; width: 220px; height: 28px; border-radius: 50%; background: #d5e8f5; box-shadow: inset 0 -7px 0 #afcfe3; }
          .cake-base { position: absolute; left: 60px; bottom: 35px; width: 164px; height: 72px; border-radius: 12px 12px 28px 28px; background: #f89abc; border: 5px solid #fff5f7; box-shadow: inset 0 -14px 0 #ed7fa6, 0 7px 0 rgba(99,174,226,.18); }
          .cake-base::before { content: ""; position: absolute; left: 12px; right: 12px; top: 26px; height: 6px; border-radius: 99px; background: rgba(255,255,255,.68); box-shadow: 29px 14px 0 rgba(255,255,255,.68), 69px 4px 0 rgba(255,255,255,.68), 111px 15px 0 rgba(255,255,255,.68); }
          .frosting { position: absolute; left: 52px; bottom: 96px; width: 180px; height: 43px; border-radius: 38px 38px 18px 18px; background: #fff8fc; border: 5px solid #fff; box-shadow: inset 0 -8px 0 #f7d7e4; }
          .frosting::after { content: ""; position: absolute; left: 15px; bottom: -17px; width: 16px; height: 22px; border-radius: 0 0 14px 14px; background: #fff8fc; box-shadow: 36px 7px 0 #fff8fc, 80px 1px 0 #fff8fc, 125px 7px 0 #fff8fc; }
          .candle { position: absolute; z-index: 2; left: 133px; bottom: 132px; height: 43px; width: 18px; border-radius: 6px 6px 2px 2px; background: repeating-linear-gradient(135deg, #92cdf3 0 5px, #ffffff 5px 10px); border: 2px solid #72b5df; }
          .flame { position: absolute; z-index: 3; left: 136px; bottom: 174px; width: 13px; height: 23px; border-radius: 70% 30% 60% 40%; transform: rotate(45deg); background: #ffd36d; box-shadow: 0 0 0 4px rgba(255, 186, 85, .19), 0 0 19px rgba(255, 185, 74, .7); animation: flicker .8s ease-in-out infinite alternate; }
          .sprinkle { position: absolute; z-index: 4; width: 7px; height: 15px; border-radius: 99px; background: var(--blue-deep); transform: rotate(28deg); }
          .sprinkle.one { left: 82px; bottom: 116px; background: #ff8eaf; }
          .sprinkle.two { left: 110px; bottom: 125px; transform: rotate(-42deg); }
          .sprinkle.three { left: 171px; bottom: 120px; background: #ffcf6f; transform: rotate(44deg); }
          .sprinkle.four { left: 195px; bottom: 113px; background: #ff8eaf; transform: rotate(-21deg); }

          .progress-area { max-width: 410px; margin: 0 auto; }
          .progress-meta { display: flex; justify-content: space-between; align-items: center; margin: 0 4px 9px; font-size: .82rem; color: #77798c; font-weight: 700; }
          .progress-track { width: 100%; height: 15px; overflow: hidden; border-radius: 999px; padding: 3px; background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.05); }
          .progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #ff82ae, #ffafcb 54%, #91cff4); box-shadow: 0 2px 8px rgba(235, 100, 154, .35); transition: width .12s linear; }
          .loading-status { min-height: 24px; margin: 13px 0 0; font-size: .88rem; font-weight: 600; }

          .balloon { position: absolute; z-index: -1; width: 72px; height: 88px; border-radius: 50% 50% 48% 48%; opacity: .9; animation: drift 5s ease-in-out infinite; }
          .balloon::before { content: ""; position: absolute; bottom: -7px; left: 29px; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 10px solid currentColor; }
          .balloon::after { content: ""; position: absolute; width: 1px; height: 88px; background: currentColor; opacity: .5; left: 36px; top: 90px; transform: rotate(8deg); transform-origin: top; }
          .balloon-pink { top: 14%; left: 8%; background: #ff9abd; color: #e47a9e; }
          .balloon-blue { right: 8%; top: 20%; background: #a5d9f6; color: #75b7dd; animation-delay: -2s; }
          .balloon-small { transform: scale(.63); left: 18%; bottom: 9%; background: #b7ddf5; color: #80b9dc; animation-delay: -1s; }

          .confetti { position: absolute; z-index: -1; width: 9px; height: 18px; border-radius: 99px; background: #ff8eb5; animation: confetti-dance 3.5s ease-in-out infinite; }
          .c1 { left: 19%; top: 19%; transform: rotate(28deg); }
          .c2 { right: 20%; bottom: 20%; background: #8bc9ed; transform: rotate(-32deg); animation-delay: -.8s; }
          .c3 { right: 15%; top: 37%; background: #ffcb71; transform: rotate(44deg); animation-delay: -1.7s; }
          .c4 { left: 12%; bottom: 32%; background: #a9d7f2; transform: rotate(-35deg); animation-delay: -2.4s; }
          .c5 { left: 29%; top: 9%; background: #ffca76; transform: rotate(55deg); animation-delay: -1.2s; }

          /* --- CSS สำหรับหน้า Terms & Conditions --- */
          .tc-container {
            margin: 0;
            width: 100%;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--cream) 0%, #fdf2f6 100%);
            font-family: "DM Sans", sans-serif;
            color: var(--ink);
            padding: 20px;
          }

          .tc-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 32px;
            padding: clamp(30px, 5vw, 50px);
            width: 100%;
            max-width: 800px;
            box-shadow: 0 20px 60px rgba(105, 103, 133, 0.15);
            animation: arrive 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) both;
            text-align: center;
          }

          /* ตัวสลับภาษาใน T&C */
          .tc-lang-switch {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .tc-lang-btn {
            background: transparent;
            border: 2px solid #e1e1e8;
            padding: 6px 16px;
            border-radius: 99px;
            font-size: 0.9rem;
            font-weight: 700;
            color: #77798c;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .tc-lang-btn.active {
            border-color: var(--blue-deep);
            background: rgba(149, 206, 244, 0.15);
            color: var(--blue-deep);
          }

          .tc-content-box {
            background: #f9f9fb;
            border: 1px solid #e1e1e8;
            border-radius: 16px;
            padding: 24px;
            max-height: 50vh;
            overflow-y: auto;
            margin-bottom: 24px;
            text-align: left;
            font-size: 0.95rem;
            line-height: 1.7;
            color: #4a4a5e;
          }

          .tc-content-box::-webkit-scrollbar { width: 6px; }
          .tc-content-box::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

          .tc-content-box ul, .tc-content-box ol {
            padding-left: 20px;
            margin: 12px 0;
          }

          .tc-content-box li {
            margin-bottom: 12px;
          }

          .checkbox-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            margin-bottom: 30px;
          }

          .checkbox-wrapper input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: var(--blue-deep);
            flex-shrink: 0;
          }

          .checkbox-text {
            font-size: 1rem;
            font-weight: 600;
            color: var(--ink);
            user-select: none;
          }

          .accept-button {
            background: var(--blue-deep);
            color: white;
            font-family: "DM Sans", sans-serif;
            font-weight: 700;
            font-size: 1.1rem;
            padding: 16px 40px;
            border: none;
            border-radius: 99px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(99, 174, 226, 0.3);
            transition: all 0.3s ease;
            width: 100%;
            max-width: 300px;
          }

          .accept-button:hover:not(:disabled) {
            background: var(--pink-deep);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(239, 101, 149, 0.4);
          }

          .accept-button:disabled {
            background: #d1d5db;
            color: #9ca3af;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
          }

          @keyframes arrive { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes cake-float { 50% { transform: translateY(-8px) rotate(-1deg); } }
          @keyframes shadow-pulse { 50% { transform: scaleX(.86); opacity: .7; } }
          @keyframes flicker { from { transform: rotate(40deg) scale(1); } to { transform: rotate(49deg) scale(.83, 1.12); } }
          @keyframes drift { 50% { transform: translateY(-17px) rotate(3deg); } }
          @keyframes confetti-dance { 50% { translate: 4px -11px; rotate: 18deg; } }

          @media (max-width: 600px) {
            .birthday-shell { padding: 17px; }
            .loading-card { border-radius: 30px; }
            .cake-stage { transform: scale(.85); margin-top: 2px; margin-bottom: -4px; }
            .balloon { transform: scale(.65); }
            .balloon-small { display: none; }
            .tc-card { padding: 30px 20px; border-radius: 24px; }
            .checkbox-text { font-size: 0.9rem; }
            .tc-content-box { font-size: 0.85rem; padding: 16px; max-height: 45vh; }
          }
        `}
      </style>

      {!isComplete ? (
        <div className="loading-container">
          <main className="birthday-shell" aria-labelledby="loading-title">
            <div className="balloon balloon-pink" aria-hidden="true"></div>
            <div className="balloon balloon-blue" aria-hidden="true"></div>
            <div className="balloon balloon-small" aria-hidden="true"></div>
            <span className="confetti c1" aria-hidden="true"></span>
            <span className="confetti c2" aria-hidden="true"></span>
            <span className="confetti c3" aria-hidden="true"></span>
            <span className="confetti c4" aria-hidden="true"></span>
            <span className="confetti c5" aria-hidden="true"></span>
            
            <section className="loading-card" aria-live="polite">
              <header>
                <p className="celebration-tag">One More Step</p>
                <h1 id="loading-title" className="title">Hongshi Day 2026</h1>
                <p className="message">Preparing the celebration...</p>
              </header>
              
              <div className="cake-stage" aria-hidden="true">
                <div className="cake-shadow"></div>
                <div className="plate"></div>
                <div className="cake-base"></div>
                <div className="frosting"></div>
                <div className="candle"></div>
                <div className="flame"></div>
                <span className="sprinkle one"></span>
                <span className="sprinkle two"></span>
                <span className="sprinkle three"></span>
                <span className="sprinkle four"></span>
              </div>
              
              <section className="progress-area" aria-label="Loading progress">
                <div className="progress-meta">
                  <span>Preparing surprises</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="loading-status">Getting things ready...</p>
              </section>
            </section>
          </main>
        </div>
      ) : (
        <div className="tc-container">
          <main className="tc-card">
            <h2 className="title" style={{ marginTop: 0, marginBottom: '8px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
              {tcLang === 'th' ? 'ข้อตกลงและเงื่อนไขการใช้งาน' : 'Terms and Conditions'}
            </h2>
            <p className="message" style={{ marginBottom: '20px', fontWeight: '500' }}>
              {tcLang === 'th' ? 'สำหรับเว็บไซต์ ONE MORE STEP with HONGSHI' : 'for ONE MORE STEP with HONGSHI website'}
            </p>

            {/* ส่วนสลับภาษา */}
            <div className="tc-lang-switch">
              <button 
                className={`tc-lang-btn ${tcLang === 'th' ? 'active' : ''}`}
                onClick={() => setTcLang('th')}
              >
                TH
              </button>
              <button 
                className={`tc-lang-btn ${tcLang === 'en' ? 'active' : ''}`}
                onClick={() => setTcLang('en')}
              >
                EN
              </button>
            </div>

            <div className="tc-content-box">
              {tcLang === 'th' ? (
                <>
                  <p className="mb-4">
                    ยินดีต้อนรับเข้าสู่เว็บไซต์ <strong>ONE MORE STEP with HONGSHI</strong> การที่คุณเข้าใช้งานเว็บไซต์นี้ ถือว่าคุณได้ยอมรับข้อตกลงและเงื่อนไขต่างๆ ดังต่อไปนี้:
                  </p>
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong>วัตถุประสงค์ของเว็บไซต์</strong><br />
                      เว็บไซต์นี้เป็นส่วนหนึ่งของโปรเจควันเกิดเพื่อร่วมเฉลิมฉลองและรวบรวมความทรงจำดีๆ ให้กับ HONGSHI จัดทำขึ้นโดยแฟนคลับ และไม่มีวัตถุประสงค์เพื่อการค้าหรือแสวงหาผลกำไรในเชิงพาณิชย์แต่อย่างใด
                    </li>
                    <li>
                      <strong>ทรัพย์สินทางปัญญาและลิขสิทธิ์</strong><br />
                      ภาพถ่าย วิดีโอ กราฟิก โค้ด และเนื้อหาต่างๆ ที่ปรากฏบนเว็บไซต์นี้ ส่วนหนึ่งจัดทำขึ้นโดยทีมงานผู้จัดทำโปรเจค และบางส่วนอาจเป็นภาพของ HONGSHI ซึ่งลิขสิทธิ์ยังคงเป็นของเจ้าของภาพ ต้นสังกัด หรือผู้สร้างสรรค์ผลงานนั้นๆ ทางเรานำมาใช้เพื่อการโปรโมทและสนับสนุนด้วยความชื่นชอบเท่านั้น<br />
                      <span className="text-red-500 font-medium">ไม่อนุญาต</span> ให้นำภาพกราฟิก ผลงานศิลปะ (Fanart) หรือเนื้อหาที่สร้างสรรค์โดยทีมงานจากเว็บไซต์นี้ ไปดัดแปลง ทำซ้ำ หรือใช้ในเชิงพาณิชย์โดยเด็ดขาด หากต้องการนำไปแชร์ต่อ กรุณาให้เครดิตเว็บไซต์และโปรเจคของเรา
                    </li>
                    <li>
                      <strong>การใช้งานที่เหมาะสม</strong><br />
                      ผู้ใช้งานตกลงที่จะใช้เว็บไซต์นี้อย่างสร้างสรรค์ และจะไม่กระทำการใดๆ ที่อาจก่อให้เกิดความเสียหายต่อเว็บไซต์ ต่อผู้ใช้งานท่านอื่น หรือต่อ HONGSHI รวมถึงไม่ส่งข้อความสแปม ข้อความหยาบคาย หรือข้อความที่ผิดกฎหมาย/สร้างความเกลียดชังเข้ามาในระบบของเว็บไซต์
                    </li>
                    <li>
                      <strong>การเก็บรวบรวมข้อมูล</strong><br />
                      หากคุณร่วมกิจกรรมส่งข้อความอวยพรหรือลงชื่อร่วมโปรเจค ข้อมูลที่คุณระบุ (เช่น ชื่อ นามแฝง หรือข้อความ) จะถูกนำมาแสดงผลบนเว็บไซต์ตามวัตถุประสงค์ของโปรเจคเท่านั้น ทางทีมงานจะไม่มีการนำข้อมูลของคุณไปใช้ในเชิงพาณิชย์หรือนำไปแสวงหาผลประโยชน์อื่นใดเด็ดขาด
                    </li>
                    <li>
                      <strong>การติดต่อทีมงาน</strong><br />
                      หากมีข้อสงสัย พบปัญหาในการใช้งานเว็บไซต์ หรือต้องการแจ้งลบข้อมูล/ข้อความของคุณ สามารถติดต่อทีมงานได้ทางอีเมล: <a href="mailto:help.omswh@icloud.com" className="text-blue-500 hover:underline">help.omswh@icloud.com</a>
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Welcome to the <strong>ONE MORE STEP with HONGSHI</strong> website. By accessing and using this website, you agree to comply with the following terms and conditions:
                  </p>
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong>Purpose of the Website</strong><br />
                      This website is part of a birthday project created by fans to celebrate and gather good memories for HONGSHI. It is strictly non-profit and not intended for commercial use.
                    </li>
                    <li>
                      <strong>Intellectual Property and Copyright</strong><br />
                      The photos, videos, graphics, code, and other content on this website are partly created by the project team, and some may include images of HONGSHI, whose copyrights belong to the respective owners, agencies, or creators. We use them solely for promotion and support out of admiration.<br />
                      <span className="text-red-500 font-medium">It is strictly prohibited</span> to modify, reproduce, or use the graphics, fanart, or any creative content made by the team for commercial purposes. If you wish to share them, please credit our website and project.
                    </li>
                    <li>
                      <strong>Appropriate Usage</strong><br />
                      Users agree to use this website constructively and will not engage in any actions that may cause harm to the website, other users, or HONGSHI. This includes refraining from sending spam, profanity, illegal, or hateful messages into the website's system.
                    </li>
                    <li>
                      <strong>Data Collection</strong><br />
                      If you participate in sending wishes or signing the project, the information you provide (e.g., name, alias, or message) will be displayed on the website solely for the project's purposes. The team will never use your data commercially or for any other benefits.
                    </li>
                    <li>
                      <strong>Contact the Team</strong><br />
                      If you have any questions, encounter issues using the website, or wish to request the removal of your data/messages, you can contact the team via email: <a href="mailto:help.omswh@icloud.com" className="text-blue-500 hover:underline">help.omswh@icloud.com</a>
                    </li>
                  </ol>
                </>
              )}
            </div>

            <label className="checkbox-wrapper">
              <input 
                type="checkbox" 
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span className="checkbox-text">
                {tcLang === 'th' ? 'ฉันได้อ่านและยอมรับข้อตกลงและเงื่อนไขต่างๆ ข้างต้นแล้ว' : 'I have read and agree to the terms and conditions above.'}
              </span>
            </label>

            <button 
              className="accept-button" 
              disabled={!isAgreed}
              onClick={handleAcceptTerms}
            >
              {tcLang === 'th' ? 'เข้าสู่เว็บไซต์' : 'Enter Website'}
            </button>
          </main>
        </div>
      )}
    </>
  );
}