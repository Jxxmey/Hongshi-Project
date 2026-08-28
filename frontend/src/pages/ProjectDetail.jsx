import ScrollReveal from '../components/ScrollReveal'; // 1. นำเข้า Component

export default function ProjectDetail() {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-16">
      
      {/* ส่วนหัว */}
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-4xl font-heading font-bold text-navy mb-4">Project Details</h2>
          <p className="text-lg font-body text-navy opacity-80">พิกัดคาเฟ่และรายละเอียดกิจกรรมสำหรับวันเกิดฮงชิ</p>
        </div>
      </ScrollReveal>

      {/* รายละเอียดกิจกรรม */}
      <ScrollReveal delay={200}>
        <section className="flex flex-col items-center">
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">📅 รายละเอียดกิจกรรม</h3>
          <div className="w-full max-w-2xl font-body">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-skyblue text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-2xl font-bold text-navy mb-2">Birthday Cafe Event</h4>
                <p className="text-navy/80 mb-1">16 -18 ตุลาคม 2026</p>
                <p className="text-navy font-bold">สถานที่: Solrise Cafe</p>
              </div>
              <div className="text-5xl">☕️</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* แผนที่คาเฟ่ */}
      <ScrollReveal delay={200}>
        <section>
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">📍 พิกัดคาเฟ่ (Solrise Cafe)</h3>
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-sm relative border-4 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.311!2d100.528!3d13.754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU29scmlzZSBDYWZl!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Solrise Cafe Location"
            ></iframe>
          </div>
          <div className="mt-6 text-center">
            {/* ปุ่มสี Sky Blue โฮเวอร์เป็น Azalea */}
            <a href="https://maps.app.goo.gl/vN6xmL9Qi9JJ7RqAA" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-skyblue text-navy font-heading font-bold px-8 py-3 rounded-full shadow-md hover:bg-azalea transition-colors duration-300">
              🗺️ เปิดนำทางใน Google Maps
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* ของที่ระลึก (มีลูกเล่นเด้งทีละกล่อง) */}
      <section>
        <ScrollReveal>
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">🎁 ของที่ระลึก (Giveaways)</h3>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-body">
          {['รออัปเดต', 'รออัปเดต', 'รออัปเดต', 'รออัปเดต'].map((item, i) => (
            /* หน่วงเวลาเด้งทีละ 150ms ให้เรียงจากซ้ายไปขวา */
            <ScrollReveal key={i} delay={i * 150}>
              <div className="bg-palepink aspect-square rounded-2xl flex items-center justify-center shadow-sm border-2 border-white text-navy font-bold w-full h-full hover:scale-105 transition-transform duration-300 cursor-default">
                {item}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
}