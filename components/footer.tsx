import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const footerSections = [
    {
      title: "About",
      links: [
        { href: "/about", label: "Our Mission" },
        { href: "/team", label: "Expert Team" },
        { href: "/success-stories", label: "Success Stories" },
        { href: "/partnerships", label: "Partnerships" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/compliance", label: "Compliance" },
        { href: "/disclaimers", label: "Disclaimers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/fraud-types", label: "Fraud Types" },
        { href: "/prevention-guide", label: "Prevention Guide" },
        { href: "/faq", label: "FAQ" },
        { href: "/blog", label: "Blog" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: "/contact", label: "Get in Touch" },
        { href: "/support", label: "Support Center" },
        { href: "/emergency", label: "Emergency Line" },
        { href: "/locations", label: "Locations" },
      ],
    },
  ]

  return (
    <footer className="bg-card border-t">
      <div className="container px-4 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img
                src="https://i.ibb.co/DPqX17SX/Adobe-Express-file-1.png"
                alt="Fortivault Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-primary">Fortivault</span>
            </Link>
            <p className="text-muted-foreground mb-6 text-pretty">
              Built to protect. Trusted to Secure. Professional fraud recovery services helping victims reclaim their
              funds and protect their financial future.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+14582983729</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>fortivault@aol.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 Fortivault. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
