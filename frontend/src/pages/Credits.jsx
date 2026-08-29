import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext'; // ดึงระบบ 2 ภาษามาใช้

export default function Credits() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const hashtags = "#HappyHongshihoshiDay2026 #Hongshihoshi #LYKN";

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const teamMembers = [
    { handle: "@pumpkin_NT", link: "https://x.com/pumpkin_NT" },
    { handle: "@Jaiidees", link: "https://x.com/Jaiidees" },
    { handle: "@benjycoffee", link: "https://x.com/benjycoffee" },
    { handle: "@PpuangthongG", link: "https://x.com/PpuangthongG" }
  ];

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-16 selection:bg-azalea selection:text-white pb-20">
      
      {/* 1. Header */}
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">{t.credits.title}</h2>
          <p className="text-lg font-body text-navy/80">{t.credits.subtitle}</p>
        </div>
      </ScrollReveal>

      {/* 2. Hashtags Section */}
      <ScrollReveal delay={150}>
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center space-y-6 border-t-8 border-skyblue hover:shadow-md transition-shadow duration-300">
          <h3 className="text-2xl font-heading font-bold text-navy">{t.credits.hashtagTitle}</h3>
          <p className="font-body text-navy/80">{t.credits.hashtagDesc}</p>
          
          <div className="bg-beige p-6 rounded-2xl border-2 border-dashed border-skyblue">
            <p className="text-xl md:text-2xl font-heading font-bold text-navy">{hashtags}</p>
          </div>

          <button onClick={handleCopyHashtags}
            className="font-heading font-bold px-8 py-3 rounded-full shadow-sm transition-all duration-300 bg-skyblue text-navy hover:bg-azalea hover:text-white hover:-translate-y-1">
            {copied ? t.credits.copiedBtn : t.credits.copyBtn}
          </button>
        </section>
      </ScrollReveal>

      {/* 3. Team & Thanks Section */}
      <ScrollReveal delay={300}>
        <section className="space-y-6">
          <h3 className="text-2xl font-heading font-bold text-navy text-center mb-8">{t.credits.teamTitle}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center gap-3 border-b-4 border-palepink hover:border-azalea transition-all hover:-translate-y-1 duration-300">
                <span className="text-3xl">🍦</span>
                <p className="text-sm font-bold text-navy">{t.credits.memberRole}</p>
                <a href={member.link} target="_blank" rel="noreferrer" 
                  className="bg-skyblue text-navy font-bold px-3 py-2 rounded-full text-xs hover:bg-azalea hover:text-white transition-colors w-full shadow-sm">
                  X: {member.handle}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-8 md:p-10 rounded-3xl shadow-sm text-center space-y-4 border-t-8 border-azalea hover:shadow-md transition-shadow duration-300">
            <span className="text-5xl block animate-pulse">💖</span>
            <h4 className="text-2xl font-heading font-bold text-navy">{t.credits.thanksTitle}</h4>
            <p className="text-navy/80 font-body max-w-2xl mx-auto leading-relaxed">
              {t.credits.thanksDesc}
            </p>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}