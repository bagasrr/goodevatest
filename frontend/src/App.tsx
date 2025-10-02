import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Konfigurasi URL base untuk API backend
const API_URL = "http://localhost:3000/api/todos";
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  // State untuk menyimpan daftar todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State untuk input todo baru
  const [newTodoTitle, setNewTodoTitle] = useState("");
  // State untuk input search
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk status loading
  const [loading, setLoading] = useState(true);
  // State untuk pesan error
  const [error, setError] = useState<string | null>("");

  // useEffect untuk mengambil data todos saat komponen pertama kali di-render
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setTodos(response.data);
        setError(null);
      } catch (err) {
        setError("Gagal memuat data todo. Pastikan server backend berjalan.");
        console.error(err);
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
      setNewTodoTitle(""); // Reset input
    } catch (err) {
      setError("Gagal menambahkan todo.");
      console.error(err);
    }
  };

  // Handler untuk mengubah status completed todo
  const handleToggleTodo = async (id: number) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`);
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: response.data.completed } : todo)));
    } catch (err) {
      setError("Gagal mengubah status todo.");
      console.error(err);
    }
  };

  // Filter todos di sisi client berdasarkan searchTerm
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => todo.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [todos, searchTerm]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">Todo App</h1>
          <p className="text-gray-400">Dibangun dengan NestJS & React</p>
        </header>

        <main>
          {/* Form untuk menambah todo */}
          <form onSubmit={handleAddTodo} className="mb-8 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Apa yang ingin kamu lakukan?"
              className="flex-grow bg-gray-800 border-2 border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:border-cyan-500 transition"
            />
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-md transition duration-300">
              Add
            </button>
          </form>

          {/* Input untuk search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari todo..."
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Menampilkan status loading atau error */}
          {loading && <p className="text-center text-gray-400">Loading...</p>}
          {error && <p className="text-center text-red-500 bg-red-900/50 p-3 rounded-md">{error}</p>}

          {/* Daftar Todos */}
          {!loading && !error && (
            <div className="bg-gray-800 rounded-lg shadow-lg">
              <ul className="divide-y divide-gray-700">
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo, index) => (
                    <li key={todo.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-6 text-sm">{index + 1}.</span>
                        <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600 cursor-pointer mx-4" />
                        <span className={`text-lg ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.title}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500 p-6">Tidak ada todo.</p>
                )}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
