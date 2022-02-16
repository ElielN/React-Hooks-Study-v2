import { useEffect, useState } from 'react';
import { useFetch } from './use-fetch';

export const Home = () => {
  const [postId, setPostId] = useState('');
  const [result, loading] = useFetch('https://jsonplaceholder.typicode.com/posts/' + postId, {
    headers: {
      abc: '1' + postId,
    },
  });

  useEffect(() => {
    console.log(`ID DO POST ${postId}`);
  }, [postId]);

  // Se o meu fetchHook ainda estiver puxando os dados, loading estará como true
  // e então exibiremos uma mensagem mostrando que está carregando os posts
  if (loading) {
    return (
      <p>
        <strong>Loading...</strong>
      </p>
    );
  }
  // A url está sendo concatenada com o postId, então fazemos alteração desta
  // variável quando um título é clicado para poder "mudar de página"
  const handleClick = (id) => {
    setPostId(id);
  };

  // Se loading for false (fetchHook já puxou os dados) e os posts foram atribuídos
  // ao result, então colocamos os posts (titles) na tela
  if (!loading && result) {
    return (
      // IF ternário para saber se vamos exibir 1 post ou vários posts na tela
      <div>
        {result?.length > 0 ? (
          result.map((p) => (
            <div key={p.id} onClick={() => handleClick(p.id)}>
              <p>{p.title}</p>
            </div>
          ))
        ) : (
          <div onClick={() => handleClick('')}>
            <p>{result.title}</p>
          </div>
        )}
      </div>
    );
  }

  return <h1>Oi</h1>;
};
