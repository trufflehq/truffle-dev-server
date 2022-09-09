import { gql as m, getClient as g } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";
const c = "(.*)", f = "(.+)", P = m`
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
async function C({ domain: n }) {
  const o = await g().query(P, {
    input: { packageVersionId: n.packageVersionId }
  }).toPromise();
  o.data.routeConnection || console.log("missing routeConnection", o);
  const r = o.data.routeConnection.nodes;
  return r.filter(({ parentId: e }) => e === y).map((e) => I({ route: e, routes: r }));
}
function I({ route: n, routes: o, parentPath: r = "" }) {
  var d, p, u, h;
  const a = ((d = n.pathWithVariables) == null ? void 0 : d.replace(/\/\*/g, `/${c}`)) || "", e = {
    path: (a == null ? void 0 : a.replace(r, "")) || "",
    type: n.type,
    moduleUrl: (h = (u = (p = n.componentInstance) == null ? void 0 : p.component) == null ? void 0 : u.module) == null ? void 0 : h.url,
    children: o.filter(({ parentId: t }) => t === n.id).map((t) => I({ route: t, routes: o, parentPath: a })).sort((t, s) => t.path === `/${c}` ? 2 : t.path ? -1 : 1)
  };
  if (e.children.find(({ path: t, type: s }) => !t && s === "page")) {
    const t = e.children.findIndex(({ path: R }) => R === `/${c}`);
    t !== -1 && (e.children[t].path = `/${f}`);
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
async function T(n) {
  var e;
  const o = l.HOST_OVERRIDE || n.headers["x-forwarded-host"] || n.headers.host || l.SPOROCARP_HOST, a = await g().query(E, { domainName: o, _skipAuth: !0 }).toPromise(), i = (e = a == null ? void 0 : a.data) == null ? void 0 : e.domain;
  if (!i)
    throw new Error(`Domain not found: ${o}`);
  return i;
}
export {
  T as getDomain,
  C as getNestedRoutes
};
