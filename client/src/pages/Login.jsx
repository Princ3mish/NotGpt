import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { axios, setToken, navigate } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        navigate("/chat");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Background Gradients to match Landing */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {state === "login" ? "Welcome Back" : "Join NotGPT"}
          </h2>
          <p className="text-gray-400 text-sm">
            {state === "login"
              ? "Sign in to continue your AI journey."
              : "Create an account to start exploring."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {state === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="flex flex-col"
              >
                <label className="text-sm text-gray-300 mb-1.5 font-medium">Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="John Doe"
                  className="bg-white/5 border border-white/10 text-white rounded-lg w-full p-3 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500"
                  type="text"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1.5 font-medium">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
              className="bg-white/5 border border-white/10 text-white rounded-lg w-full p-3 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500"
              type="email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1.5 font-medium">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              className="bg-white/5 border border-white/10 text-white rounded-lg w-full p-3 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500"
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium w-full py-3 rounded-lg shadow-lg shadow-purple-600/20 transform transition-all active:scale-[0.98]"
          >
            {state === "register" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          {state === "register" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setState("login")}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setState("register")}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
