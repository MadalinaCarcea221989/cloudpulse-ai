import { Link, useLocation } from "react-router-dom";
import { Cloud, Users, Cable, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Cloud className="w-6 h-6 text-cloud-light group-hover:text-white transition-colors" />
          <span className="text-base font-semibold tracking-tight text-foreground">CloudPulse</span>
        </Link>

        {/* Nav Links */}
        <div className="glass-pill px-1.5 py-1.5 flex items-center gap-0.5">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              location.pathname === "/"
                ? "bg-primary/20 text-cloud-light"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/overview"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              location.pathname === "/overview"
                ? "bg-primary/20 text-cloud-light"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Overview
          </Link>
          {user && (
            <Link
              to="/connections"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === "/connections"
                  ? "bg-primary/20 text-cloud-light"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Cable className="w-3.5 h-3.5" />
              Connections
            </Link>
          )}
          <Link
            to="/team"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              location.pathname === "/team"
                ? "bg-primary/20 text-cloud-light"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Team
          </Link>
        </div>

        {/* Auth Section */}
        {loading ? (
          <div className="w-20 h-8 bg-white/5 rounded-full animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="glass-pill px-2.5 py-1.5 h-auto gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-cloud-light text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground max-w-[120px] truncate hidden sm:inline">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card border-white/10">
              <DropdownMenuItem className="text-muted-foreground text-xs">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button className="glass-pill px-4 py-1.5 h-auto text-xs font-medium text-cloud-light hover:bg-primary/20 transition-all">
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
