import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminExport() {
  const [wishes, setWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State ควบคุมว่าจะปริ้นท์ทั้งหมด หรือ ปริ้นท์แค่ใบเดียว
  const [printTarget, setPrintTarget] = useState('all');

  const fetchWishes = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/cafe-wishes?limit=1000`);
      if (response.ok) {
        const data = await response.json();
        const items = data.items || (Array.isArray(data) ? data : []);
        
        const themes = [
          "from-skyblue to-palepink", 
          "from-palepink to-azalea", 
          "from-skyblue to-beige", 
          "from-skyblue to-azalea"
        ];
        
        const wishesWithThemes = items.map((wish, idx) => ({
          ...wish,
          theme: themes[idx % themes.length]
        }));
        
        setWishes(wishesWithThemes);
      }
    } catch (error) {
      console.error("Error fetching wishes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // ฟังก์ชันย่อขนาดข้อความอวยพร (ซอยระดับให้ละเอียดขึ้นเพื่อป้องกันการล้นกรอบ)
  const getDynamicFontSize = (textLength) => {
    if (textLength < 25) return 'text-2xl leading-normal';
    if (textLength < 60) return 'text-xl leading-relaxed';
    if (textLength < 100) return 'text-lg leading-relaxed';
    if (textLength < 150) return 'text-base leading-relaxed';
    if (textLength < 220) return 'text-sm leading-snug';
    if (textLength < 350) return 'text-[11px] leading-snug';
    return 'text-[9px] leading-tight'; // ถ้ายาวระดับเรียงความ
  };

  // ฟังก์ชันย่อขนาดชื่อ (ป้องกันชื่อยาวล้นกรอบ)
  const getDynamicNameSize = (nameLength) => {
    if (nameLength < 15) return 'text-[13px] px-6 py-2';
    if (nameLength < 25) return 'text-[11px] px-5 py-2';
    if (nameLength < 40) return 'text-[9px] px-4 py-1.5';
    return 'text-[7px] px-3 py-1.5 leading-tight';
  };

  // ฟังก์ชันสั่ง Print / Save PDF ทั้งหมด (A4 หน้าละ 6 รูป)
  const handlePrintAll = () => {
    setPrintTarget('all');
    // หน่วงเวลาให้ React วาดหน้า Print Area แป๊ปนึงก่อนเรียกหน้าต่าง Print
    setTimeout(() => window.print(), 300);
  };

  // ฟังก์ชันสั่ง Print / Save PDF แค่รูปเดียว
  const handlePrintSingle = (id) => {
    setPrintTarget(id);
    setTimeout(() => window.print(), 300);
  };

  // กรองข้อความที่จะนำไปปริ้นท์
  const wishesToPrint = printTarget === 'all' 
    ? wishes 
    : wishes.filter(w => (w.id || w._id) === printTarget);

  // หั่นข้อความออกเป็นชุดๆ ชุดละ 6 ข้อความ (เพื่อจัดลง 1 หน้า A4: กว้าง 2 x ยาว 3)
  const chunkedWishes = [];
  for (let i = 0; i < wishesToPrint.length; i += 6) {
    chunkedWishes.push(wishesToPrint.slice(i, i + 6));
  }

  return (
    <div>
      {/* ==============================================================
          ส่วนของ หน้าต่างแสดงผลปกติ (ไม่แสดงตอนปริ้นท์)
      ============================================================== */}
      <div id="normal-ui" className="py-12 px-4 max-w-6xl mx-auto min-h-[80vh] font-body bg-[#fafafa]">
        <ScrollReveal>
          <Link to="/admin" className="inline-flex items-center gap-2 text-navy hover:text-azalea font-bold mb-4 transition-colors">
            <span className="text-xl">←</span> กลับไปหน้า Dashboard
          </Link>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-heading font-bold text-navy">📥 Export คำอวยพร (PDF High-Res)</h2>
            <p className="text-lg text-navy/80 mt-2">จัดลงหน้า A4 อัตโนมัติ (6 รูปต่อ 1 แผ่น) พร้อมบันทึกเป็น PDF ที่คมชัดที่สุด</p>
            
            {wishes.length > 0 && (
              <div className="mt-8">
                <button 
                  onClick={handlePrintAll}
                  className="bg-navy text-white px-8 py-4 rounded-full font-heading font-bold text-lg hover:bg-azalea hover:-translate-y-1 transition-all shadow-md flex items-center gap-3 mx-auto"
                >
                  <span className="text-2xl">📄</span> 
                  บันทึกทั้งหมดเป็น PDF (A4)
                </button>
                <p className="text-sm text-azalea mt-3 font-bold px-4">
                  *เมื่อหน้าต่างเด้งขึ้นมา ให้เลือกปลายทาง (Destination) เป็น "Save as PDF" หรือ "บันทึกเป็น PDF"
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin text-4xl">⏳</div>
          </div>
        ) : wishes.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border-2 border-dashed border-palepink max-w-2xl mx-auto">
            <span className="text-6xl mb-4 block opacity-50">📭</span>
            <p className="text-xl text-navy font-bold">ยังไม่มีคำอวยพรในระบบ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishes.map((wish, index) => (
              <div key={wish.id || index} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between">
                
                <div className="mb-4">
                  <p className="text-navy font-bold text-xs uppercase tracking-widest text-azalea mb-2">
                    From: {wish.name}
                  </p>
                  <p className="text-navy/80 text-sm leading-relaxed line-clamp-4">
                    "{wish.message}"
                  </p>
                </div>

                <button 
                  onClick={() => handlePrintSingle(wish.id || wish._id)}
                  className="w-full bg-skyblue/20 text-navy font-bold py-2 rounded-xl hover:bg-skyblue transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  📄 บันทึกใบเดียวเป็น PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==============================================================
          ส่วนของ โซนปริ้นท์ (จะถูกซ่อนในโหมดปกติ และแสดงขึ้นมาเฉพาะตอนกดพิมพ์)
      ============================================================== */}
      <div id="print-area" className="hidden font-body text-navy">
        {chunkedWishes.map((pageWishes, pageIndex) => (
          
          /* หน้า A4 1 หน้า (210mm x 297mm) */
          <div 
            key={pageIndex} 
            className="print-page bg-white relative mx-auto flex items-start justify-center pt-[15mm] box-border"
            style={{ width: '210mm', height: '297mm', overflow: 'hidden' }}
          >
            
            {/* Grid ใส่การ์ด 6 รูปต่อหน้า (กว้าง 2 แถว x ยาว 3 แถว) */}
            <div className="flex flex-wrap justify-center content-start" style={{ width: '180mm', gap: '0mm' }}>
              
              {pageWishes.map((wish, idx) => (
                /* การ์ดขนาด 90mm x 90mm (ประมาณ 3.5 นิ้ว) */
                <div 
                  key={idx} 
                  className="relative box-border"
                  style={{ width: '90mm', height: '90mm' }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${wish.theme} p-[3px] box-border`}>
                    <div className="bg-white w-full h-full rounded-[20px] p-5 relative flex flex-col items-center justify-center overflow-hidden">
                      
                      {/* ไอคอนตกแต่ง */}
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-lg text-[#8b5a2b] opacity-80">★</span>
                      <span className="absolute top-6 left-6 text-xs text-skyblue opacity-70">✦</span>
                      <span className="absolute top-8 right-6 text-xs text-palepink opacity-70">✧</span>
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-base text-[#8b5a2b] opacity-80">★</span>
                      <span className="absolute bottom-8 left-8 text-[10px] text-skyblue opacity-80">🌸</span>
                      <span className="absolute bottom-6 right-8 text-[10px] text-navy/30 opacity-70">✦</span>
                      <span className="absolute top-1/2 -translate-y-1/2 left-2 text-sm text-navy/20 rotate-12">🍦</span>
                      <span className="absolute top-1/2 -translate-y-1/2 right-2 text-sm text-navy/20 -rotate-12">☁️</span>

                      <span className={`absolute top-1 left-5 text-6xl opacity-10 bg-clip-text text-transparent bg-gradient-to-br ${wish.theme} font-serif leading-none`}>
                        "
                      </span>

                      {/* ข้อความอวยพร (บีบขนาดอัตโนมัติตามตัวอักษร) */}
                      <div className="flex-grow flex items-center justify-center w-full px-2 z-10 mt-2 overflow-hidden">
                        <p className={`font-body text-navy/90 text-center font-medium w-full break-words whitespace-pre-wrap ${getDynamicFontSize(wish.message.length)}`}>
                          {wish.message}
                        </p>
                      </div>

                      {/* ชื่อผู้ส่ง (ห่อตัวอักษร บีบขนาด ไม่มีการตัดทิ้ง) */}
                      <div className="flex justify-center items-center mt-2 border-t border-gray-100/80 pt-2 w-full z-10 shrink-0">
                        <span 
                          className={`rounded-full bg-gradient-to-r ${wish.theme} font-heading font-bold text-white shadow-sm inline-block break-words text-center ${getDynamicNameSize(wish.name.length)}`} 
                          style={{ maxWidth: '95%' }}
                        >
                          From: {wish.name}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        ))}
      </div>


      {/* ==============================================================
          CSS สำหรับสั่งงานหน้าต่าง Print / Save PDF
      ============================================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* ซ่อนหน้าเว็บปกติ */
          body * {
            visibility: hidden;
          }
          
          /* โชว์เฉพาะโซนปริ้นท์ ให้ชิดขอบบนซ้ายสุด */
          #print-area, #print-area * {
            visibility: visible;
          }
          
          #print-area {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          /* บังคับเบราว์เซอร์ให้จัดหน้า A4 แนวตั้ง แบบไม่มีขอบขาว (Zero Margin) */
          @page {
            size: A4 portrait;
            margin: 0mm; 
          }

          /* บังคับให้เบราว์เซอร์พิมพ์สีพื้นหลัง (Gradient) ออกมาด้วยเสมอ */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* บังคับแบ่งหน้ากระดาษเมื่อจบหน้า A4 */
          .print-page {
            page-break-after: always;
            break-after: page;
          }
        }

        /* ในโหมดหน้าจอปกติ ให้ซ่อนโซนนี้ไปเลย */
        @media screen {
          #print-area {
            display: none !important;
          }
        }
      `}} />

    </div>
  );
}