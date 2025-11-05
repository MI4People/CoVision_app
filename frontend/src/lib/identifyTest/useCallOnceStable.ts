import { useEffect } from "react";

/**
 * call callback once flakyValue is stable for a certain time
 */
export function useCallOnceStable(
  flakyValue: boolean,
  handleValueStable: () => void,
  timeStable: number,
) {
  useEffect(() => {
    if (!flakyValue) {
      return;
    }

    const timeout = setTimeout(() => {
      handleValueStable();
    }, timeStable);

    return () => {
      clearTimeout(timeout);
    };
  }, [flakyValue, handleValueStable, timeStable]);
}
