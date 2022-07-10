import { getClient, gql } from "https://tfl.dev/@truffle/api@0.1.0/client.js";

const GET_DOMAIN_QUERY = gql`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    org { slug }
  }
}`;

export async function getDomain(req) {
  const domainName = process.env.SPOROCARP_HOST ||
    req.headers["x-forwarded-host"] || req.headers.host;

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
