"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LandingPage = () => {
  // Dynamic content (directly inside the component)
  const content = {
    hero: {
      title: "Plan Events Like a Pro",
      subtitle: "Save time and get better deals with structured event planning.",
      cta: "Start Planning",
    },
    features: [
      {
        title: "Structured Briefs",
        description: "Easily create and manage detailed event briefs.",
      },
      {
        title: "Proposal Comparison",
        description: "Compare offers from different vendors efficiently.",
      },
      {
        title: "Seamless Messaging",
        description: "Communicate with vendors without leaving the platform.",
      },
    ],
    testimonials: [
      {
        quote: "This platform saved me hours of work. Highly recommend!",
        author: "Event Planner",
      },
      {
        quote: "Finding vendors was never this easy before!",
        author: "Marketing Manager",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center text-center py-20 bg-blue-500 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold">{content.hero.title}</h2>
        <p className="mt-4 text-lg">{content.hero.subtitle}</p>
        <Link href="/event-request">
          <motion.button
            className="mt-6 bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {content.hero.cta}
          </motion.button>
        </Link>
      </motion.section>

      {/* Features Overview */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h3 className="text-3xl font-semibold text-center">Why Choose Us?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {content.features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-md rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <h4 className="text-xl font-bold">{feature.title}</h4>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-6">
        <h3 className="text-3xl font-semibold text-center">What Our Users Say</h3>
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-md rounded-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.5 }}
            >
              <p className="text-gray-700">"{testimonial.quote}"</p>
              <span className="block mt-2 font-semibold">- {testimonial.author}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
