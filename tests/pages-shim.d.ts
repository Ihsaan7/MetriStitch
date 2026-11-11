// The real type comes from @cloudflare/workers-types inside functions/tsconfig.json.
// This small stand-in lets the root type check and the function test compile without it.
declare type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Response | Promise<Response>;
