import { useAuth } from "@clerk/react";
import { useRef } from "react";

type GetToken = ReturnType<typeof useAuth>["getToken"];

/**
 * Clerk's `getToken` function identity can change every render. Putting it in
 * `useEffect` deps causes an infinite API refetch loop (seen burning Workers
 * Free daily quota via `/api/v1/ekstrakurikuler`).
 *
 * Returns a stable `getToken` wrapper and `isLoaded` for effect deps.
 */
export function useCmsGetToken(): {
  isLoaded: boolean;
  getToken: GetToken;
} {
  const { getToken, isLoaded } = useAuth();
  const clerkGetTokenRef = useRef(getToken);
  clerkGetTokenRef.current = getToken;

  const stableGetTokenRef = useRef<GetToken>((options) =>
    clerkGetTokenRef.current(options),
  );

  return {
    isLoaded,
    getToken: stableGetTokenRef.current,
  };
}
