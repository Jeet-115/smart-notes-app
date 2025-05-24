import { useState } from "react";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import ThemeToggle from "../Theme/ThemeToggle";

export default function Home() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <Helmet>
        <title>MyNotes — Your Smart Note Taking App</title>
        <meta
          name="description"
          content="Create, edit, and organize your notes efficiently with MyNotes."
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-500 p-8">
        <motion.div
          className="max-w-7xl mx-auto mb-8 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h1 className="text-4xl font-extrabold text-center text-indigo-700 dark:text-indigo-400">
            Welcome to{" "}
            <span className="text-blue-600 dark:text-indigo-200">MyNotes</span>{" "}
            — Your Smart Note Taking App
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Create, edit, and organize your notes efficiently.
          </p>

          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              aria-label="Logout"
              title="Logout"
            >
              Logout
            </button>

            <ThemeToggle />
          </div>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl rounded-xl bg-white dark:bg-gray-800 p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ delay: 0.3 }}
        >
          <NoteList
            onSelectNote={setSelectedNote}
            refresh={refresh}
            setRefresh={setRefresh}
            selectedNote={selectedNote}
          />
          <section className="md:col-span-2">
            <NoteEditor
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              setRefresh={setRefresh}
            />
          </section>
        </motion.div>
      </main>
    </>
  );
}
