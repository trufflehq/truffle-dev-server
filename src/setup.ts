import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";

// req for vite build to not statically replace.
// vite does it bc normally vite builds client code. this is server code
const serverEnv = process.env;

const DEFAULT_MYCELIUM_API_URL = "https://mycelium.staging.bio";

// NOTE: this gets injected into dom for client, so DO NOT put anything secret in here!!!
export const clientConfig = {
  IS_DEV_ENV: serverEnv.NODE_ENV !== "production",
  IS_STAGING_ENV: serverEnv.NODE_ENV === "staging",
  IS_PROD_ENV: serverEnv.NODE_ENV === "production",
  PUBLIC_API_URL: serverEnv.PUBLIC_MYCELIUM_API_URL || DEFAULT_MYCELIUM_API_URL,
  API_URL: serverEnv.PUBLIC_MYCELIUM_API_URL || DEFAULT_MYCELIUM_API_URL,
  HOST: serverEnv.SPOROCARP_HOST || "dev.sporocarp.dev",
};
export const serverConfig = {
  PUBLIC_API_URL: serverEnv.PUBLIC_MYCELIUM_API_URL || DEFAULT_MYCELIUM_API_URL,
  API_URL: serverEnv.MYCELIUM_API_URL || DEFAULT_MYCELIUM_API_URL,
};

// NOTE: this gets sent to client. needs to be public data and JSON.stringify-able
export async function getInitialClientData(
  { req, res, options, clientConfig },
) {
  const context = globalContext.getStore();
  const isHostedEnv = process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging";

  const { getDomain, getNestedRoutes } = await import(
    isHostedEnv ? "./setup.hosted.ts" : "./setup.local.ts"
  );
  const domain = await getDomain(req, options);

  // need to get user before we get routes, so we 1) have org set, and 2) can get routes authed
  // to filter out routes they shouldn't be able to see
  const clientContext = {
    orgId: domain?.orgId,
    packageVersionId: domain?.packageVersionId,
    packageId: domain?.packageId,
  };
  // set context now so anything in followed fns can use it
  Object.assign(context, clientContext);
  const routes = await getNestedRoutes({ domain });

  return {
    clientConfig,
    routes,
    clientContext,
  };
}
