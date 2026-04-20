import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image as ImageIcon, Type, Sparkles } from "lucide-react";

const ChatBox = () => {
  const containerRef = useRef(null);

  const { selectedChat, theme, user, axios, token, setUser, navigate } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast("Login to send message");
      navigate("/login");
      return;
    }

    if (!prompt.trim()) return;

    const promptCopy = prompt;
    setLoading(true);

    try {
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: promptCopy,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat?._id || "", prompt: promptCopy, isPublished },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        // Decrease credits
        if (mode === "image") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credits: prev.credits - 1 }));
        }
      } else {
        // Restore the prompt so user doesn't lose it
        setPrompt(promptCopy);
        // Remove the optimistically added user message
        setMessages((prev) => prev.slice(0, -1));
        toast.error(data.message);
      }
    } catch (error) {
      setPrompt(promptCopy);
      setMessages((prev) => prev.slice(0, -1));
      const msg = error?.response?.status === 429
        ? "AI service is busy — please wait a moment and try again."
        : error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col justify-between m-2 sm:m-5 md:m-8 max-md:mt-14 2xl:mr-20 h-[calc(100vh-80px)] lg:h-[calc(100vh-60px)] relative">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Chat Messages Area */}
      <div ref={containerRef} className="flex-1 mb-6 overflow-y-auto scroll-smooth z-10 px-2 sm:px-4">
        {messages.length === 0 && (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="h-full flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
               <img
                  src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
                  alt="logo"
                  className="w-full max-w-48 sm:max-w-64 relative z-10 drop-shadow-2xl"
               />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-blue-400 opacity-90 tracking-tight">
                How can I help you?
              </h1>
              <p className="text-gray-400/80 text-sm sm:text-base max-w-md">
                Experience next-generation AI powered by advanced language models and image generation.
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <Message key={index + '-' + message.timestamp} message={message} />
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-white/5 dark:bg-[#57317C]/10 border border-white/5 w-fit rounded-2xl rounded-tl-none mt-4 backdrop-blur-md"
          >
             <Sparkles size={16} className="text-purple-400 animate-pulse" />
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-[bounce_1s_infinite_0ms]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-[bounce_1s_infinite_200ms]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-[bounce_1s_infinite_400ms]"></div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Inputs Area */}
      <div className="z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        <AnimatePresence>
          {mode === "image" && (
            <motion.label 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="inline-flex items-center gap-3 mb-4 text-sm bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span className="text-gray-300 font-medium tracking-wide">Publish to Gallery</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-600 rounded-full peer-checked:bg-purple-600 transition-colors relative">
                  <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
                </div>
              </div>
            </motion.label>
          )}
        </AnimatePresence>

        <form
          onSubmit={onSubmit}
          className="bg-white/10 dark:bg-[#1E112A]/80 backdrop-blur-xl border border-white/20 dark:border-purple-500/30 rounded-2xl shadow-2xl w-full p-2 pl-3 mx-auto flex gap-3 flex-wrap sm:flex-nowrap items-center focus-within:border-purple-500/50 transition-colors hover:shadow-purple-900/20"
        >
          {/* Mode Switcher */}
          <div className="relative group shrink-0 hidden sm:block">
            <select
              onChange={(e) => setMode(e.target.value)}
              value={mode}
              className="appearance-none bg-transparent text-sm pl-9 pr-4 py-2 outline-none font-medium text-gray-200 cursor-pointer border-r border-white/10"
            >
              <option className="bg-[#1E112A] text-white" value="text">Text</option>
              <option className="bg-[#1E112A] text-white" value="image">Image</option>
            </select>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
              {mode === "text" ? <Type size={16} /> : <ImageIcon size={16} />}
            </div>
          </div>

          <div className="sm:hidden flex items-center bg-white/5 rounded-lg p-1">
             <button type="button" onClick={() => setMode("text")} className={`p-1.5 rounded-md ${mode === "text" ? "bg-purple-600 text-white" : "text-gray-400"}`}><Type size={14}/></button>
             <button type="button" onClick={() => setMode("image")} className={`p-1.5 rounded-md ${mode === "image" ? "bg-purple-600 text-white" : "text-gray-400"}`}><ImageIcon size={14}/></button>
          </div>

          <input
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            type="text"
            placeholder={mode === "text" ? "Send a message..." : "Describe the image you want to generate..."}
            className="flex-1 w-full bg-transparent text-[15px] outline-none text-gray-800 dark:text-white placeholder:text-gray-500 ml-2"
            disabled={loading}
          />

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !prompt.trim()}
            className={`shrink-0 p-2.5 rounded-xl flex items-center justify-center transition-all ${
              prompt.trim() && !loading 
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer" 
                : "bg-white/5 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />}
          </motion.button>
        </form>
        <p className="text-[10px] text-gray-500 mt-3 text-center sm:hidden md:block">
           AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
