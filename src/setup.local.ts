import { getClient, gql } from "https://tfl.dev/@truffle/api@^0.1.0/client.js";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";

const GET_DOMAIN_QUERY = gql`query DomainGetConnection($packageVersionId: ID) {
  domainConnection(packageVersionId: $packageVersionId) {
    nodes {
      id
      domainName
      packageVersionId
      packageId
      orgId
    }
  }
}`;

export async function getDomain(req, { packageVersion }) {
  if (!packageVersion) {
    console.warn("PackageVersion not found, you may need to deploy first");
    return null;
  }

  const query = GET_DOMAIN_QUERY;
  const variables = { packageVersionId: packageVersion.id };

  const response = await getClient().query(query, variables).toPromise();

  const domain = response.data?.domainConnection.nodes[0];

  if (!domain) {
    const context = globalContext.getStore();
    console.warn(
      "Domain not found:",
      packageVersion.id,
      JSON.stringify(context.config, null, 2),
      response.error?.message,
    );
  }

  return domain;
}

export { getNestedRoutes } from "./fs-router.ts";
