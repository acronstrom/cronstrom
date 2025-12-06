import { motion } from 'motion/react';

export function AboutArt() {
  return (
    <section className="py-24 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-12 text-center">
            Varför behöver vi konst?
          </h2>

          {/* Content */}
          <div className="space-y-8 text-neutral-700 leading-relaxed text-lg">
            <p className="text-xl md:text-2xl font-serif text-neutral-800">
              Konst är allvar, som öppnar nya möjligheter att uttrycka sig.
            </p>

            <p>
              För att träna känslor, tankar, begrepp och att kunna meddela sig med omgivningen. 
              För att vidga vår värld och öva upp vår perceptionsförmåga. 
              För att få insyn i sin egen inre värld och andras.
            </p>

            <p>
              Via musiken finns det mycket som vi förstår om oss själva och det är likadant med konsten 
              (speciellt abstrakt konst). Via handen uttrycker jag något som jag inte har kontroll över.
            </p>

            <p>
              Färg och form är som toner och mitt omedvetna jag kommer till uttryck genom bilden. 
              Jag för en ständig dialog mellan mitt medvetna jag och mitt omedvetna jag, spänningen 
              mellan ytterligheter. Här får jag kontakt med något i mitt liv som jag inte kan uttrycka i ord.
            </p>

            <p>
              Konst skall stanna, ge ett avtryck, en känsla. Ett konstverk tolkas genom den erfarenhet 
              varje människa bär inom sig. Därför är det alltid intressant att diskutera måleri med 
              besökare av utställningar.
            </p>

            {/* Final quote */}
            <blockquote className="border-l-4 border-neutral-300 pl-6 py-4 mt-12">
              <p className="text-xl md:text-2xl font-serif text-neutral-800 italic">
                "En målning är en hemlighet om en hemlighet, ju mer du ser – desto mindre får du veta…"
              </p>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
