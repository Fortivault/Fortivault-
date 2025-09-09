import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "How long does the recovery process take?",
      answer:
        "Recovery timeframes vary depending on the type of fraud and complexity of the case. Most cases are resolved within 2-6 months, though some may take longer.",
    },
    {
      question: "What are your success rates?",
      answer:
        "Our overall success rate is 85% for fund recovery. Success rates vary by fraud type, with cryptocurrency scams having a 78% success rate and wire fraud having a 92% success rate.",
    },
    {
      question: "Do you charge upfront fees?",
      answer:
        "We work on a contingency basis for most cases, meaning you only pay when we successfully recover your funds. Initial consultation is always free.",
    },
    {
      question: "What information do I need to provide?",
      answer:
        "We need all available documentation including transaction records, communication with scammers, bank statements, and any evidence you have collected.",
    },
    {
      question: "Can you help with international fraud cases?",
      answer:
        "Yes, we have partnerships with international law enforcement and financial institutions to assist with cross-border fraud recovery.",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our fraud recovery services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  )
}
