import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/reduxStore";


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useTypedSelector = useSelector.withTypes<RootState>();
// export const useAppStore = useStore.withTypes<AppStore>();

export function useDebounce<T>(value: T, delay: number): T 
{
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(
    function() 
    {
      // Update debounced value after delay
      const handler = setTimeout(function()
      {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return function()
      {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

function onObserverChange(setIntersecting: (flag: boolean) => void, entries: IntersectionObserverEntry[])
{
  setIntersecting(entries?.[0]?.isIntersecting);
}

export function useIntersectionObserver(
  target: React.MutableRefObject<Element | null>,
  options: IntersectionObserverInit
)
{
  const [intersecting, setIntersecting] = React.useState(false);

  React.useEffect(function()
  {
    let observer: IntersectionObserver;
    if (target.current)
    {
      observer = new IntersectionObserver(onObserverChange.bind(null, setIntersecting), options);
      observer.observe(target.current);
    }
    return function()
    {
      observer?.disconnect();
    };
  }, [target.current]);

  return intersecting;
}