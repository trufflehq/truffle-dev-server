import { getDomainModel } from "./utils/domain.ts";

// req for vite build to not statically replace.
// vite does it bc normally vite builds client code. this is server code
const serverEnv = process.env;

export async function getDomain(req) {
  const domainName = serverEnv.HOST_OVERRIDE ||
    req.headers["x-forwarded-host"] || req.headers.host ||
    serverEnv.SPOROCARP_HOST;

  const domain = await getDomainModel({ domainName });

  if (!domain) {
    throw new Error(`Domain not found: ${domainName}`);
  }
  return domain;
}

export { getNestedRoutes } from "./db-router.ts";
