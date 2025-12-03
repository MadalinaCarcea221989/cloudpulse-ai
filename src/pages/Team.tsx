import CloudBackground from "@/components/CloudBackground";
import Navigation from "@/components/Navigation";
import TeamSection from "@/components/TeamSection";

const Team = () => {
  return (
    <div className="relative min-h-screen">
      <CloudBackground />
      <Navigation />

      <main className="relative z-10 pt-20">
        <TeamSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-cloud-blue/20">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 CloudPulse. Where intelligence meets infrastructure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Team;
