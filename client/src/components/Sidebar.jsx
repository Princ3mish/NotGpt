import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Search, LogOut, SunMoon, Image as ImageIcon, Gem, MessageSquare, Trash2, X } from "lucide-react";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token,
  } = useAppContext();
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm("Are you sure you want to delete this chat?");
      if (!confirm) return;

      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUsersChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navItemClass = "flex items-center gap-3 p-3 mt-2 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:bg-white/5 hover:border-white/10 group overflow-hidden relative";

  return (
    <div
      className={`flex flex-col h-screen min-w-[300px] p-5 bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#80609F]/20 transition-transform duration-500 max-md:absolute left-0 z-50 ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      {/* Background glow specific to Sidebar */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-20%] left-[-50%] w-[150%] h-[50%] bg-purple-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header / Logo */}
        <div className="flex justify-between items-center mb-6">
          <img
            src={theme === "dark" ? assets.logo_full_dark : assets.logo_full}
            alt="NotGPT Logo"
            className="w-full max-w-[140px] cursor-pointer"
            onClick={() => { navigate("/"); setIsMenuOpen(false); }}
          />
          <button 
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createNewChat}
          className="flex justify-center items-center gap-2 w-full py-3 mb-6 font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all border border-white/10 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <MessageSquarePlus size={18} className="relative z-10" />
          <span className="relative z-10">New Chat</span>
        </motion.button>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 mb-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-purple-500/50 dark:focus-within:border-purple-500/50 focus-within:bg-gray-50 dark:focus-within:bg-white/10 transition-colors shadow-sm dark:shadow-none">
          <Search size={16} className="text-gray-400" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search conversations"
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
          />
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto scroll-smooth pr-1 -mr-1">
          {chats.length > 0 && (
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
              Recent Chats
            </p>
          )}
          <AnimatePresence>
            {chats
              .filter((chat) =>
                chat.messages[0]
                  ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
                  : chat.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((chat, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    navigate("/chat");
                    setSelectedChat(chat);
                    setIsMenuOpen(false);
                  }}
                  key={chat._id}
                  className="p-3 mb-2 bg-white dark:bg-[#57317C]/10 border border-transparent hover:border-purple-500/30 dark:hover:border-[#80609F]/30 hover:bg-purple-50 dark:hover:bg-[#57317C]/20 rounded-xl cursor-pointer flex justify-between items-center group transition-colors shadow-sm dark:shadow-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className="text-purple-500 dark:text-purple-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-700 dark:text-gray-200 truncate w-full">
                        {chat.messages.length > 0
                          ? chat.messages[0].content.slice(0, 30)
                          : chat.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {moment(chat.updatedAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteChat(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Bottom Nav Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-1">
          <div
            onClick={() => { navigate("/community"); setIsMenuOpen(false); }}
            className={`flex items-center gap-3 p-3 mt-2 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:bg-purple-50 dark:hover:bg-white/5 hover:border-purple-100 dark:hover:border-white/10 group overflow-hidden relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <ImageIcon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 relative z-10 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white relative z-10 transition-colors">Community Gallery</span>
          </div>

          <div
            onClick={() => { navigate("/credits"); setIsMenuOpen(false); }}
            className={`flex items-center gap-3 p-3 mt-2 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:bg-blue-50 dark:hover:bg-white/5 hover:border-blue-100 dark:hover:border-white/10 group overflow-hidden relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <Gem size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 relative z-10 transition-colors" />
            <div className="flex flex-col relative z-10">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Credits: <span className="text-blue-600 dark:text-blue-400">{user?.credits || 0}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 mt-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3">
              <SunMoon size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
              />
              <div className="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-purple-600 transition-colors relative">
                <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
              </div>
            </label>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 mt-2 bg-gradient-to-r from-purple-100 dark:from-purple-900/20 to-transparent border border-purple-200 dark:border-purple-500/20 rounded-xl cursor-default">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
              {user ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="flex flex-col overflow-hidden flex-1 cursor-pointer" onClick={() => !user && navigate("/login")}>
              <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {user ? user.name : "Sign in required"}
              </span>
              <span className="text-[10px] text-gray-500 truncate">
                {user ? user.email : "Access all features"}
              </span>
            </div>
            {user && (
              <button 
                onClick={logout}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-gray-800 dark:hover:text-white shrink-0"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
