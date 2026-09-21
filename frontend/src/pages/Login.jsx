import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Loader2,
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/AuthProvider";

import campusBg from "@/assets/kiet_campus_bg.jpg";

export const Login = () => {
  // View State: "login" | "register" | "forgot_password"
  const [view, setView] = useState("login");

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Registration form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password state
  const [resetIdentifier, setResetIdentifier] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  // Redirect automatically when authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      navigate(`/${authUser.role.toLowerCase()}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your username and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (regPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    try {
      const baseURL = (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
      ).replace("/v1", "");
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          username: regUsername,
          password: regPassword,
          phoneNumber,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      setSuccessMessage(
        "Account created successfully! It is pending administrator verification. Please sign in once approved.",
      );
      setView("login");
      setFullName("");
      setEmail("");
      setRegUsername("");
      setRegPassword("");
      setConfirmPassword("");
      setPhoneNumber("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(
      "Password reset requests are processed by the System Administrator. Please contact your campus coordinator or department admin.",
    );
  };

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center lg:justify-end lg:pr-16 xl:pr-24 2xl:pr-32 p-4 sm:p-6 bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{
        backgroundImage: `url(${campusBg})`,
      }}
    >
      {/* Subtle backdrop overlay ensuring maximum legibility on smaller screens */}
      <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] lg:backdrop-blur-none pointer-events-none" />

      {/* Floating Login Card as a clean Shared Component - calibrated 18-20px (~5mm) right shift */}
      <div className="relative z-10 w-full max-w-[430px] my-auto py-6 sm:translate-x-0 md:translate-x-[18px] lg:translate-x-[20px] transition-transform">
        <Card className="bg-white/95 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_-15px_rgba(2,16,36,0.35)] rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1.5 p-6 pb-4 text-center border-b border-[#7DA0CA]/20 bg-[#f4f9fd]/50">
            <div className="inline-flex h-10 w-10 mx-auto rounded-xl bg-[#052659] text-white items-center justify-center shadow-sm mb-1">
              <GraduationCap className="h-5 w-5 text-[#C1E8FF]" />
            </div>
            <CardTitle className="text-xl font-extrabold text-[#021024]">
              {view === "register"
                ? "Create Academic Account"
                : view === "forgot_password"
                  ? "Account Recovery"
                  : "Welcome to SAMS"}
            </CardTitle>
            <CardDescription className="text-xs text-[#5483B3] font-medium">
              {view === "register"
                ? "Submit your registration for administrative verification"
                : view === "forgot_password"
                  ? "Enter your credentials to initiate a reset inquiry"
                  : "Sign in with your institutional credentials"}
            </CardDescription>
          </CardHeader>

            <form
              autoComplete="off"
              onSubmit={
                view === "register"
                  ? handleRegister
                  : view === "forgot_password"
                    ? handleForgotPassword
                    : handleLogin
              }
            >
              <CardContent className="space-y-4 p-6">
                {/* Status Messages */}
                {error && (
                  <Alert variant="destructive" className="py-2.5 px-3 rounded-lg text-xs">
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-200 flex items-start gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* SIGN IN VIEW */}
                {view === "login" && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="username" className="text-xs font-bold text-[#021024]">
                        Username or Roll Number
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="e.g. 23B21A4201 or admin"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={isLoading}
                          autoComplete="off"
                          className="pl-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-bold text-[#021024]">
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={() => {
                            setView("forgot_password");
                            setError(null);
                            setSuccessMessage(null);
                          }}
                          className="text-[11px] text-[#052659] hover:text-[#5483B3] hover:underline font-semibold"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="pl-10 pr-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5483B3] hover:text-[#021024] p-0.5"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="rememberMe"
                          checked={rememberMe}
                          onCheckedChange={setRememberMe}
                        />
                        <Label
                          htmlFor="rememberMe"
                          className="text-xs text-[#5483B3] font-medium cursor-pointer"
                        >
                          Remember this device
                        </Label>
                      </div>
                    </div>
                  </>
                )}

                {/* REGISTRATION VIEW */}
                {view === "register" && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold text-[#021024]">
                        Full Name <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="e.g. John Doe"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                          className="pl-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-[#021024]">
                        Email Address <span className="text-[#7DA0CA] font-normal">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="username@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="pl-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="regUsername" className="text-xs font-bold text-[#021024]">
                        Desired Username / Roll No <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="regUsername"
                          type="text"
                          placeholder="Choose unique username"
                          required
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          disabled={isLoading}
                          className="pl-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="regPassword" className="text-xs font-bold text-[#021024]">
                        Password <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="regPassword"
                          type={showRegPassword ? "text" : "password"}
                          placeholder="Create secure password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          disabled={isLoading}
                          className="pl-10 pr-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5483B3] hover:text-[#021024] p-0.5"
                          aria-label={showRegPassword ? "Hide password" : "Show password"}
                        >
                          {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#021024]">
                        Confirm Password <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          className="pl-10 pr-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5483B3] hover:text-[#021024] p-0.5"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phoneNumber" className="text-xs font-bold text-[#021024]">
                        Phone Number <span className="text-[#7DA0CA] font-normal">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isLoading}
                          className="pl-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* FORGOT PASSWORD VIEW */}
                {view === "forgot_password" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="resetIdentifier" className="text-xs font-bold text-[#021024]">
                      Registered Email or Roll Number
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5483B3] pointer-events-none" />
                      <Input
                        id="resetIdentifier"
                        type="text"
                        placeholder="Enter your email or roll number"
                        required
                        value={resetIdentifier}
                        onChange={(e) => setResetIdentifier(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 h-12 text-xs bg-white border-[#7DA0CA]/40 rounded-xl focus-visible:ring-[#052659]"
                      />
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 p-6 pt-0">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-xs font-bold rounded-xl bg-[#052659] hover:bg-[#021024] text-white shadow-sm transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </span>
                  ) : view === "register" ? (
                    "Submit Registration"
                  ) : view === "forgot_password" ? (
                    "Request Password Help"
                  ) : (
                    "Sign In to SAMS"
                  )}
                </Button>

                {/* Mode Switching Links */}
                <div className="text-center text-xs text-[#5483B3]">
                  {view === "login" ? (
                    <span>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setView("register");
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[#052659] font-bold hover:underline"
                      >
                        Create account
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setView("login");
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[#052659] font-bold hover:underline"
                      >
                        Back to Sign In
                      </button>
                    </span>
                  )}
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
  );
};
