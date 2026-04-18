import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 40, filter: "blur(4px)" },
  animate: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
};

function ScrollReveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-50">

      {/* Navbar */}
      <motion.nav
        className="bg-white border-b border-navy-100 flex items-center justify-between px-8 py-5 sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-bold text-navy-800 text-lg">Campus Bridge</span>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => navigate("/login")}
            className="text-sm text-navy-600 hover:text-navy-800 font-medium transition"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Sign In
          </motion.button>
          <motion.button
            onClick={() => navigate("/register")}
            className="text-sm bg-navy-800 hover:bg-navy-900 text-white px-5 py-2 rounded-lg font-medium transition"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 bg-navy-100 text-navy-600 text-xs font-medium px-4 py-2 rounded-full mb-6"
        >
          🎓 Built for AI & Data Science Students
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold text-navy-800 mb-6 leading-tight"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Bridge the Gap Between
          <span className="text-navy-500"> College </span>
          and
          <span className="text-navy-500"> Career</span>
        </motion.h1>

        <motion.p
          className="text-navy-400 text-lg max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          Campus Bridge continuously monitors your career readiness, identifies skill gaps,
          and connects you with matching job opportunities — starting from day one.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            onClick={() => navigate("/register")}
            className="bg-navy-800 hover:bg-navy-900 text-white px-8 py-3.5 rounded-xl font-medium text-sm transition shadow-lg shadow-navy-200"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Start For Free →
          </motion.button>
          <motion.button
            onClick={() => navigate("/login")}
            className="bg-white border border-navy-200 hover:bg-navy-100 text-navy-700 px-8 py-3.5 rounded-xl font-medium text-sm transition"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Sign In
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {[
            { value: "500+", label: "Students" },
            { value: "50+", label: "Job Listings" },
            { value: "90%", label: "Placement Rate" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-navy-100 rounded-2xl p-6"
              variants={fadeUp}
              custom={i}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, y: -3, transition: { duration: 0.25 } }}
            >
              <p className="text-3xl font-bold text-navy-800">{stat.value}</p>
              <p className="text-sm text-navy-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy-800 mb-3">
              Everything You Need to Get Hired
            </h2>
            <p className="text-navy-400 text-sm">
              One platform for your entire college-to-career journey.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "📊", title: "Employability Score", desc: "Get a real-time score based on your skills, academics, and semester. Know exactly where you stand." },
              { icon: "🎯", title: "Skill Gap Analysis", desc: "Identify exactly which skills you're missing and get a personalized roadmap to improve them." },
              { icon: "💼", title: "Smart Job Matching", desc: "Jobs ranked by how well they match your current skills. Apply to the right jobs at the right time." },
              { icon: "📝", title: "Assessment Tests", desc: "Take Technical, Aptitude, and Soft Skills tests. Compare scores over time to track improvement." },
              { icon: "📈", title: "Progress Tracking", desc: "Track your career readiness over time. See how adding skills improves your score instantly." },
              { icon: "🏫", title: "College Integration", desc: "Admins can monitor department-wide employability and take early action for at-risk students." },
            ].map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.07}>
                <motion.div
                  className="bg-navy-50 rounded-2xl p-6 h-full"
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center mb-4 text-2xl">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-navy-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-navy-500">{f.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl font-bold text-navy-800 mb-3">How It Works</h2>
          <p className="text-navy-400 text-sm">Get started in 3 simple steps.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Create Your Profile", desc: "Sign up and add your skills, academic details, and semester information." },
            { step: "2", title: "Get Your Score", desc: "Our engine calculates your employability score and identifies skill gaps instantly." },
            { step: "3", title: "Apply to Jobs", desc: "Browse jobs matched to your skills and apply directly from the platform." },
          ].map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 0.12}>
              <motion.div
                className="text-center bg-navy-100 rounded-2xl p-8 h-full"
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.4 } }}
                >
                  <span className="text-white text-xl font-bold">{s.step}</span>
                </motion.div>
                <h3 className="font-semibold text-navy-800 mb-2">{s.title}</h3>
                <p className="text-sm text-navy-500">{s.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy-800 py-16">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Bridge the Gap?
            </h2>
            <p className="text-navy-200 text-sm mb-8">
              Join hundreds of students already using Campus Bridge to land their dream jobs.
            </p>
            <motion.button
              onClick={() => navigate("/register")}
              className="bg-white text-navy-800 hover:bg-navy-100 px-8 py-3.5 rounded-xl font-medium text-sm transition"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Get Started For Free →
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-navy-100 px-8 py-6">
        <ScrollReveal>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-7 h-7 rounded-lg object-cover" />
              <span className="text-sm font-medium text-navy-600">Campus Bridge</span>
            </div>
            <p className="text-xs text-navy-400">
              © 2026 Campus Bridge · Datta Meghe College of Engineering
            </p>
          </div>
        </ScrollReveal>
      </footer>

    </div>
  );
}

export default Home;