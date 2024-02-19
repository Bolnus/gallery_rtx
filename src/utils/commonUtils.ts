import React from "react";

export function resetScrollOnBlur() 
{
  //event.preventDefault();
  //let inputElement = event.target as HTMLInputElement;
  //inputElement.focus({preventScroll: true});
  //setTimeout(() => window.scrollTo(0,100), 500)
  window.scrollTo(0, 0);
}

function addDays(date: Date, days: number): Date 
{
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getUpcomingDate(): string 
{
  let date: Date = new Date();
  date = addDays(date, 1);
  return String(
    date.getFullYear() +
      String("00" + (date.getMonth() + 1)).slice(-2) +
      String("00" + date.getDate()).slice(-2) +
      "235959"
  );
}

export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export function onFocusIn(getCatalog: Function, catalogLoaded: boolean) 
{
  if (!catalogLoaded) {
    getCatalog();
  }
}

export function toUnsigned(text: string): number 
{
  const digitArray: RegExpMatchArray | null = text.match(/^\d+$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;

}

export function toInteger(text: string): number 
{
  const digitArray: RegExpMatchArray | null = text.match(/^-?\d+$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;
}

export function toFloat(text: string): number {
  const digitArray: RegExpMatchArray | null = text.match(/^-?\d+(\.\d+)?$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;
}

export function onSimpleDispatchClicked(dispatch: Function, event: React.FormEvent) 
{
  event.preventDefault();
  dispatch();
}

export function stringDispatch(dispatchMethod: Function, value: string) 
{
  dispatchMethod(value);
}

export function numberDispatch(dispatchMethod: Function, value: number) 
{
  dispatchMethod(value);
}

export function invertTrigger(flag: boolean, setValue: Function) 
{
  setValue(!flag);
}
