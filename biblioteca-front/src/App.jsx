import React, { useEffect, useState } from 'react';

export default function App() {
  const API_URL = 'https://biblioteta-api-jar7.vercel.app/api/livros';

  const [livros, setLivros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [erro, setErro] = useState(null);

  // Buscar todos os livros ao iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ao buscar livros: ${res.status}`);
        return res.json();
      })
      .then(data => setLivros(data))
      .catch(err => {
        console.error(err);
        setErro('Não foi possível carregar os livros.');
      });
  }, []);

  // Adicionar livro
  const addLivro = async (e) => {
    e.preventDefault();
    setErro(null);
    if (!titulo || !autor) {
      setErro('Título e autor são obrigatórios.');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor })
      });

      if (!res.ok) {
        const erroData = await res.json().catch(() => null);
        console.error('Erro na API:', erroData || res.statusText);
        setErro(erroData?.erro || 'Erro ao adicionar livro.');
        return;
      }

      const novo = await res.json();
      setLivros([...livros, novo]);
      setTitulo('');
      setAutor('');
    } catch (err) {
      console.error('Erro ao adicionar livro:', err);
      setErro('Erro de conexão com a API.');
    }
  };

  // Deletar livro
  const deleteLivro = async (id) => {
    setErro(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Erro ao deletar: ${res.status}`);
      setLivros(livros.filter(l => l.id !== id));
    } catch (err) {
      console.error('Erro ao deletar livro:', err);
      setErro('Erro ao deletar o livro.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">📚 Biblioteca Online</h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

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
