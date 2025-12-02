import { Linkedin, Globe, Mail, Phone } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  linkedin: string;
  portfolio?: string;
  email: string;
  phone: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Mădălina Carcea",
    role: "Data Science & AI Engineering",
    description: "Student at BUAS with a focus on Healthcare Tech. Passionate about leveraging AI to solve complex infrastructure challenges.",
    linkedin: "https://linkedin.com/in/madalina-carcea",
    portfolio: "https://madalina.dev",
    email: "madalina@cloudpulse.io",
    phone: "+31 6 1234 5678",
    image: "/placeholder.svg",
  },
  {
    name: "Victoria Vicheva",
    role: "Data Science & AI Engineering",
    description: "Student at BUAS specializing in cloud monitoring solutions. Building intelligent systems for modern DevOps workflows.",
    linkedin: "https://linkedin.com/in/victoria-vicheva",
    portfolio: "https://victoria.dev",
    email: "victoria@cloudpulse.io",
    phone: "+31 6 8765 4321",
    image: "/placeholder.svg",
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold chrome-text mb-4">
            Meet the Team Behind CloudPulse
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Two data science students building the future of cloud infrastructure monitoring.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="glass-card p-6 group hover:scale-[1.02] transition-all">
              {/* Photo Placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cloud-blue to-cloud-light mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-cloud-dark">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>

              {/* Info */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-cloud-light transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-cloud-sky">{member.role}</p>
              </div>

              <p className="text-sm text-muted-foreground text-center mb-6">
                {member.description}
              </p>

              {/* QR Code Placeholder */}
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xs text-cloud-dark font-mono">LinkedIn QR</span>
              </div>

              {/* Contact Links */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cloud-navy/50 text-cloud-light hover:bg-primary/30 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                {member.portfolio && (
                  <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-cloud-navy/50 text-cloud-light hover:bg-primary/30 transition-all"
                    aria-label="Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-lg bg-cloud-navy/50 text-cloud-light hover:bg-primary/30 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${member.phone}`}
                  className="p-2 rounded-lg bg-cloud-navy/50 text-cloud-light hover:bg-primary/30 transition-all"
                  aria-label="Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
