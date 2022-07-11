import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

// NOTE: this gets injected into dom for client, so DO NOT put anything secret in here!!!
export const clientConfig = {
  IS_DEV_ENV: process.env.NODE_ENV === "development",
  IS_STAGING_ENV: false,
  IS_PROD_ENV: process.env.NODE_ENV !== "development",
  PUBLIC_API_URL: process.env.PUBLIC_MYCELIUM_API_URL,
  API_URL: process.env.PUBLIC_MYCELIUM_API_URL,
  HOST: process.env.SPOROCARP_HOST || "dev.sporocarp.dev",
};
export const serverConfig = {
  PUBLIC_API_URL: process.env.PUBLIC_MYCELIUM_API_URL,
  API_URL: process.env.MYCELIUM_API_URL,
};

// NOTE: this gets sent to client. needs to be public data and JSON.stringify-able
export async function getInitialClientContext(
  { req, res, options, clientConfig },
) {
  const context = globalContext.getStore();
  const { getDomain, getNestedRoutes } = await import(
    process.env.NODE_ENV === "development"
      ? "./setup.local.ts"
      : "./setup.hosted.ts"
  );
  const domain = await getDomain(req, options);
  // need to get user before we get routes, so we 1) have org set, and 2) can get routes authed
  // to filter out routes they shouldn't be able to see
  const nowServerContext = {
    orgId: domain?.orgId,
    packageVersionId: domain?.packageVersionId,
  };
  Object.assign(context, nowServerContext);
  const routes = await getNestedRoutes({ domain });

  return {
    config: clientConfig,
    _routes: routes,
    ...nowServerContext,
  };
}
