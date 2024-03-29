import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal = props => {
  const { children, selector = '#modal' } = props;
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current) : null;
};
