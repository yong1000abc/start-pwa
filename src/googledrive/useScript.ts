import {useEffect, useState} from 'react';

export const useScript = (url: string) => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  useEffect(() => {
    getScript(url).then(() => setIsFetched(true));
  }, [url]);
  return {isFetched};
};

function getScript(url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = reject;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
