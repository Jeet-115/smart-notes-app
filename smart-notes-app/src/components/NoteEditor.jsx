import { useEffect, useState } from "react";
import { createNote, updateNote } from "../api/notes";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import jsPDF from "jspdf";
import { saveAs } from "file-saver";

export default function NoteEditor({ selectedNote, setSelectedNote, setRefresh }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTags(selectedNote.tags);
      setPinned(selectedNote.pinned || false);
    } else {
      setTitle("");
      setContent("");
      setTags("");
      setPinned(false);
    }
  }, [selectedNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const note = { title, content, tags, pinned };

    try {
      if (selectedNote) {
        await updateNote(selectedNote.id, note);
      } else {
        await createNote(note);
        setTitle("");
        setContent("");
        setTags("");
      }
      setSelectedNote(null);
      setRefresh((prev) => !prev);
    } catch (error) {
      alert("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportMarkdown = () => {
    const plainContent = content.replace(/<[^>]+>/g, "");
    const mdContent = `# ${title || "Untitled Note"}\n\n${plainContent}\n\n**Tags:** ${tags || ""}`;
    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `${title || "note"}.md`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title || "Untitled Note", 10, 20);

    doc.setFontSize(12);
    const plainContent = content.replace(/<[^>]+>/g, "");
    const splitText = doc.splitTextToSize(plainContent, 180);
    doc.text(splitText, 10, 30);

    doc.text(`Tags: ${tags || ""}`, 10, doc.internal.pageSize.height - 20);

    doc.save(`${title || "note"}.pdf`);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 dark:text-white shadow-lg p-6 rounded-lg max-h-[80vh] overflow-y-auto"
      key={selectedNote ? selectedNote.id : "new"}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      layout
    >
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {selectedNote ? "Edit Note" : "New Note"}
        </h2>
        {selectedNote && (
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setSelectedNote(null)}
          >
            + New Note
          </button>
        )}
      </div>

      <motion.form onSubmit={handleSubmit} className="space-y-5" layout>
        <motion.input
          variants={inputVariants}
          className="w-full p-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          maxLength={100}
        />

        <motion.div
          style={{ resize: "vertical", overflow: "auto" }}
          className="min-h-[200px] max-h-[600px]"
          variants={inputVariants}
        >
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            readOnly={loading}
            className="dark:bg-gray-900 dark:text-white"
          />
        </motion.div>

        <motion.input
          variants={inputVariants}
          className="w-full p-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={loading}
          maxLength={100}
        />

        <motion.label
          className="inline-flex items-center space-x-2"
          variants={inputVariants}
        >
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            disabled={loading}
          />
          <span>Pin this note</span>
        </motion.label>

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md font-semibold text-white
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          whileHover={loading ? {} : { scale: 1.05 }}
          whileTap={loading ? {} : { scale: 0.95 }}
          layout
        >
          {loading
            ? selectedNote
              ? "Updating..."
              : "Creating..."
            : selectedNote
            ? "Update"
            : "Create"}
        </motion.button>
      </motion.form>

      {/* Export buttons */}
      <motion.div
        className="mt-6 flex gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={exportMarkdown}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Export note as Markdown"
        >
          Export as Markdown
        </motion.button>
        <motion.button
          onClick={exportPDF}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Export note as PDF"
        >
          Export as PDF
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
