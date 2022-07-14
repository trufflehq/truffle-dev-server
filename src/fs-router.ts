import fs from "fs";
import glob from "glob";
// import { existsSync } from "https://deno.land/std@0.144.0/fs/mod.ts";
// import glob from "https://npm.tfl.dev/glob@8";

const existsSync = fs.existsSync;

const WILDCARD_PATH = "(.*)";
const WILDCARD_PATH_NOT_EMPTY = "(.+)";
// const WILDCARD_PATH = "(.+)";
const DIR = "./routes";

type NestedRoute = {
  fullPath: string;
  path: string;
  moduleUrl: string;
  depth: number;
  children: NestedRoute[];
};

type Route = {
  path: string;
  filename: string;
};

function getRoutes() {
  return glob
    // only match directories
    .sync(`**/*/`, { cwd: DIR })
    .map((filename: string) => ({
      filename,
      path: `/${filename.substr(0, filename.length - 1)}` // get rid of trailing slash
        // nextjs style catch alls `[...slug]`. dir names can't be * on windows
        // TODO: support the difference between [[...slug]] and [...slug]
        // https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)
        .replace(/\[?\[\.\.\.(.*?)\]\]?/g, WILDCARD_PATH)
        // /abc/[param] -> /abc/:param
        .replace(/\[(.*?)\]/g, ":$1"),
    }));
}

export function getNestedRoutes() {
  return [getNestedRoute()];
}

function getNestedRoute(
  { route, path = "", parentPath = "" } = {},
): NestedRoute {
  const routes = getRoutes();

  const depth = path.match(/\//g)?.length || 0;

  const dir = `${DIR}/${route?.filename || ""}`;
  const pageFile = glob.sync("page.{js,jsx,ts,tsx}", { cwd: dir })?.[0];
  const layoutFile = glob.sync("layout.{js,jsx,ts,tsx}", { cwd: dir })?.[0];

  const pageModuleUrl = pageFile && `${dir}${pageFile}`;
  const layoutModuleUrl = layoutFile && `${dir}${layoutFile}`;

  const children = getChildren({ routes, parentPath: path, depth });

  if (pageModuleUrl) {
    // top-level page within the layout (we always have a layout route)
    const wildcardRouteIndex = children.findIndex(({ path }) =>
      path === `/${WILDCARD_PATH}`
    );
    const hasWildcard = wildcardRouteIndex !== -1;
    if (hasWildcard) {
      // need to change the wildcard path from (.*) to (.+), otherwise
      // "" and (.*) behave the same
      children[wildcardRouteIndex].path = `/${WILDCARD_PATH_NOT_EMPTY}`;
    }
    children.push({
      fullPath: path,
      path: "",
      moduleUrl: pageModuleUrl,
      depth,
      children: [], // pages can't have children
    });
  }

  // consider this the layout
  return {
    fullPath: path || "",
    path: path?.replace(parentPath, "") || "",
    moduleUrl: layoutModuleUrl, // can be empty
    depth,
    children: children,
  };
}

function getChildren(
  { routes, parentPath, depth }: {
    routes: Route[];
    parentPath: string;
    depth: number;
  },
): NestedRoute[] {
  return routes
    .filter((childRoute: Route) => {
      const childDepth = childRoute.path.match(/\//g)?.length;
      const isNextDepth = childDepth === depth + 1;
      const isSubroute = childRoute.path.indexOf(parentPath) !== -1;
      return isNextDepth && isSubroute;
    })
    .map((childRoute: Route) =>
      getNestedRoute({ route: childRoute, path: childRoute.path, parentPath })
    )
    // wildcard at end
    .sort((a, b) => a.path === `/${WILDCARD_PATH}` ? 1 : -1);
}
