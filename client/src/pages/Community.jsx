import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { axios } = useAppContext();

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/user/published-images");

      if (data.success) {
        setImages(data.images);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  // Stagger variants for the grid
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 px-6 pt-12 pb-24 xl:px-12 2xl:px-20 mx-auto h-full overflow-y-scroll scroll-smooth">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <ImageIcon className="text-purple-600 dark:text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Community Gallery
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-500">Discover AI creations shared by the NotGPT community</p>
          </div>
        </motion.div>

        {images.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {images.map((item, index) => (
              <motion.a
                variants={itemAnim}
                key={index}
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="relative group block rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 shadow-lg backdrop-blur-sm"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={`Created by ${item.userName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm font-medium text-white truncate">
                    By {item.userName}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-20 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/5"
          >
            <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-700 dark:text-gray-400 font-medium">No images available yet.</p>
            <p className="text-sm text-gray-500 mt-1">Be the first to share an AI generated masterpiece!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Community;
