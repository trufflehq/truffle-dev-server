import { gql as u, getClient as a } from "https://tfl.dev/@truffle/api@^0.2.0/client.ts";
const p = u`
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
}`, s = u`query DomainByDomainName($input: DomainInput) {
  domain(input: $input) {
    orgId
    packageVersionId
    packageId
    org { slug }
  }
}`;
async function d({ packageVersionId: o, domainName: r }) {
  var t, i, e;
  if (o)
    return (i = (t = (await a().query(p, {
      input: { packageVersionId: o },
      _skipAuth: !0
    }).toPromise()).data) == null ? void 0 : t.domainConnection) == null ? void 0 : i.nodes[0];
  {
    const n = await a().query(s, { input: { domainName: r }, _skipAuth: !0 }).toPromise();
    return (e = n == null ? void 0 : n.data) == null ? void 0 : e.domain;
  }
}
export {
  d as g
};
