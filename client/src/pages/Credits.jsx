import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Gem, Check } from "lucide-react";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token, axios, user, navigate } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans.");
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  const purchasePlan = async (planId) => {
    try {
      if (!user) {
        toast.error("Please login to purchase credits.");
        navigate("/login");
        return;
      }
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        {
          headers: { Authorization: token },
        }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="flex-1 w-full max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-smooth">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 xl:mt-10"
      >
        <div className="inline-flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-6">
          <Gem className="text-blue-500 dark:text-blue-400 w-8 h-8" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-4">
          Upgrade Your Power
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose a plan that fits your creative needs. Unlock more AI generations and experience NotGPT without limits.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center "
      >
        {plans.map((plan) => {
          const isPro = plan._id === "pro";
          return (
            <motion.div
              variants={itemAnim}
              key={plan._id}
              className={`relative rounded-3xl p-8 flex flex-col backdrop-blur-xl border transition-all duration-300 ${
                isPro 
                  ? "bg-purple-50 dark:bg-gradient-to-b dark:from-purple-900/40 dark:to-blue-900/20 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transform md:-translate-y-4" 
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
              }`}
            >
              {isPro && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-2 ${isPro ? "text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-200"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-6 text-gray-600 dark:text-gray-300">
                  <span className={`text-4xl font-extrabold tracking-tight ${isPro ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400" : "text-gray-900 dark:text-white"}`}>
                    ${plan.price}
                  </span>
                  <span className="text-sm font-medium opacity-60">/ {plan.credits} credits</span>
                </div>
                
                <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-6" />

                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Check className={`w-5 h-5 shrink-0 ${isPro ? "text-purple-500 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() =>
                  toast.promise(purchasePlan(plan._id), {
                    loading: "Initializing...",
                  })
                }
                className={`w-full mt-8 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 ${
                  isPro 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Credits;
