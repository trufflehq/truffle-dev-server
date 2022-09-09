import { getClient, gql } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";

// req for vite build to not statically replace.
// vite does it bc normally vite builds client code. this is server code
const serverEnv = process.env;

const GET_DOMAIN_QUERY = gql`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    packageId
    org { slug }
  }
}`;

export async function getDomain(req) {
  const domainName = serverEnv.HOST_OVERRIDE ||
    req.headers["x-forwarded-host"] || req.headers.host ||
    serverEnv.SPOROCARP_HOST;

  const client = getClient();
  const domainResponse = await client
    .query(GET_DOMAIN_QUERY, { domainName, _skipAuth: true })
    .toPromise();
  const domain = domainResponse?.data?.domain;
  if (!domain) {
    throw new Error(`Domain not found: ${domainName}`);
  }
  return domain;
}

export { getNestedRoutes } from "./db-router.ts";
