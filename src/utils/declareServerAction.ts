export type ErrorResponse = {
  ok: false;
  error: {
    message: string;
  };
  data: null;
};

type SuccessResponse<T> = {
  ok: true;
  data: T;
  error?: never;
};

/**
 * Wraps a server action with automatic error handling.
 * Returns a function that catches errors and returns either the result or an ErrorResponse.
 *
 * @example
 * export const handleUpdateConfig = declareServerAction(
 *   async (input: Record<string, string>) => {
 *     // ... logic
 *   }
 * );
 */
export function declareServerAction<TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>,
): (input: TInput) => Promise<SuccessResponse<TOutput> | ErrorResponse> {
  return async (input: TInput) => {
    try {
      const data = await action(input);
      return { ok: true, data };
    } catch (err) {
      if (err instanceof Error) {
        return {
          ok: false,
          data: null,
          error: {
            message: err.message,
          },
        };
      }
      return {
        ok: false,
        data: null,
        error: {
          message: "Unknown error",
        },
      };
    }
  };
}
