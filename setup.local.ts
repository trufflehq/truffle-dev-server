import { getClient, gql } from "https://tfl.dev/@truffle/api@0.1.0/client.js";

const GET_DOMAIN_QUERY = gql`query DomainGetConnection($packageVersionId: ID) {
  domainConnection(packageVersionId: $packageVersionId) {
    nodes {
      id
      domainName
      packageVersionId
    }
  }
}`;

export async function getDomain(req, { packageVersion }) {
  const query = GET_DOMAIN_QUERY;
  const variables = { packageVersionId: packageVersion.id };

  const response = await getClient().query(query, variables).toPromise();
  const domain = response.data?.domainConnection.nodes[0];

  return domain;
}

export { getNestedRoutes } from "./fs-router.ts";
