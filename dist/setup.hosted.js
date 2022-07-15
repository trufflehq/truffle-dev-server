import { gql as m, getClient as g } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";
const i = "(.*)", f = "(.+)", P = m`
  query RouteConnectionWithExtras($input: RouteConnectionInput!) {
    routeConnection(input: $input) {
      nodes {
        id # req for cache categoryFn
        parentId
        pathWithVariables
        type
        componentInstance {
          id # req for cache categoryFn
          props
          sharedProps
          parentId
          treeSiblingIndex
          treePath
          rank
          component {
            id # req for cache categoryFn
            module { url }
          } 
        }
      }
    }
  }`, y = "00000000-0000-0000-0000-000000000000";
async function T({ domain: t }) {
  const r = (await g().query(P, {
    input: { packageVersionId: t.packageVersionId }
  }).toPromise()).data.routeConnection.nodes;
  return r.filter(({ parentId: e }) => e === y).map((e) => I({ route: e, routes: r }));
}
function I({ route: t, routes: a, parentPath: r = "" }) {
  var d, p, h, u;
  const o = ((d = t.pathWithVariables) == null ? void 0 : d.replace(/\/\*/g, `/${i}`)) || "", e = {
    path: (o == null ? void 0 : o.replace(r, "")) || "",
    type: t.type,
    moduleUrl: (u = (h = (p = t.componentInstance) == null ? void 0 : p.component) == null ? void 0 : h.module) == null ? void 0 : u.url,
    children: a.filter(({ parentId: n }) => n === t.id).map((n) => I({ route: n, routes: a, parentPath: o })).sort((n, c) => n.path === `/${i}` ? 2 : n.path ? -1 : 1)
  };
  if (e.children.find(({ path: n, type: c }) => !n && c === "page")) {
    console.log("hasIndex");
    const n = e.children.findIndex(({ path: R }) => R === `/${i}`);
    console.log("wild", n, e.children), n !== -1 && (e.children[n].path = `/${f}`);
  }
  return e;
}
const l = process.env, E = m`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    packageId
    org { slug }
  }
}`;
async function x(t) {
  var e;
  const a = l.HOST_OVERRIDE || t.headers["x-forwarded-host"] || t.headers.host || l.SPOROCARP_HOST, o = await g().query(E, { domainName: a, _skipAuth: !0 }).toPromise(), s = (e = o == null ? void 0 : o.data) == null ? void 0 : e.domain;
  if (!s)
    throw new Error(`Domain not found: ${a}`);
  return s;
}
export {
  x as getDomain,
  T as getNestedRoutes
};
