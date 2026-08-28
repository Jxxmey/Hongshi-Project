import ProtectedImage from '../components/ProtectedImage';
import ScrollReveal from '../components/ScrollReveal';

// ไอคอน SVG สำหรับ Social Media
const IconIG = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
);
const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
);

export default function ArtistProfile() {
  const hoshiTags = [
    "กินไอศกรีม 2 แกลลอนคนเดียว! 🍨", "พกช้อนส่วนตัว 🥄", "Pop Culture Geek (Kaiju No. 8) 👾",
    "อิน Inazuma Eleven ⚽", "เป็นคนขี้กังวล (Worrywart) 🥺", "ไม่ใช่คนตื่นเช้า 🛌",
    "ชอบกลิ่นอายสนามบิน ✈️", "เกลียดเสียงเล็บขูดกระดาษ 💅📄", "อยากเลี้ยงตุ่นปากเป็ด 🦆",
    "ไอดอลคือ 'IU' 🎵", "สาย K-indie / K-R&B 🎧", "รักการถ่ายภาพฟิล์ม 📸"
  ];

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-20 selection:bg-azalea selection:text-white pb-20">

      {/* 1. Header & Intro */}
      <ScrollReveal>
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-navy tracking-wider">HONGSHI</h1>
          <p className="text-xl md:text-2xl font-heading text-navy/80">
            จากเด็กหนุ่มผู้หลงใหลในการเต้น สู่ศิลปินและโปรดิวเซอร์รุ่นใหม่แห่งวงการ T-Pop
          </p>
          <p className="font-body text-navy/70 max-w-3xl mx-auto leading-relaxed">
            พิเชฐพงศ์ จิรเดชสกุลวงศ์ หรือ "ฮงชิ" (HONGSHI) คือนิยามของศิลปินประเภท <strong>All-Rounder</strong> อย่างแท้จริง ภายใต้สังกัด RISER MUSIC และ GMMTV เขาผสมผสานทักษะทั้งการเต้น การแร็ป การร้อง การแต่งเพลง และการแสดงเข้าไว้ด้วยกันอย่างลงตัว
          </p>
        </section>
      </ScrollReveal>

      {/* 2. Profile Card & Demographics (ธีมสว่างสไตล์ Polaroid) */}
      <ScrollReveal delay={200}>
        <section className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* ด้านซ้าย: การ์ดโปรไฟล์ */}
          <div className="md:col-span-5 flex justify-center w-full">
            <div className="group w-full max-w-[320px] flex flex-col bg-white p-3 rounded-3xl shadow-lg border-2 border-palepink hover:border-azalea hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              
              {/* ส่วนรูปภาพ (มีกรอบโค้งมนนิดๆ ให้อยู่ในการ์ด) */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-beige">
                <div className="w-full h-full [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-top group-hover:scale-105 transition-transform duration-700 ease-out">
                  <ProtectedImage apiEndpoint="/assets/profile.jpg" altText="Hong Profile" />
                </div>
              </div>

              {/* ส่วนข้อมูลในการ์ด */}
              <div className="relative z-20 flex flex-col flex-1 pt-5 pb-2 px-2 font-body">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-heading font-black text-navy leading-tight tracking-widest">
                    HONG
                  </h3>
                  <p className="text-[11px] sm:text-xs text-azalea font-bold mt-1 truncate">
                    Pichetpong Chiradatesakunvong
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-navy/70 mt-1">
                    ฮง : พิเชฐพงศ์ จิรเดชสกุลวงศ์
                  </p>
                </div>

                {/* กล่องข้อมูลสัดส่วน (สลับสีให้อ่านง่ายบนพื้นขาว) */}
                <div className="flex flex-col gap-2 text-[11px] sm:text-xs text-navy/80 mb-5 bg-beige/40 p-3 rounded-xl border border-skyblue/30">
                  <div className="flex justify-between border-b border-skyblue/30 pb-1">
                    <span className="text-navy font-bold">DOB</span>
                    <span>16 October 2003</span>
                  </div>
                  <div className="flex justify-between border-b border-skyblue/30 pb-1">
                    <span className="text-navy font-bold">HEIGHT</span>
                    <span>178 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy font-bold">WEIGHT</span>
                    <span>68 kg (Group O)</span>
                  </div>
                </div>

                {/* ปุ่ม Social Media */}
                <div className="flex flex-col gap-2 mt-auto">
                  <a href="https://www.instagram.com/hongshihoshi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 bg-skyblue rounded-lg text-navy text-xs font-bold hover:bg-azalea hover:text-white transition-all shadow-sm">
                    <IconIG /> hongshihoshi
                  </a>
                  <div className="flex gap-2 w-full">
                    <a href="https://twitter.com/hongshihoshi03" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 flex-1 py-2 bg-palepink rounded-lg text-navy text-[10px] font-bold hover:bg-azalea hover:text-white transition-all shadow-sm">
                      <IconX /> hongshihoshi03
                    </a>
                    <a href="https://www.tiktok.com/@hongshihoshi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 flex-1 py-2 bg-palepink rounded-lg text-navy text-[10px] font-bold hover:bg-azalea hover:text-white transition-all shadow-sm">
                      <IconTikTok /> hongshihoshi
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ด้านขวา: ข้อมูลเพิ่มเติมและ Tags */}
          <div className="md:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-sm border-t-8 border-skyblue space-y-6 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-heading font-bold text-navy border-b-2 border-palepink pb-3 inline-block self-start">
              📝 Demographics
            </h3>
            
            <div className="space-y-4 font-body text-navy/90 text-sm md:text-base">
              <p><strong>AKA:</strong> Hong (ฮง), HONGSHI (ฮงชิ), Hong LYKN</p>
              <p><strong>Education:</strong> โรงเรียนสวนกุหลาบวิทยาลัย, สถาบันนวัตกรรมบูรณาการ จุฬาฯ (BAScii)</p>
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                  <span className="text-xl">🍦</span> The Real HONGSHI
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hoshiTags.map((tag, index) => (
                    <span key={index} className="bg-beige/60 text-navy text-xs font-bold px-3 py-1.5 rounded-full border border-skyblue/30 hover:bg-azalea hover:text-white hover:border-azalea transition-colors duration-300 cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a href="https://www.instagram.com/introduction2youth" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-skyblue text-navy px-5 py-2.5 text-sm font-bold rounded-full hover:bg-azalea hover:text-white transition-colors shadow-sm">
                📸 Photo Gallery (introduction2youth)
              </a>
            </div>
          </div>

        </section>
      </ScrollReveal>

      {/* 3. The Journey to Stardom */}
      <ScrollReveal delay={200}>
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-navy">🚀 The Journey to Stardom</h2>
          </div>

          <div className="border-l-4 border-skyblue ml-4 md:ml-[50%] space-y-10 py-4 font-body">
            {[
              { date: "วัยมัธยม (อายุ 14 ปี)", title: "จุดเริ่มต้นจากสายเต้น", desc: "เริ่มต้นฝึกฝนการเต้นฮิปฮอปอย่างจริงจัง เป็นเชียร์ลีดเดอร์ นักเต้นโรงเรียน" },
              { date: "ธันวาคม 2565", title: "Project Alpha", desc: "ก้าวเข้าสู่รายการเซอร์ไวเวิล ค้นพบศักยภาพ 'การแร็ป' พัฒนาตัวเองอย่างก้าวกระโดดจนคว้าอันดับ 4" },
              { date: "พฤษภาคม 2566", title: "เดบิวต์วง LYKN", desc: "เปิดตัวอย่างเป็นทางการในฐานะ แร็ปเปอร์หลักและนักเต้นนำ สร้างปรากฏการณ์ความนิยมร่วมกับเมมเบอร์ ภายใต้ค่าย RISER MUSIC" },
              { date: "เมษายน 2569", title: "Soloist & Producer", desc: "เปิดตัวซิงเกิลเดี่ยว 'ถูกสเปก' ก้าวขึ้นมารับตำแหน่งผู้ช่วยโปรดิวเซอร์ คิดทำนองและเขียนเนื้อร้องทั้งหมดด้วยตัวเอง" }
            ].map((item, i) => (
              <div key={i} className={`relative pl-8 md:pl-0 ${i % 2 === 0 ? 'md:-ml-[50%] md:pr-12 md:text-right' : 'md:ml-[0%] md:pl-12'} w-full md:w-[50%]`}>
                <div className={`absolute w-5 h-5 bg-skyblue rounded-full -left-[10.5px] ${i % 2 === 0 ? 'md:left-[100%] md:-ml-[10.5px]' : ''} top-1 border-4 border-white shadow-sm`}></div>
                <p className="text-sm font-bold text-azalea mb-1">{item.date}</p>
                <h4 className="text-xl font-bold text-navy">{item.title}</h4>
                <p className="text-navy mt-2 bg-white p-4 rounded-xl shadow-sm inline-block">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Music & Masterpieces */}
      <ScrollReveal delay={200}>
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center space-y-8 border-2 border-skyblue/30">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-bold text-navy">🎧 Music & Masterpieces</h2>
            <p className="font-body text-navy/80">ไม่ใช่แค่ Performer แต่เขาคือ "Creator" ที่อยู่เบื้องหลังดนตรี</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 font-body text-left">
            <div className="bg-beige/40 p-6 rounded-2xl border-l-4 border-skyblue hover:shadow-md transition">
              <span className="text-3xl mb-3 block">🎵</span>
              <h4 className="text-lg font-bold text-navy mb-2">ถูกสเปก (Let's Go)</h4>
              <p className="text-sm text-navy/80">Solo Debut แนว Romantic Hip-Hop ที่ฮงเขียนเนื้อเองทั้งหมด กวาดยอดวิวทะลุ 5.1 ล้านครั้งบน YouTube</p>
            </div>
            <div className="bg-beige/40 p-6 rounded-2xl border-l-4 border-azalea hover:shadow-md transition">
              <span className="text-3xl mb-3 block">🔥</span>
              <h4 className="text-lg font-bold text-navy mb-2">โฮ่ง! (SUGOI)</h4>
              <p className="text-sm text-navy/80">ซิงเกิลสไตล์ Electronic Hip-hop ที่ฮงมีส่วนร่วมเป็นผู้ช่วยเขียนเนื้อเพลง (ได้รับโหวตความนิยมสูงถึง 14%)</p>
            </div>
            <div className="bg-beige/40 p-6 rounded-2xl border-l-4 border-palepink hover:shadow-md transition">
              <span className="text-3xl mb-3 block">✍️</span>
              <h4 className="text-lg font-bold text-navy mb-2">ทัก & หยอกไม่หลอก</h4>
              <p className="text-sm text-navy/80">ผลงานที่ได้รับความไว้วางใจให้ร่วมแต่งเนื้อร้องและท่อนแร็ป สะท้อนศักยภาพด้านดนตรีที่เติบโตขึ้นอย่างชัดเจน</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. On Screen Universe */}
      <ScrollReveal delay={200}>
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-navy">🎬 On Screen Universe</h2>
            <p className="font-body text-navy/80 mt-2">พิสูจน์เสน่ห์ทางการแสดงผ่านหน้าจอซีรีส์และรายการ</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 font-body">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-skyblue flex gap-4 items-start">
              <span className="text-4xl">🖤</span>
              <div>
                <h4 className="text-lg font-bold text-navy">Thame•Po (เธม•โป้) (2567)</h4>
                <p className="text-sm text-navy/80 mt-1">รับบท "ดีแลน" (Dylan) แร็ปเปอร์มาดขรึมแห่งวง MARS ความเย็นชาและไม่แยแสกลายเป็นจุดแข็งที่ตกแฟนๆ ได้มหาศาล</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-azalea flex gap-4 items-start">
              <span className="text-4xl">📺</span>
              <div>
                <h4 className="text-lg font-bold text-navy">Shows & Guest Roles</h4>
                <p className="text-sm text-navy/80 mt-1">นักแสดงรับเชิญใน <i>I Love 'A Lot Of' You (2568)</i> และร่วมรายการ Alpha Lab, LYKN LANDING, School Rangers</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. Series Spotlight Twenty One */}
      <ScrollReveal delay={200}>
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm space-y-8 border-t-8 border-azalea">
          <div className="text-center space-y-3">
            <span className="bg-palepink text-navy px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              GMMTV 2026 Flagship Project
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-navy">
              ซีรีส์ "Twenty One 21 วัน ลองมารักกันดูไหม"
            </h3>
            <p className="text-navy/80 font-body max-w-3xl mx-auto leading-relaxed">
              การบรรจบกันของสัญญะทางดนตรี จิตวิทยาความสัมพันธ์ และวิวัฒนาการอุตสาหกรรมวายไทย ผลงานการกำกับโดย <strong>"เอ็กซ์-ณัฐพงษ์ มงคลสวัสดิ์"</strong> นำแสดงโดยคู่ขวัญ <em>จูเนียร์-ปณชัย</em> และ <em>มาร์ค-จิรันธนิน</em> พร้อมด้วยทัพนักแสดง โดยฮงชิได้รับโอกาสร่วมแสดงในบทบาทสนับสนุนเป็น <strong>"ไนท์" (Night)</strong> ซึ่งสอดคล้องกับภาพของเขาในฐานะ <strong>"มือเบส"</strong> ของวงดนตรีในเรื่อง ตอกย้ำความสำคัญในเส้นเรื่องย่อย (Sub-plot) ด้านมิตรภาพและเสียงเพลง
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/kqiruuXSplM?si=92RFSbLZIIO3BdSZ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          <div className="grid md:grid-cols-2 gap-6 font-body pt-4">
            <div className="bg-beige/40 p-6 rounded-2xl border-l-4 border-skyblue space-y-3">
              <h4 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
                <span>📖</span> ถอดรหัสโครงเรื่อง & จิตวิทยาความสัมพันธ์
              </h4>
              <p className="text-navy/80 text-sm leading-relaxed">
                จากนวนิยายออนไลน์ยอดนิยมของ <strong>"แป้งเอง" (PangEng)</strong> บน ReadAWrite เล่าเรื่องราวของ <em>"อ้าย"</em> และ <em>"คูณ"</em> ที่อกหักจากคนคนเดียวกัน สู่ความสัมพันธ์เยียวยาร่วมกัน (Shared Trauma) และการตัดสินใจทดลองคบกัน 21 วัน ท่ามกลางความรักที่ไม่เท่าเทียม เมื่อคนหนึ่งทุ่มเทหมดหัวใจ แต่อีกคนเพียงใช้เป็นเครื่องเหนี่ยวรั้งความคุ้นเคย
              </p>
            </div>

            <div className="bg-beige/40 p-6 rounded-2xl border-l-4 border-azalea space-y-3">
              <h4 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
                <span>🎵</span> สัญญะทางดนตรี & เบื้องหลังงานสร้าง
              </h4>
              <p className="text-navy/80 text-sm leading-relaxed">
                ชื่อตอนในนวนิยายถูกร้อยเรียงผ่านคอร์ดดนตรี (Chord C, Am, Capo) เพื่อสื่อสภาวะอารมณ์ของตัวละคร โดยมีวงดนตรีเป็นตัวเร่งปฏิกิริยาความสัมพันธ์ ซึ่งโปรเจกต์นี้การันตีคุณภาพระดับสูงโดย <em>เอ็กซ์-ณัฐพงษ์</em> ผู้กำกับมือฉมังแห่ง GMMTV
              </p>
            </div>
          </div>

          <div className="bg-palepink/40 p-6 md:p-8 rounded-2xl border-2 border-white space-y-3 font-body">
            <h4 className="text-xl font-heading font-bold text-navy text-center flex items-center justify-center gap-2">
              <span>💡</span> ทฤษฎี 21 วัน กับภาพลวงตาของการสร้างความรัก
            </h4>
            <p className="text-navy/80 text-sm leading-relaxed text-center max-w-3xl mx-auto">
              ทฤษฎี 21 วันของ นพ.แมกซ์เวลล์ มอลตซ์ อาจใช้ได้กับการสร้างนิสัยทางกายภาพ แต่เมื่อนำมาใช้กับหัวใจ ทฤษฎีนี้กลับกลายเป็น <em>"นาฬิกาจับเวลาของความเจ็บปวด"</em> สะท้อนความเปราะบางของมนุษย์ที่กลัวความโดดเดี่ยว จนยอมสร้างพันธะแบบตัวแทน ซึ่งเตรียมมาสะเทือนอารมณ์ผู้ชมทั่วโลกในปี 2026 นี้
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. 2026 Mega Projects */}
      <ScrollReveal delay={200}>
        <section className="bg-palepink p-8 md:p-12 rounded-3xl shadow-sm text-center space-y-8 border-4 border-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-bold text-navy">🔥 2026 Mega Projects</h2>
            <p className="font-body text-navy/80">ก้าวต่อไปที่โลกต้องจับตา</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 font-body text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition duration-300">
              <span className="text-3xl mb-3 block">📺</span>
              <h4 className="text-lg font-bold text-navy mb-2">21 วัน ลองมารักกันดูไหม</h4>
              <p className="text-sm text-navy/80">ซีรีส์โปรเจกต์ฟอร์มยักษ์ GMMTV 2026 รับบทเป็น "ไนท์" มือเบสของวง ประชันบทบาทกับทีมนักแสดงวัยรุ่นมากฝีมือ</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition duration-300">
              <span className="text-3xl mb-3 block">🌍</span>
              <h4 className="text-lg font-bold text-navy mb-2">DUSK & DAWN WORLD TOUR</h4>
              <p className="text-sm text-navy/80">ทัวร์ข้าม 3 ทวีป บุกเบิกตลาด วอร์ซอ, เบอร์ลิน, ปารีส, นิวยอร์ก, ซานฟรานซิสโก, โตเกียว ฯลฯ</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition duration-300">
              <span className="text-3xl mb-3 block">🏆</span>
              <h4 className="text-lg font-bold text-navy mb-2">Best Boy Group of the Year</h4>
              <p className="text-sm text-navy/80">การันตีความสำเร็จ นำพาวงคว้ารางวัลเกียรติยศสูงสุดจากเวที The Guitar Mag Awards 2025</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}