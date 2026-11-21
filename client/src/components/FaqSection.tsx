/*
 * Sık Sorulan Sorular. Aynı veri (shared/faq.ts) FAQPage JSON-LD olarak da
 * basıldığından görünür içerik ile yapılandırılmış veri her zaman eşleşir.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@shared/faq";

export default function FaqSection() {
  return (
    <section className="py-16 lg:py-20" aria-labelledby="faq-heading">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2
            id="faq-heading"
            className="text-3xl lg:text-4xl font-bold text-[#004899] font-[Poppins] mb-3"
          >
            Sık Sorulan Sorular
          </h2>
          <p className="text-gray-600">
            Merak ettiklerinizin cevapları burada.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-gray-800 py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
