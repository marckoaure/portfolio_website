import { useSyncExternalStore } from "react";

// Nothing to subscribe to: the value only differs between server and client.
const subscribe = () => () => {};

// `false` on the server and during hydration, `true` once React is live in the
// browser. This is the React-recommended replacement for the old
// "const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true))"
// pattern, which the React Compiler lint now flags as a setState inside an effect.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
