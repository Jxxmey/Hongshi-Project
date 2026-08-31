import { createContext, useState, useContext } from 'react';

// คลังคำแปลภาษาแบบครบทุกหน้า
export const translations = {
  th: {
    nav: {
      home: 'หน้าแรก',
      profile: 'รู้จักฮงชิ',
      project: 'รายละเอียด',
      guestbook: 'อวยพรวันเกิด',
      faq: 'ถาม-ตอบ',
      terms: 'ข้อกำหนด',
    },
    home: {
      welcome: 'ยินดีต้อนรับสู่โปรเจกต์วันเกิด',
      title: 'ONE MORE STEP with HONGSHI',
      subtitle: 'มาร่วมส่งความรักและฉลองวันเกิดครบรอบ 23 ปี ให้กับ "ฮงชิ" ไปด้วยกันนะครับ 🩵',
      enterBtn: 'เข้าสู่เว็บไซต์',
      date: '16 ตุลาคม 2026'
    },
    project: {
      title: 'รายละเอียดโปรเจกต์',
      subtitle: 'พิกัดคาเฟ่และรายละเอียดกิจกรรมสำหรับวันเกิดฮงชิ',
      eventTitle: '📅 รายละเอียดกิจกรรม',
      cafeEvent: 'Birthday Cafe Event',
      eventDate: '16 - 18 ตุลาคม 2026',
      locationLabel: 'สถานที่:',
      cafeName: 'Solrise Cafe',
      mapTitle: '📍 พิกัดคาเฟ่ (Solrise Cafe)',
      mapBtn: '🗺️ เปิดนำทางใน Google Maps',
      giveawayTitle: '🎁 ของที่ระลึก (Giveaways)',
      tba: 'รออัปเดต'
    },
    guestbook: {
      title: 'Birthday Wishes Board',
      subtitle: 'คำอวยพรจาก LYKYOU จะลอยมาส่งถึงฮงชิเรื่อยๆ 💌',
      waiting: 'กำลังรอข้อความอวยพรแรก... ✨',
      sendBtn: 'เขียนคำอวยพร',
      modalTitle: 'ส่งคำอวยพร',
      nameLabel: 'ชื่อ / แอคเคานต์ (Name)',
      namePlaceholder: 'เช่น @hongshihoshi_fan',
      msgLabel: 'คำอวยพรถึงฮงชิ (Message)',
      msgPlaceholder: 'พิมพ์ข้อความอวยพรน่ารักๆ ของคุณที่นี่...',
      submitBtn: '🚀 ส่งข้อความ',
      submitting: 'กำลังส่งความรัก... 💌',
      successTitle: 'ส่งคำอวยพรสำเร็จ!',
      successDesc: 'ข้อความของคุณลอยไปหาฮงชิแล้วครับ ✨'
    },
    profile: {
      title: 'HONGSHI',
      subtitle: 'จากเด็กหนุ่มผู้หลงใหลในการเต้น สู่ศิลปินและโปรดิวเซอร์รุ่นใหม่แห่งวงการ T-Pop',
      desc: 'พิเชฐพงศ์ จิรเดชสกุลวงศ์ หรือ "ฮงชิ" (HONGSHI) คือนิยามของศิลปินประเภท <strong>All-Rounder</strong> อย่างแท้จริง ภายใต้สังกัด RISER MUSIC และ GMMTV เขาผสมผสานทักษะทั้งการเต้น การแร็ป การร้อง การแต่งเพลง และการแสดงเข้าไว้ด้วยกันอย่างลงตัว',
      aka: 'Hong (ฮง), HONGSHI (ฮงชิ), Hong LYKN',
      edu: 'โรงเรียนสวนกุหลาบวิทยาลัย, สถาบันนวัตกรรมบูรณาการ จุฬาฯ (BAScii)',
      journeyTitle: '🚀 The Journey to Stardom',
      journeySteps: [
        { date: "วัยมัธยม (อายุ 14 ปี)", title: "จุดเริ่มต้นจากสายเต้น", desc: "เริ่มต้นฝึกฝนการเต้นฮิปฮอปอย่างจริงจัง เป็นเชียร์ลีดเดอร์ นักเต้นโรงเรียน" },
        { date: "ธันวาคม 2565", title: "Project Alpha", desc: "ก้าวเข้าสู่รายการเซอร์ไวเวิล ค้นพบศักยภาพ 'การแร็ป' พัฒนาตัวเองอย่างก้าวกระโดดจนคว้าอันดับ 4" },
        { date: "พฤษภาคม 2566", title: "เดบิวต์วง LYKN", desc: "เปิดตัวอย่างเป็นทางการในฐานะ แร็ปเปอร์หลักและนักเต้นนำ สร้างปรากฏการณ์ความนิยมร่วมกับเมมเบอร์ ภายใต้ค่าย RISER MUSIC" },
        { date: "เมษายน 2569", title: "Soloist & Producer", desc: "เปิดตัวซิงเกิลเดี่ยว 'ถูกสเปก' ก้าวขึ้นมารับตำแหน่งผู้ช่วยโปรดิวเซอร์ คิดทำนองและเขียนเนื้อร้องทั้งหมดด้วยตัวเอง" }
      ],
      musicTitle: '🎧 Music & Masterpieces',
      musicSubtitle: 'ไม่ใช่แค่ Performer แต่เขาคือ "Creator" ที่อยู่เบื้องหลังดนตรี',
      songs: [
        { emoji: "🎵", title: "ถูกสเปก (Let's Go)", desc: "Solo Debut แนว Romantic Hip-Hop ที่ฮงเขียนเนื้อเองทั้งหมด กวาดยอดวิวทะลุ 5.1 ล้านครั้งบน YouTube" },
        { emoji: "🔥", title: "โฮ่ง! (SUGOI)", desc: "ซิงเกิลสไตล์ Electronic Hip-hop ที่ฮงมีส่วนร่วมเป็นผู้ช่วยเขียนเนื้อเพลง (ได้รับโหวตความนิยมสูงถึง 14%)" },
        { emoji: "✍️", title: "ทัก (Hi!)", desc: "ผลงานที่ได้รับความไว้วางใจให้ร่วมแต่งเนื้อร้องและท่อนแร็ป สะท้อนศักยภาพด้านดนตรีที่เติบโตขึ้นอย่างชัดเจน" },
        { emoji: "😉", title: "หยอกไม่หลอก (หยอกหยอก)", desc: "อีกหนึ่งผลงานคุณภาพที่ได้รับความนิยม สะท้อนความสามารถที่หลากหลาย" }
      ],
      screenTitle: '🎬 On Screen Universe',
      screenSubtitle: 'พิสูจน์เสน่ห์ทางการแสดงผ่านหน้าจอซีรีส์และรายการ',
      screenItems: [
        { emoji: "🖤", title: "Thame•Po (เธม•โป้) (2567)", desc: "รับบท 'ดีแลน' (Dylan) แร็ปเปอร์มาดขรึมแห่งวง MARS ความเย็นชาและไม่แยแสกลายเป็นจุดแข็งที่ตกแฟนๆ ได้มหาศาล" },
        { emoji: "📺", title: "Shows & Guest Roles", desc: "นักแสดงรับเชิญใน I Love 'A Lot Of' You (2568) และร่วมรายการ Alpha Lab, LYKN LANDING, School Rangers" }
      ],
      megaTitle: '🔥 2026 Mega Projects',
      megaSubtitle: 'ก้าวต่อไปที่โลกต้องจับตา',
      megaItems: [
        { emoji: "📺", title: "21 วัน ลองมารักกันดูไหม", desc: "ซีรีส์โปรเจกต์ฟอร์มยักษ์ GMMTV 2026 รับบทเป็น 'ไนท์' มือเบสของวง ประชันบทบาทกับทีมนักแสดงวัยรุ่นมากฝีมือ" },
        { emoji: "🌍", title: "DUSK & DAWN WORLD TOUR", desc: "ทัวร์ข้าม 3 ทวีป บุกเบิกตลาด วอร์ซอ, เบอร์ลิน, ปารีส, นิวยอร์ก, ซานฟรานซิสโก, โตเกียว ฯลฯ" },
        { emoji: "🏆", title: "Best Boy Group of the Year", desc: "การันตีความสำเร็จ นำพาวงคว้ารางวัลเกียรติยศสูงสุดจากเวที The Guitar Mag Awards 2025" }
      ],
      tags: [
        "กินไอศกรีม 2 แกลลอนคนเดียว! 🍨", "พกช้อนส่วนตัว 🥄", "Pop Culture Geek (Kaiju No. 8) 👾",
        "อิน Inazuma Eleven ⚽", "เป็นคนขี้กังวล (Worrywart) 🥺", "ไม่ใช่คนตื่นเช้า 🛌",
        "ชอบกลิ่นอายสนามบิน ✈️", "เกลียดเสียงเล็บขูดกระดาษ 💅📄", "อยากเลี้ยงตุ่นปากเป็ด 🦆",
        "ไอดอลคือ 'IU' 🎵", "สาย K-indie / K-R&B 🎧", "รักการถ่ายภาพฟิล์ม 📸"
      ]
    },
    credits: {
      title: 'Credits & Contact',
      subtitle: 'ขอขอบคุณทุกการสนับสนุนที่ทำให้โปรเจกต์วันเกิดนี้เกิดขึ้น 🩵',
      hashtagTitle: '🏷️ มาร่วมอวยพรวันเกิดฮงชิกัน!',
      hashtagDesc: 'อย่าลืมติดแฮชแท็กเหล่านี้ในโพสต์ของคุณ เพื่อส่งความรักไปให้ถึงศิลปินกันนะครับ',
      copyBtn: '📋 กดคัดลอกแฮชแท็ก',
      copiedBtn: '✅ คัดลอกแฮชแท็กแล้ว!',
      teamTitle: '✨ Team & Special Thanks',
      memberRole: 'Team Member',
      thanksTitle: 'ขอบคุณ ไลค์ยู (LYKYOU)',
      thanksDesc: 'ขอขอบคุณแฟนคลับชาวไลล์ทุกคนที่ร่วมโดเนทและสนับสนุนโปรเจกต์นี้ให้สำเร็จลุล่วงไปได้ด้วยดี ความรักและพลังซัพพอร์ตของทุกคนจะส่งถึงฮงชิอย่างแน่นอนครับ!',
      disclaimerTitle: '📸 หมายเหตุเกี่ยวกับสื่อ (Media Disclaimer)',
      disclaimerDesc: 'ภาพและวิดีโอทั้งหมดที่ปรากฏบนเว็บไซต์นี้ ได้รับการขออนุญาตจากเจ้าของผลงานเพื่อนำมาใช้ในโปรเจกต์นี้เรียบร้อยแล้ว ขอขอบคุณสำหรับภาพและคลิปสวยๆ ของฮงชิที่นำมาแบ่งปันกันนะครับ'
    },
    faq: {
      title: 'คำถามที่พบบ่อย (FAQ & Rules)',
      subtitle: 'รวบรวมคำถามและกฎระเบียบสำหรับการเข้าร่วมงาน Birthday Cafe',
      categories: [
        {
          emoji: '📍',
          title: 'การเดินทางและสถานที่',
          items: [
            { q: 'เดินทางมาคาเฟ่ยังไง? มีที่จอดรถไหม?', a: 'แนะนำวิธีเดินทางด้วย MRT โดยออกบริเวณทางออก 2B รถยนต์หรือรถจักรยานยนต์มา ลูกค้าสามารถจอดบริเวณลานจอดรถด้านหลังได้เลยครับ' },
            { q: 'จำกัดเวลานั่งในร้านไหม?', a: 'เพื่อความสะดวกของทุกคน ขอความร่วมมือนั่งไม่เกิน 45 นาที - 1 ชั่วโมงในช่วงที่มีคนเยอะนะครับ' }
          ]
        },
        {
          emoji: '🎁',
          title: 'ของแจกและกิจกรรม',
          items: [
            { q: 'เงื่อนไขการรับของแจก (Giveaway) มีอะไรบ้าง?', a: 'เพียงสั่งเครื่องดื่มหรือขนม 1 เมนู เพื่อรับ 1 สิทธิ์ครับ (รายละเอียดเพิ่มเติมสามารถสอบถามพนักงานที่ร้านได้เลยครับ)' },
            { q: 'ของแจกมีจำกัดต่อวันไหม? ถ้าไปช้าของจะหมดไหม?', a: 'จำกัดวันละ 50 เซ็ต เพื่อให้กระจายได้ครบทุกวัน (หรือแจกจนกว่าของจะหมดในแต่ละวันครับ)' },
            { q: 'รับของแจกแทนเพื่อนได้ไหม?', a: 'สามารถรับของแจกได้สูงสุด 3 เซ็ต ต่อ 1 ท่านครับ' }
          ]
        },
        {
          emoji: '🛑',
          title: 'กฎระเบียบและข้อควรระวัง',
          items: [
            { q: 'กฎการถ่ายรูปภายในร้าน', a: 'ถ่ายรูปได้เต็มที่เลยครับ! แต่อย่าเคลื่อนย้ายของตกแต่ง และระมัดระวังไม่บังทางเดินหรือรบกวนลูกค้าท่านอื่นนะครับ' },
            { q: 'นำพร็อพ (ตุ๊กตา/การ์ด) มาถ่ายรูปได้ไหม?', a: 'นำมาได้เลยครับ! แต่ระวังลืมทิ้งไว้นะครับ' }
          ]
        }
      ]
    },
    // +++ เพิ่มส่วน Easter Egg ภาษาไทย +++
    easterEgg: {
      title: '🎉 เซอร์ไพรส์! คุณค้นพบความลับ!',
      desc: 'ขอบคุณที่แวะมาฉลองวันเกิดด้วยกันนะครับ รักทุกคนเลยยย 🩵 - ฮงชิ',
      closeBtn: 'ปิดหน้าต่าง'
    },
    termsModal: {
      title: 'ยินดีต้อนรับสู่ Hongshi Day!',
      subtitle: 'โปรเจกต์นี้จัดทำขึ้นโดยแฟนคลับ (LYKYOU) เพื่อฉลองวันเกิดฮงชิ 🩵',
      intro: 'เพื่อให้พื้นที่นี้เต็มไปด้วยพลังบวก ขอความร่วมมืออ่านข้อตกลงก่อนใช้งานนะครับ:',
      rules: [
        { icon: '📌', title: 'โปรเจกต์แฟนเมด', desc: 'เว็บไซต์นี้จัดทำขึ้นโดยแฟนคลับ ไม่มีส่วนเกี่ยวข้องกับค่ายต้นสังกัด (GMMTV / RISER MUSIC)' },
        { icon: '📸', title: 'ลิขสิทธิ์สื่อ (Media Rights)', desc: 'ภาพและวิดีโอทั้งหมดที่ปรากฏบนเว็บไซต์นี้ ได้รับการขออนุญาตจากเจ้าของผลงานเพื่อนำมาใช้ในโปรเจกต์นี้เรียบร้อยแล้ว' },
        { icon: '💬', title: 'ถ้อยคำสุภาพ', desc: 'ขอความร่วมมือใช้คำสุภาพ ให้เกียรติศิลปินและผู้อื่น ห้ามสแปม หรือใช้คำหยาบ (ระบบมี AI กรองคำอัตโนมัติ)' },
        { icon: '🔒', title: 'ความเป็นส่วนตัว', desc: 'ชื่อและคำอวยพรของคุณจะแสดงเป็นสาธารณะหน้าเว็บ โปรดหลีกเลี่ยงการใส่ข้อมูลส่วนตัวที่สำคัญ' },
        { icon: '🚨', title: 'การรายงาน', desc: 'หากพบเห็นข้อความไม่เหมาะสม สามารถกดไอคอนไซเรน 🚨 บนกล่องข้อความเพื่อรีพอร์ตได้ทันที' }
      ],
      acceptBtn: '✅ รับทราบและเข้าสู่เว็บไซต์'
    }
  },
  en: {
    nav: {
      home: 'Home',
      profile: 'Profile',
      project: 'Details',
      guestbook: 'Wishes',
      faq: 'FAQ',
      terms: 'Terms',
    },
    home: {
      welcome: 'Welcome to the Birthday Project',
      title: 'ONE MORE STEP with HONGSHI',
      subtitle: 'Join us in sending love and celebrating HONGSHI\'s 23rd birthday together 🩵',
      enterBtn: 'Enter Site',
      date: 'October 16, 2026'
    },
    project: {
      title: 'Project Details',
      subtitle: 'Cafe location and activity details for Hongshi\'s birthday',
      eventTitle: '📅 Event Details',
      cafeEvent: 'Birthday Cafe Event',
      eventDate: 'October 16 - 18, 2026',
      locationLabel: 'Location:',
      cafeName: 'Solrise Cafe',
      mapTitle: '📍 Cafe Location (Solrise Cafe)',
      mapBtn: '🗺️ Open in Google Maps',
      giveawayTitle: '🎁 Giveaways',
      tba: 'TBA'
    },
    guestbook: {
      title: 'Birthday Wishes Board',
      subtitle: 'Wishes from LYKYOU floating directly to Hongshi 💌',
      waiting: 'Waiting for the first wish... ✨',
      sendBtn: 'Send a Wish',
      modalTitle: 'Write your wish',
      nameLabel: 'Name / Account',
      namePlaceholder: 'e.g. @hongshihoshi_fan',
      msgLabel: 'Message to Hongshi',
      msgPlaceholder: 'Type your cute birthday wishes here...',
      submitBtn: '🚀 Send Message',
      submitting: 'Sending love... 💌',
      successTitle: 'Wish Sent Successfully!',
      successDesc: 'Your message is floating to Hongshi ✨'
    },
    profile: {
      title: 'HONGSHI',
      subtitle: 'From a boy passionate about dancing to a new generation artist and producer in T-Pop',
      desc: 'Pichetpong Chiradatesakunvong, or "HONGSHI", is the true definition of an <strong>All-Rounder</strong> artist. Under RISER MUSIC and GMMTV, he perfectly blends his skills in dancing, rapping, singing, songwriting, and acting.',
      aka: 'Hong, HONGSHI, Hong LYKN',
      edu: 'Suankularb Wittayalai School, BAScii Chulalongkorn University',
      journeyTitle: '🚀 The Journey to Stardom',
      journeySteps: [
        { date: "High School (Age 14)", title: "Started with Dance", desc: "Started practicing hip-hop dance seriously. Became a cheerleader and school dancer." },
        { date: "December 2022", title: "Project Alpha", desc: "Entered the survival show, discovered his 'rapping' potential, and drastically improved, securing 4th place." },
        { date: "May 2023", title: "LYKN Debut", desc: "Officially debuted as Main Rapper and Lead Dancer, creating a popularity phenomenon with the members under RISER MUSIC." },
        { date: "April 2026", title: "Soloist & Producer", desc: "Released solo single 'Let's Go', stepped up as an assistant producer, composing the melody and writing all lyrics himself." }
      ],
      musicTitle: '🎧 Music & Masterpieces',
      musicSubtitle: 'Not just a Performer, but a "Creator" behind the music',
      songs: [
        { emoji: "🎵", title: "Let's Go (ถูกสเปก)", desc: "Solo Debut in Romantic Hip-Hop style. Hong wrote all the lyrics himself, gaining over 5.1 million views on YouTube." },
        { emoji: "🔥", title: "SUGOI (โฮ่ง!)", desc: "Electronic Hip-hop single where Hong participated as an assistant lyricist (received a high popularity vote of 14%)." },
        { emoji: "✍️", title: "Hi! (ทัก)", desc: "A project where he was trusted to co-write lyrics and rap verses, reflecting his clearly growing musical potential." },
        { emoji: "😉", title: "Trick or Treat (หยอกไม่หลอก)", desc: "Another highly popular, quality release reflecting his versatile abilities." }
      ],
      screenTitle: '🎬 On Screen Universe',
      screenSubtitle: 'Proving his acting charm through series and variety shows',
      screenItems: [
        { emoji: "🖤", title: "Thame•Po (2024)", desc: "Played 'Dylan', the cool rapper of the band MARS. His cold and indifferent demeanor became a strong point that won over many fans." },
        { emoji: "📺", title: "Shows & Guest Roles", desc: "Guest actor in I Love 'A Lot Of' You (2025) and participated in Alpha Lab, LYKN LANDING, School Rangers." }
      ],
      megaTitle: '🔥 2026 Mega Projects',
      megaSubtitle: 'The next steps the world must watch',
      megaItems: [
        { emoji: "📺", title: "Twenty One (21 วัน ลองมารักกันดูไหม)", desc: "GMMTV 2026 massive project series. Plays 'Night', the band's bassist, starring alongside a cast of talented young actors." },
        { emoji: "🌍", title: "DUSK & DAWN WORLD TOUR", desc: "Tour across 3 continents, pioneering markets in Warsaw, Berlin, Paris, New York, San Francisco, Tokyo, etc." },
        { emoji: "🏆", title: "Best Boy Group of the Year", desc: "Guaranteed success, leading the group to win the highest honor from The Guitar Mag Awards 2025." }
      ],
      tags: [
        "Eats 2 gallons of ice cream alone! 🍨", "Carries a personal spoon 🥄", "Pop Culture Geek (Kaiju No. 8) 👾",
        "Into Inazuma Eleven ⚽", "A Worrywart 🥺", "Not a morning person 🛌",
        "Loves airport vibes ✈️", "Hates the sound of nails scratching paper 💅📄", "Wants a pet platypus 🦆",
        "Idolizes 'IU' 🎵", "K-indie / K-R&B Fan 🎧", "Loves film photography 📸"
      ]
    },
    credits: {
      title: 'Credits & Contact',
      subtitle: 'Thank you for all the support that made this birthday project possible 🩵',
      hashtagTitle: "🏷️ Let's wish Hongshi a Happy Birthday!",
      hashtagDesc: "Don't forget to use these hashtags in your posts to send your love to him!",
      copyBtn: '📋 Copy Hashtags',
      copiedBtn: '✅ Hashtags Copied!',
      teamTitle: '✨ Team & Special Thanks',
      memberRole: 'Team Member',
      thanksTitle: 'Thank You, LYKYOU',
      thanksDesc: 'A huge thank you to all LYKYOU who donated and supported this project. Your love and support will definitely reach Hongshi!',
      disclaimerTitle: '📸 Media Disclaimer',
      disclaimerDesc: 'All photos and videos featured on this website have been used with permission from their respective owners. Thank you for sharing such beautiful media of Hongshi with us.'
    },
    faq: {
      title: 'FAQ & Rules',
      subtitle: 'Frequently asked questions and guidelines for joining the Birthday Cafe.',
      categories: [
        {
          emoji: '📍',
          title: 'Location & Travel',
          items: [
            { q: 'How to get there? Is there parking?', a: 'We recommend traveling by MRT and taking Exit 2B. For cars and motorcycles, you can park in the parking lot behind the cafe.' },
            { q: 'Is there a time limit for seating?', a: 'For everyone\'s convenience, we kindly ask you to limit your seating to 45 mins - 1 hour during peak times.' }
          ]
        },
        {
          emoji: '🎁',
          title: 'Giveaways & Event Flow',
          items: [
            { q: 'How to get the giveaways?', a: 'Simply purchase 1 drink or dessert to receive 1 privilege (Please ask the cafe staff for more details).' },
            { q: 'Is there a daily limit for giveaways?', a: 'Limited to 50 sets per day to ensure distribution across all days (or until out of stock each day).' },
            { q: 'Can I collect giveaways for a friend?', a: 'You can collect a maximum of 3 giveaway sets per person.' }
          ]
        },
        {
          emoji: '🛑',
          title: 'Rules & Etiquette',
          items: [
            { q: 'Photography Rules', a: 'Feel free to take photos! But please do not move the decorations, and be careful not to block walkways or disturb other customers.' },
            { q: 'Can I bring props (dolls/cards) for photos?', a: 'Absolutely! But please make sure you don\'t leave them behind.' }
          ]
        }
      ]
    },
    // +++ เพิ่มส่วน Easter Egg ภาษาอังกฤษ +++
    easterEgg: {
      title: '🎉 Surprise! You found a secret!',
      desc: 'Thank you for coming to celebrate my birthday. Love you all! 🩵 - Hongshi',
      closeBtn: 'Close'
    },
    termsModal: {
      title: 'Welcome to Hongshi Day!',
      subtitle: 'This project is created by fans (LYKYOU) to celebrate Hongshi\'s birthday 🩵',
      intro: 'To keep this space full of positive energy, please read our guidelines:',
      rules: [
        { icon: '📌', title: 'Fan-Made Project', desc: 'This website is an unofficial fan project and is not affiliated with GMMTV or RISER MUSIC.' },
        { icon: '📸', title: 'Media Copyright', desc: 'All photos and videos featured on this website have been used with explicit permission from their respective owners.' },
        { icon: '💬', title: 'Be Respectful', desc: 'Please use polite language. No spamming, profanity, or hateful content (AI filters are active).' },
        { icon: '🔒', title: 'Privacy Warning', desc: 'Your submitted name and wishes will be displayed publicly. Please avoid sharing sensitive personal information.' },
        { icon: '🚨', title: 'Reporting', desc: 'If you spot any inappropriate content, click the siren icon 🚨 to report it for admin review.' }
      ],
      acceptBtn: '✅ I Understand & Enter Site'
    }
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hongshi_lang') || 'th';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'th' ? 'en' : 'th';
      localStorage.setItem('hongshi_lang', newLang);
      return newLang;
    });
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);