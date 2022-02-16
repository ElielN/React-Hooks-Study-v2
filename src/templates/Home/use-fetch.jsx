import { useEffect, useRef, useState } from 'react';

const isObjectEqual = (objA, objB) => {
  return JSON.stringify(objA) === JSON.stringify(objB);
};

// eslint-disable-next-line no-unused-vars
const useFetch = (url, options) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  // Os objetos são remontados quando ocorre uma renderização, então ao passá-los como
  // dependência em um Hook useEffect, este Hook irá entrar em loop. Para resolver isso
  // bastas usar o useRef porque a referência para o objeto não é atualizada. Fazendo isso
  // é necessário ver quando de fato o objeto mudou para podermos mudar a referência e indicar
  // que a página deve renderizar novamente
  useEffect(() => {
    let changed = false;
    // Verifica se a url realmente mudou
    if (!isObjectEqual(url, urlRef.current)) {
      urlRef.current = url;
      changed = true;
    }
    // Verifica se o options (objeto headers) realmente mudou
    if (!isObjectEqual(options, optionsRef.current)) {
      optionsRef.current = options;
      changed = true;
    }
    // Caso tenha mudado, seta o shouldLoad como true
    if (changed) {
      setShouldLoad((s) => !s);
    }
    // Quando url ou options supostamente forem alterados, chama o useEffect novamente
  }, [url, options]);

  useEffect(() => {
    let wait = false;
    // controller e signal são elementos do navegador que podemos usar para
    // abortar um fetch. Pode ser usado quando o usuário muda de página antes
    // que o fetch tenha sido concluído, ou seja, quando estamos desmontando um componente
    // que faz uso do fetch e o fetch ainda está carregando dados
    const controller = new AbortController();
    const signal = controller.signal;

    //console.log('EFFECT', new DataTransfer().toLocaleString());
    //console.log(optionsRef.current.headers);

    setLoading(true);

    const fetchData = async () => {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const response = await fetch(urlRef.current, { signal, ...optionsRef.current });
        const jsonResult = await response.json();
        // Como o fetch é feito de forma assíncrona, temos que garantir que setResult esteja executando
        // no momento certo. Pra isso usamos uma variável bool (wait)
        if (!wait) {
          setResult(jsonResult);
          setLoading(false);
        }
      } catch (e) {
        if (!wait) {
          setLoading(false);
        }
        //throw e;
        console.warn(e.message);
      }
    };

    fetchData();

    return () => {
      // Caso o usuário execute uma ação que vá desmontar um Component que está fazendo
      // uso de um fetch, iremos abortar a requisição do fetch
      wait = true;
      controller.abort();
    };
  }, [shouldLoad]);

  return [result, loading];
};
