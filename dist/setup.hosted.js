import { gql, getClient } from "https://tfl.dev/@truffle/api@0.1.0/client.js";
const WILDCARD_PATH = "(.*)";
const WILDCARD_PATH_NOT_EMPTY = "(.+)";
const GET_ROUTE_QUERY = gql`
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
  }`;
const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";
async function getNestedRoutes({ domain }) {
  const response = await getClient().query(GET_ROUTE_QUERY, {
    input: { packageVersionId: domain.packageVersionId }
  }).toPromise();
  const routes = response.data.routeConnection.nodes;
  const rootRoutes = routes.filter(({ parentId }) => parentId === EMPTY_UUID);
  const nestedRoutes = rootRoutes.map((route) => getNestedRoute({ route, routes }));
  return nestedRoutes;
}
function getNestedRoute({ route, routes, parentPath = "" }) {
  var _a, _b, _c, _d;
  const path = ((_a = route.pathWithVariables) == null ? void 0 : _a.replace(/\/\*/g, `/${WILDCARD_PATH}`)) || "";
  const relativePath = (path == null ? void 0 : path.replace(parentPath, "")) || "";
  const nestedRoute = {
    path: relativePath,
    type: route.type,
    moduleUrl: (_d = (_c = (_b = route.componentInstance) == null ? void 0 : _b.component) == null ? void 0 : _c.module) == null ? void 0 : _d.url,
    children: routes.filter(({ parentId }) => parentId === route.id).map((childRoute) => getNestedRoute({ route: childRoute, routes, parentPath: path })).sort((a, b) => a.path === `/${WILDCARD_PATH}` ? 2 : !a.path ? 1 : -1)
  };
  const hasIndexPage = nestedRoute.children.find(({ path: path2, type }) => !path2 && type === "page");
  if (hasIndexPage) {
    console.log("hasIndex");
    const wildcardRouteIndex = nestedRoute.children.findIndex(({ path: path2 }) => path2 === `/${WILDCARD_PATH}`);
    console.log("wild", wildcardRouteIndex, nestedRoute.children);
    const hasWildcard = wildcardRouteIndex !== -1;
    if (hasWildcard) {
      nestedRoute.children[wildcardRouteIndex].path = `/${WILDCARD_PATH_NOT_EMPTY}`;
    }
  }
  return nestedRoute;
}
const GET_DOMAIN_QUERY = gql`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    org { slug }
  }
}`;
async function getDomain(req) {
  console.log('get domain', req);
  var _a;
  const domainName = {}.HOST_OVERRIDE || req.headers["x-forwarded-host"] || req.headers.host || {}.SPOROCARP_HOST;
  const client = getClient();
  const domainResponse = await client.query(GET_DOMAIN_QUERY, { domainName, _skipAuth: true }).toPromise();
  const domain = (_a = domainResponse == null ? void 0 : domainResponse.data) == null ? void 0 : _a.domain;
  if (!domain) {
    throw new Error(`Domain not found: ${domainName}`);
  }
  return domain;
}
export { getDomain, getNestedRoutes };
