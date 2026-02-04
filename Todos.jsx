import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Plus, CheckCircle, Trash2, Filter, Edit3 } from 'lucide-react';

export default function Todos() {
  const { logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/todos?status=${filter === 'All' ? '' : filter}`);
      setTodos(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/todos', newTodo);
      setTodos([res.data, ...todos]);
      setNewTodo({ title: '', description: '' });
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { 
        status: currentStatus === 'Pending' ? 'Completed' : 'Pending' 
      });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this todo?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditTodo({ title: todo.title, description: todo.description || '' });
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, editTodo);
      setTodos(todos.map(t => t._id === id ? res.data : t));
      setEditingId(null);
      setEditTodo({ title: '', description: '' });
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const pendingCount = todos.filter(t => t.status === 'Pending').length;
  const completedCount = todos.filter(t => t.status === 'Completed').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Todos
          </h1>
          <p className="text-xl font-semibold text-gray-600 mt-2">
            Pending: <span className="text-orange-500">{pendingCount}</span> | 
            Completed: <span className="text-green-500">{completedCount}</span>
          </p>
        </div>
        <button onClick={logout} className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold">
          Logout
        </button>
      </div>

      {error && <p className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl mb-6">{error}</p>}

      <form onSubmit={handleCreate} className="bg-white p-8 rounded-2xl shadow-xl mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <input
            placeholder="Todo title *"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent col-span-2"
            required
          />
          <div className="flex gap-2">
            <input
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button type="submit" className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </form>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Pending', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              filter === status
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            {status}
          </button>
        ))}
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-500 mb-2">No todos yet</h3>
          <p className="text-gray-400">Create your first todo to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              {editingId === todo._id ? (
                <div className="space-y-3">
                  <input
                    value={editTodo.title}
                    onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                  <input
                    value={editTodo.description}
                    onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${todo.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`mt-1 ${todo.status === 'Completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {todo.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleComplete(todo._id, todo.status)}
                      className={`p-2 rounded-xl ml-4 ${todo.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
