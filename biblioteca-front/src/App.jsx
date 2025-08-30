import React, { useEffect, useState } from 'react';

export default function App() {
  const API_URL = 'https://biblioteta-api-jar7.vercel.app/api/livros';

  const [livros, setLivros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setLivros(data))
      .catch(err => console.error('Erro na API:', err));
  }, []);

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

  const deleteLivro = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setLivros(livros.filter(l => l.id !== id));
    } catch (err) {
      console.error('Erro ao deletar livro:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-green-100 via-blue-100 to-purple-100 p-8">
      <h1 className="text-5xl font-extrabold text-green-700 mb-8 drop-shadow-lg">
        📚 Minha Biblioteca
      </h1>

      {/* Formulário */}
      <form 
        onSubmit={addLivro} 
        className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full max-w-md transform hover:scale-102 transition-transform duration-300"
      >
        <input 
          type="text" 
          placeholder="Título do livro" 
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="border border-gray-300 rounded-xl p-4 w-full focus:ring-4 focus:ring-green-300 placeholder-gray-400 transition-all duration-200"
        />
        <input 
          type="text" 
          placeholder="Autor" 
          value={autor}
          onChange={e => setAutor(e.target.value)}
          className="border border-gray-300 rounded-xl p-4 w-full focus:ring-4 focus:ring-green-300 placeholder-gray-400 transition-all duration-200"
        />
        <button 
          type="submit"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-green-700 font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Adicionar
        </button>
      </form>

      {/* Lista de livros */}
      <div className="w-full max-w-lg mt-10">
        {livros.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Nenhum livro cadastrado.</p>
        ) : (
          livros.map((l, i) => (
            <div 
              key={l.id} 
              className={`bg-white shadow-lg rounded-3xl p-6 mb-5 flex justify-between items-center transform hover:scale-105 transition-transform duration-300 border-l-4 border-green-500`}
            >
              <div>
                <p className="font-extrabold text-xl text-gray-800">{l.titulo}</p>
                <p className="text-gray-500 text-sm mt-1">Autor: {l.autor}</p>
              </div>
              <button 
                onClick={() => deleteLivro(l.id)} 
                className="bg-red-500 text-white px-5 py-2 rounded-2xl hover:bg-red-600 font-semibold shadow-md transform hover:scale-105 transition-transform duration-200"
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
