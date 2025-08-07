import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import {
  ArrowRight,
  KeyRound,
  Mail,
  Monitor,
  RotateCcw,
  Smartphone,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="min-h-screen bg-background">
      <section className="min-h-screen flex items-center justify-center py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="">Secure Auth</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                A complete authentication system built for learning and
                production use.
              </p>
            </div>

            <div className="space-y-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-950 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Email Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Login/signup with email verification
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-950 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Password Reset
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Secure password reset via email
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-950 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Token Management
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Secure access & refresh token flow
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-950 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Session Management
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Multi-device session control
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-950 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Social Login</h3>
                  <p className="text-sm text-muted-foreground">
                    Google, GitHub authentication
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-950 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Admin Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    User & session management
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/akgbytes/secure-auth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="gap-2">
                  <FaGithub className="w-4 h-4" />
                  View Code
                </Button>
              </a>

              {user ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="gap-2"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
