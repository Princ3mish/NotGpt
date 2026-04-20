import { assets } from "../assets/assets";
import moment from "moment";
import { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-4 px-2 sm:px-4`}
    >
      <div className={`flex gap-3 max-w-[85%] sm:max-w-2xl ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isUser ? (
            <img src={assets.user_icon} alt="user" className="w-9 h-9 rounded-full object-cover shadow-md border border-white/10" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md border border-white/20">
              <Bot size={18} className="text-white" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col gap-2 p-4 rounded-2xl backdrop-blur-xl border shadow-sm ${
          isUser 
            ? "bg-gradient-to-br from-purple-600/90 to-blue-600/90 border-transparent text-white rounded-tr-none" 
            : "bg-white/5 dark:bg-[#57317C]/20 border-gray-200 dark:border-[#80609F]/30 text-gray-800 dark:text-gray-200 rounded-tl-none"
        }`}>
          {message.isImage ? (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="overflow-hidden rounded-xl border border-white/10 mt-1"
            >
              <img
                src={message.content}
                alt="AI Generated"
                className="w-full max-w-sm h-auto hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ) : (
            <div className={`text-sm leading-relaxed ${isUser ? "text-white" : "reset-tw"}`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </div>
          )}
          <span className={`text-[10px] font-medium tracking-wide flex justify-end ${
            isUser ? "text-white/70" : "text-gray-400 dark:text-[#B1A6C0]"
          }`}>
            {moment(message.timestamp).format("LT")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
