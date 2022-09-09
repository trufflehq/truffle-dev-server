import { gql as I, getClient as R } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";
const d = "(.*)", y = "(.+)", m = I`
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
async function C({ domain: n }) {
  const o = {
    input: { packageVersionId: n.packageVersionId }
  }, r = await R().query(m, o).toPromise();
  r.data.routeConnection || console.log("missing routeConnection", r, m, o);
  const e = r.data.routeConnection.nodes;
  return e.filter(({ parentId: s }) => s === E).map((s) => f({ route: s, routes: e }));
}
function f({ route: n, routes: o, parentPath: r = "" }) {
  var p, u, h, l;
  const e = ((p = n.pathWithVariables) == null ? void 0 : p.replace(/\/\*/g, `/${d}`)) || "", a = {
    path: (e == null ? void 0 : e.replace(r, "")) || "",
    type: n.type,
    moduleUrl: (l = (h = (u = n.componentInstance) == null ? void 0 : u.component) == null ? void 0 : h.module) == null ? void 0 : l.url,
    children: o.filter(({ parentId: t }) => t === n.id).map((t) => f({ route: t, routes: o, parentPath: e })).sort((t, c) => t.path === `/${d}` ? 2 : t.path ? -1 : 1)
  };
  if (a.children.find(({ path: t, type: c }) => !t && c === "page")) {
    const t = a.children.findIndex(({ path: P }) => P === `/${d}`);
    t !== -1 && (a.children[t].path = `/${y}`);
  }
  return a;
}
const g = process.env, _ = I`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    packageId
    org { slug }
  }
}`;
async function T(n) {
  var a;
  const o = g.HOST_OVERRIDE || n.headers["x-forwarded-host"] || n.headers.host || g.SPOROCARP_HOST, e = await R().query(_, { domainName: o, _skipAuth: !0 }).toPromise(), i = (a = e == null ? void 0 : e.data) == null ? void 0 : a.domain;
  if (!i)
    throw new Error(`Domain not found: ${o}`);
  return i;
}
export {
  T as getDomain,
  C as getNestedRoutes
};
