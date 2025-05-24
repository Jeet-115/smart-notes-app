import { useEffect, useState, useMemo } from "react";
import { fetchNotes, deleteNote, togglePinNote } from "../api/notes";
import { motion, AnimatePresence } from "framer-motion";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function NoteList({
  onSelectNote,
  refresh,
  setRefresh,
  selectedNote,
}) {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchNotes().then(setNotes).catch(console.error);
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id);
      setRefresh((prev) => !prev);
    }
  };

  const handleTogglePin = async (e, note) => {
    e.stopPropagation();
    try {
      await togglePinNote(note.id, !note.pinned);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      alert("Failed to update pin status. Please try again.");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        note.tags.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [notes, debouncedSearchQuery]);

  filteredNotes.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return b.pinned - a.pinned;
  });

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg p-6 rounded-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">
        All Notes
      </h2>

      <input
        type="text"
        placeholder="Search by title or tag..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          No matching notes found.
        </p>
      ) : (
        <AnimatePresence>
          {filteredNotes.map((note) => {
            const isSelected = selectedNote && selectedNote.id === note.id;
            return (
              <motion.div
                key={note.id}
                onClick={() => onSelectNote(note)}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={itemVariants}
                layout
                className={`cursor-pointer flex justify-between items-center p-3 rounded-md mb-3 transition 
                  ${
                    isSelected
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleTogglePin(e, note)}
                    aria-label={note.pinned ? "Unpin note" : "Pin note"}
                    title={note.pinned ? "Unpin note" : "Pin note"}
                    className={`focus:outline-none text-yellow-500 hover:text-yellow-600 transition ${
                      note.pinned ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    {note.pinned ? "📌" : "📍"}
                  </button>

                  <div>
                    <p className="font-semibold text-lg truncate max-w-xs">
                      {note.title}
                    </p>
                    <p className="text-sm text-gray-600 italic truncate max-w-xs">
                      {note.tags}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note.id);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  aria-label="Delete note"
                  title="Delete note"
                >
                  &times;
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
