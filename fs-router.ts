import fs from "fs";
import fg from "glob";
// import { existsSync } from "https://deno.land/std@0.144.0/fs/mod.ts";
// import glob from "https://npm.tfl.dev/glob@8";

const existsSync = fs.existsSync;

const WILDCARD_PATH = "(.*)";
const WILDCARD_PATH_NOT_EMPTY = "(.+)";
// const WILDCARD_PATH = "(.+)";
const DIR = "./routes";

type Route = {
  fullPath: string,
  path: string,
  moduleUrl: string,
  depth: number,
  children: Route[],
}

function getRouteFilenames() {
  return fg
    // only match directories
    .sync(`**/*/`, { cwd: DIR })
    .map((route: string) => `/${route.substr(0, route.length - 1)}`); // get rid of trailing slash
}

export function getRoutes(path = "", parentPath = ""): Route {
  const routeFilenames = getRouteFilenames();

  const depth = path.match(/\//g)?.length || 0;

  const pageModuleUrl = existsSync(`${DIR}${path}/page.tsx`) &&
    `${DIR}${path}/page.tsx`;
  const layoutModuleUrl = existsSync(`${DIR}${path}/layout.tsx`) &&
    `${DIR}${path}/layout.tsx`;

  // nextjs style catch alls `[...slug]`. dir names can't be * on windows
  // TODO: support the difference between [[...slug]] and [...slug]
  // https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)
  path = path.replace(/\[?\[\.\.\.(.*?)\]\]?/, WILDCARD_PATH);
  // /abc/[param] -> /abc/:param
  path = path.replace(/\[(.*?)\]/, ":$1");

  const children = getChildren({ routeFilenames, path, depth })

  if (pageModuleUrl) {
    // top-level page within the layout (we always have a layout route)
    const wildcardRouteIndex = children.findIndex(({ path }) => path === `/${WILDCARD_PATH}`);
    console.log('wc', wildcardRouteIndex);
    
    const hasWildcard = wildcardRouteIndex !== -1
    if (hasWildcard) {
      // need to change the wildcard path from (.*) to (.+), otherwise
      // "" and (.*) behave the same
      children[wildcardRouteIndex].path = `/${WILDCARD_PATH_NOT_EMPTY}`
    }
    children.push({
      fullPath: path,
      path: "",
      moduleUrl: pageModuleUrl,
      depth,
      children: [] // pages can't have children
    })
  }

  // consider this the layout
  return {
    fullPath: path || "",
    path: path?.replace(parentPath, "") || "",
    moduleUrl: layoutModuleUrl, // can be empty
    depth,
    children: children
  }
}

function getChildren ({ routeFilenames, path, depth }: { routeFilenames: string[], path: string, depth: number }): Route[] {
  return routeFilenames
    .filter((childRoute: string) => {
      const childDepth = childRoute.match(/\//g)?.length;
      const isNextDepth = childDepth === depth + 1;
      const isSubroute = childRoute.indexOf(path) !== -1;
      return isNextDepth && isSubroute;
    })
    .map((childRoute: string) => getRoutes(childRoute, path))
    // wildcard at end
    .sort((a, b) => a.path === `/${WILDCARD_PATH}` ? 1 : -1)
}