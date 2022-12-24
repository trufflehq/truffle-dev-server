import { g as I } from "./domain.js";
import { gql as P, getClient as y } from "https://tfl.dev/@truffle/api@^0.2.0/client.ts";
const c = "(.*)", C = "(.+)", l = P`
  query RouteConnectionWithExtras($input: RouteConnectionInput!) {
    routeConnection(input: $input, first: 100) {
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
async function _({ domain: t }) {
  const n = {
    input: { packageVersionId: t.packageVersionId }
  }, o = await y().query(l, n).toPromise();
  o.data.routeConnection || console.log("missing routeConnection", o, l, n);
  const r = o.data.routeConnection.nodes;
  return r.filter(({ parentId: s }) => s === E).map((s) => f({ route: s, routes: r }));
}
function f({ route: t, routes: n, parentPath: o = "" }) {
  var d, p, h, u;
  const r = ((d = t.pathWithVariables) == null ? void 0 : d.replace(/\/\*/g, `/${c}`)) || "", a = {
    path: (r == null ? void 0 : r.replace(o, "")) || "",
    type: t.type,
    moduleUrl: (u = (h = (p = t.componentInstance) == null ? void 0 : p.component) == null ? void 0 : h.module) == null ? void 0 : u.url,
    children: n.filter(({ parentId: e }) => e === t.id).map((e) => f({ route: e, routes: n, parentPath: r })).sort((e, i) => e.path === `/${c}` ? 2 : e.path ? -1 : 1)
  };
  if (a.children.find(({ path: e, type: i }) => !e && i === "page")) {
    const e = a.children.findIndex(({ path: R }) => R === `/${c}`);
    e !== -1 && (a.children[e].path = `/${C}`);
  }
  return a;
}
const m = process.env;
async function x(t) {
  const n = m.HOST_OVERRIDE || t.headers["x-forwarded-host"] || t.headers.host || m.SPOROCARP_HOST, o = await I({ domainName: n });
  if (!o)
    throw new Error(`Domain not found: ${n}`);
  return o;
}
export {
  x as getDomain,
  _ as getNestedRoutes
};
