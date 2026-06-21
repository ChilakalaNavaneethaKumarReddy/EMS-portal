import { Phone, Mail, Clock, HelpCircle, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const HELPLINES = [
  {
    category: "SPARSH / PCDA Pension Help Desk",
    contacts: [
      { type: "Toll-Free Phone", value: "1800 180 5325", details: "Available 09:30 AM - 06:00 PM (Govt Working Days)" },
      { type: "Direct Helpline", value: "0532 2421877", details: "PCDA Pension Allahabad Office" },
      { type: "Email Support", value: "sparsh.pension@gov.in", details: "For migration queries & login locks" },
    ]
  },
  {
    category: "ECHS Central Org & Medical Support",
    contacts: [
      { type: "Smart Card Toll-Free", value: "1800 114 115", details: "For card activation and delivery queries" },
      { type: "App Support Email", value: "jditechs1@echs.gov.in", details: "For smart card online application errors" },
      { type: "Nodal Helplines", value: "011-25682870", details: "Central Organisation ECHS, Delhi Cantt" },
    ]
  },
  {
    category: "Directorate General Resettlement (DGR)",
    contacts: [
      { type: "Jobs Placement Nodal", value: "011-26192362", details: "Ex-Servicemen employment assistance branch" },
      { type: "Self Employment Schemes", value: "011-26192366", details: "Tipper & coal transport schemes query desk" },
      { type: "Email Query", value: "dgrplacement@desw.gov.in", details: "Official placement & registration support" },
    ]
  },
  {
    category: "Kendriya Sainik Board (KSB)",
    contacts: [
      { type: "Welfare Grants Helpline", value: "011-26715250", details: "Penury, education, and marriage grants status" },
      { type: "PMSS Scholarship Desk", value: "011-26715255", details: "Prime Minister's Scholarship Scheme queries" },
      { type: "Official Email", value: "secretaryksb-mod@nic.in", details: "KSB Secretariat" },
    ]
  },
  {
    category: "Armed Forces Veteran Cells",
    contacts: [
      { type: "Army DIAV", value: "011-25674251", details: "Directorate of Indian Army Veterans" },
      { type: "Navy DESA", value: "1800 220 005", details: "Directorate of Ex-Servicemen Affairs (Toll-Free)" },
      { type: "Air Force AV", value: "011-23018698", details: "Air Force Association Veteran Cell" },
    ]
  },
  {
    category: "Grievances & Pension Redressal (CPENGRAMS)",
    contacts: [
      { type: "CPGRAMS Toll-Free", value: "1800 111 960", details: "National Consumer and Pension Grievance Redressal" },
      { type: "Online Grievance", value: "https://pgportal.gov.in/", details: "Direct web link to file administrative complaints" },
    ]
  }
]

export function Helplines() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Official Helplines</h1>
        <p className="mt-1 text-army-500 dark:text-army-300">
          Emergency contacts, support desks, and grievance redressal nodes for ex-servicemen and dependents.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HELPLINES.map((group) => (
          <Card key={group.category} className="hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-army-100 pb-3 dark:border-white/10">
              <CardTitle className="text-base font-bold text-army-800 dark:text-army-100 flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-saffron-500 shrink-0" />
                {group.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {group.contacts.map((contact, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xs font-semibold text-army-500 dark:text-army-400 uppercase tracking-wider">{contact.type}</p>
                  <p className="text-base font-display font-bold text-army-950 dark:text-army-50 hover:text-saffron-600 transition-colors">
                    {contact.value.startsWith("http") ? (
                      <a href={contact.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                        Visit Web Portal <Clock className="h-3 w-3" />
                      </a>
                    ) : (
                      contact.value
                    )}
                  </p>
                  <p className="text-xs text-army-500 dark:text-army-400">{contact.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
