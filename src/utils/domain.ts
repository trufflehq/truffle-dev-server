import { getClient, gql } from "https://tfl.dev/@truffle/api@^0.2.0/client.ts";

const GET_DOMAIN_CONNECTION_QUERY = gql`
query DomainGetConnection($input: DomainConnectionInput) {
  domainConnection(input: $input) {
    nodes {
      id
      domainName
      packageVersionId
      packageId
      orgId
    }
  }
}`;

const GET_DOMAIN_QUERY = gql`query DomainByDomainName($input: DomainInput) {
  domain(input: $input) {
    orgId
    packageVersionId
    packageId
    org { slug }
  }
}`;

export async function getDomainModel(
  { packageVersionId, domainName }: {
    packageVersionId?: string;
    domainName?: string;
  },
) {
  if (packageVersionId) {
    // connection makes more sense for packageVersionId since there can be multiple
    const response = await getClient()
      .query(GET_DOMAIN_CONNECTION_QUERY, {
        input: { packageVersionId },
        _skipAuth: true,
      })
      .toPromise();
    return response.data?.domainConnection?.nodes[0];
  } else {
    const domainResponse = await getClient()
      .query(GET_DOMAIN_QUERY, { input: { domainName }, _skipAuth: true })
      .toPromise();
    return domainResponse?.data?.domain;
  }
}
