import { gql as m, getClient as g } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";
const d = "(.*)", f = "(.+)", P = m`
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
  }`, E = "00000000-0000-0000-0000-000000000000";
async function D({ domain: o }) {
  const t = await g().query(P, {
    input: { packageVersionId: o.packageVersionId }
  }).toPromise();
  t.data.routeConnection || console.log("missing routeConnection", t);
  const r = t.data.routeConnection.nodes;
  return r.filter(({ parentId: e }) => e === E).map((e) => I({ route: e, routes: r }));
}
function I({ route: o, routes: t, parentPath: r = "" }) {
  var l, p, u, h;
  const a = ((l = o.pathWithVariables) == null ? void 0 : l.replace(/\/\*/g, `/${d}`)) || "", e = {
    path: (a == null ? void 0 : a.replace(r, "")) || "",
    type: o.type,
    moduleUrl: (h = (u = (p = o.componentInstance) == null ? void 0 : p.component) == null ? void 0 : u.module) == null ? void 0 : h.url,
    children: t.filter(({ parentId: n }) => n === o.id).map((n) => I({ route: n, routes: t, parentPath: a })).sort((n, c) => n.path === `/${d}` ? 2 : n.path ? -1 : 1)
  };
  if (e.children.find(({ path: n, type: c }) => !n && c === "page")) {
    console.log("hasIndex");
    const n = e.children.findIndex(({ path: R }) => R === `/${d}`);
    console.log("wild", n, e.children), n !== -1 && (e.children[n].path = `/${f}`);
  }
  return e;
}
const i = process.env, _ = m`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    packageId
    org { slug }
  }
}`;
async function T(o) {
  var e;
  const t = i.HOST_OVERRIDE || o.headers["x-forwarded-host"] || o.headers.host || i.SPOROCARP_HOST, a = await g().query(_, { domainName: t, _skipAuth: !0 }).toPromise(), s = (e = a == null ? void 0 : a.data) == null ? void 0 : e.domain;
  if (!s)
    throw console.log("Missing domain", o.headers, i.HOST_OVERRIDE, i.SPOROCARP_HOST), console.log("req", o), new Error(`Domain not found: ${t}`);
  return s;
}
export {
  T as getDomain,
  D as getNestedRoutes
};
