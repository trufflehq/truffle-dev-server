import { getClient, gql } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";

const WILDCARD_PATH = "(.*)";
const WILDCARD_PATH_NOT_EMPTY = "(.+)";

// TODO: figure out a good way to cache this without relying on caching entire query
// eg componentInstance and component loads that cache based on the array
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

export async function getNestedRoutes({ domain }) {
  const response = await getClient().query(GET_ROUTE_QUERY, {
    input: { packageVersionId: domain.packageVersionId },
  }).toPromise();

  if (!response.data.routeConnection) {
    console.log("missing routeConnection", response);
  }

  const routes = response.data.routeConnection.nodes;

  const rootRoutes = routes.filter(({ parentId }) => parentId === EMPTY_UUID);
  const nestedRoutes = rootRoutes.map((route) =>
    getNestedRoute({ route, routes })
  );

  return nestedRoutes;
}

function getNestedRoute({ route, routes, parentPath = "" }) {
  const path = route.pathWithVariables?.replace(/\/\*/g, `/${WILDCARD_PATH}`) ||
    "";
  const relativePath = path?.replace(parentPath, "") || "";
  const nestedRoute = {
    path: relativePath,
    type: route.type,
    moduleUrl: route.componentInstance?.component?.module?.url,
    children: routes
      .filter(({ parentId }) => parentId === route.id)
      .map((childRoute) =>
        getNestedRoute({ route: childRoute, routes, parentPath: path })
      )
      // wildcard at end
      .sort((a, b) => a.path === `/${WILDCARD_PATH}` ? 2 : !a.path ? 1 : -1),
  };
  const hasIndexPage = nestedRoute.children.find(({ path, type }) =>
    !path && type === "page"
  );
  if (hasIndexPage) {
    console.log("hasIndex");

    const wildcardRouteIndex = nestedRoute.children.findIndex(({ path }) =>
      path === `/${WILDCARD_PATH}`
    );
    console.log("wild", wildcardRouteIndex, nestedRoute.children);

    const hasWildcard = wildcardRouteIndex !== -1;
    if (hasWildcard) {
      // need to change the wildcard path from (.*) to (.+), otherwise
      // "" and (.*) behave the same
      nestedRoute.children[wildcardRouteIndex].path =
        `/${WILDCARD_PATH_NOT_EMPTY}`;
    }
  }
  return nestedRoute;
}
