import { useState, useEffect, useMemo } from "react";
import axios, { isAxiosError } from "axios";

const API_URL = "http://localhost:3000/api/todos";

let userId = localStorage.getItem("user-id");
if (!userId) {
  // Jika tidak ada, buat ID acak yang unik dan simpan
  userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem("user-id", userId);
}

axios.interceptors.request.use(
  (config) => {
    config.headers["x-user-id"] = userId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// --- Sisa kode komponen tetap sama seperti sebelumnya ---
const CheckIcon = () => (
  <svg className="w-4 h-4 text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    {" "}
    <path d="M20 6L9 17l-5-5"></path>{" "}
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {" "}
    <path d="M3 6h18"></path> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line>{" "}
  </svg>
);

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');`;
    document.head.appendChild(style);
  }, []);
  // 3. Perbarui penanganan error untuk mengenali status 401
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL);
        console.log(response);
        const todos = response.data.sort((a, b) => b.id - a.id);
        setTodos(todos);
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          // err.response is defined, you can safely access its properties
          setError(err.response.status + " " + err.response.statusText);
          if (err.response.status === 401) {
            setError("Autentikasi gagal");
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const response = await axios.post(API_URL, { title: newTodoTitle });
      setTodos([...todos, response.data]);
      setNewTodoTitle("");
    } catch (err) {
      setError(err.response.status + " " + err.response.statusText + " : Gagal menambahkan todo.");
      console.error(err);
    }
  };
  const handleToggleTodo = async (id: number) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`);
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: response.data.completed } : todo)));
    } catch (err) {
      setError("Gagal mengubah status todo.");
      console.error(err);
    }
  };
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => todo.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [todos, searchTerm]);

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text mb-2"> Todo List </h1>
          <p className="text-slate-400">Dibangun dengan NestJS & React</p>
        </header>

        <div className="text-center mb-4 text-xs text-slate-500 break-all">
          <p>User ID: {userId}</p>
        </div>

        <main className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 p-6 md:p-8">
          <form onSubmit={handleAddTodo} className="mb-6 flex gap-3">
            {" "}
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Tambahkan tugas baru..."
              className="flex-grow bg-slate-900/70 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
            />{" "}
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100"
            >
              {" "}
              Add{" "}
            </button>{" "}
          </form>
          <div className="mb-6">
            {" "}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full bg-slate-900/70 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
            />{" "}
          </div>
          {loading && <p className="text-center text-slate-400 animate-pulse">Memuat data...</p>}
          {error && <p className="text-center text-red-400 bg-red-900/30 border border-red-500/30 p-3 rounded-lg">{error}</p>}
          {!loading && !error && (
            <ul className="space-y-3">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-4 transition-all duration-300 ${todo.completed ? "opacity-50" : "hover:bg-slate-700/50 hover:border-slate-600"}`}
                  >
                    <div className="flex items-center cursor-pointer" onClick={() => handleToggleTodo(todo.id)}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${todo.completed ? "bg-sky-500 border-sky-500" : "border-slate-500"}`}>
                        {" "}
                        {todo.completed && <CheckIcon />}{" "}
                      </div>
                      <span className={`ml-4 text-lg ${todo.completed ? "line-through text-slate-500" : "text-slate-200"}`}> {todo.title} </span>
                    </div>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-slate-500 hover:text-red-400 transition-colors duration-300 p-1 rounded-full hover:bg-slate-700/50">
                      {" "}
                      <TrashIcon />{" "}
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-center text-slate-500 p-6">Yeay! Tidak ada tugas tersisa.</p>
              )}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
