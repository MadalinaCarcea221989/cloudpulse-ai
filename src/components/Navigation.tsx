import { Link, useLocation } from "react-router-dom";
import { Cloud, Users } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Cloud className="w-8 h-8 text-cloud-light group-hover:text-white transition-colors" />
          <span className="text-xl font-bold text-foreground">CloudPulse</span>
        </Link>

        {/* Nav Links */}
        <div className="glass-card px-1 py-1 flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/"
                ? "bg-primary/20 text-cloud-light"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/team"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              location.pathname === "/team"
                ? "bg-primary/20 text-cloud-light"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Team
          </Link>
        </div>

        {/* CTA */}
        <button className="glass-card px-5 py-2.5 text-sm font-medium text-cloud-light hover:bg-primary/20 transition-all">
          Connect Infrastructure
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
