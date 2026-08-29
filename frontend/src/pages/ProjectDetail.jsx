import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext'; // +++ ดึง Hook ของภาษามาใช้

export default function ProjectDetail() {
  const { t } = useLanguage(); // +++ เรียกใช้ตัวแปร t

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-16 selection:bg-azalea selection:text-white pb-20">
      
      {/* ส่วนหัว */}
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">{t.project.title}</h2>
          <p className="text-lg font-body text-navy opacity-80">{t.project.subtitle}</p>
        </div>
      </ScrollReveal>

      {/* รายละเอียดกิจกรรม */}
      <ScrollReveal delay={200}>
        <section className="flex flex-col items-center">
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">
            {t.project.eventTitle}
          </h3>
          <div className="w-full max-w-2xl font-body">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-skyblue text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-2xl font-bold text-navy mb-2">{t.project.cafeEvent}</h4>
                <p className="text-navy/80 mb-1">{t.project.eventDate}</p>
                <p className="text-navy font-bold">{t.project.locationLabel} {t.project.cafeName}</p>
              </div>
              <div className="text-5xl">☕️</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* แผนที่คาเฟ่ */}
      <ScrollReveal delay={200}>
        <section>
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">
            {t.project.mapTitle}
          </h3>
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-sm relative border-4 border-white hover:border-skyblue transition-colors duration-300">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.311!2d100.528!3d13.754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU29scmlzZSBDYWZl!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Solrise Cafe Location"
            ></iframe>
          </div>
          <div className="mt-8 text-center">
            <a href="https://maps.app.goo.gl/vN6xmL9Qi9JJ7RqAA" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-skyblue text-navy font-heading font-bold px-8 py-4 rounded-full shadow-md hover:bg-azalea hover:text-white transition-all hover:-translate-y-1 duration-300 text-lg">
              {t.project.mapBtn}
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* ของที่ระลึก */}
      <section>
        <ScrollReveal>
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">
            {t.project.giveawayTitle}
          </h3>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-body">
          {[t.project.tba, t.project.tba, t.project.tba, t.project.tba].map((item, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="bg-palepink aspect-square rounded-2xl flex items-center justify-center shadow-sm border-2 border-white text-navy font-bold w-full h-full hover:scale-105 hover:border-azalea hover:bg-white hover:text-azalea transition-all duration-300 cursor-default">
                {item}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
}