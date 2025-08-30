import React, { useEffect, useState } from 'react';

export default function App() {
  // URL da rota da API
  const API_URL = 'https://biblioteta-api-jar7.vercel.app/api/livros';
  
  const [livros, setLivros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  // Buscar todos os livros ao iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setLivros(data))
      .catch(err => console.error(err));
  }, []);

  // Adicionar livro
  const addLivro = async (e) => {
    e.preventDefault();
    if (!titulo || !autor) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor })
      });
      const novo = await res.json();
      setLivros([...livros, novo]);
      setTitulo('');
      setAutor('');
    } catch (err) {
      console.error('Erro ao adicionar livro:', err);
    }
  };

  // Deletar livro
  const deleteLivro = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setLivros(livros.filter(l => l.id !== id));
    } catch (err) {
      console.error('Erro ao deletar livro:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">📚 Biblioteca Online</h1>

      <form onSubmit={addLivro} className="bg-white p-4 rounded-2xl shadow-md flex gap-3 mb-6">
        <input 
          type="text" 
          placeholder="Título" 
          value={titulo} 
          onChange={e => setTitulo(e.target.value)} 
          className="border p-2 rounded-lg" 
        />
        <input 
          type="text" 
          placeholder="Autor" 
          value={autor} 
          onChange={e => setAutor(e.target.value)} 
          className="border p-2 rounded-lg" 
        />
        <button 
          type="submit" 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Adicionar
        </button>
      </form>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-4">
        {livros.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum livro cadastrado.</p>
        ) : (
          <ul className="divide-y">
            {livros.map(l => (
              <li key={l.id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-semibold">{l.titulo}</p>
                  <p className="text-sm text-gray-500">{l.autor}</p>
                </div>
                <button 
                  onClick={() => deleteLivro(l.id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
