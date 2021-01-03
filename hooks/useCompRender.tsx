import { DependencyList, EffectCallback, useEffect, useRef } from "react";

const useCompRender = (effect: EffectCallback) => {
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      effect();
    } else {
      firstRender.current = false;
    }
  }, []);
};

export default useCompRender;
