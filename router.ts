// TODO: smarter detection of node and deno in sep lib or context
const isSsr = typeof document === "undefined" ||
  globalThis?.process?.release?.name === "node";

export function addRouteAction(route) {
  return {
    ...route,
    path: route.path === "/*" ? "" : route.path,
    action: isSsr ? ssrAction : clientAction,
    children: route.path === "/*" ? [] : route.children.map(addRouteAction),
  };
}

// create a dom node and reuse existing dom nodes for layouts
async function clientAction(context) {
  const { path, params, route } = context;
  const childElement = await context.next();

  let pageElement;
  // pages can't have children
  if (!childElement && route.page) {
    const pageElementName = (await import(/* @vite-ignore */route.page.replace(".", "")))
      ?.default;
    return document.createElement(pageElementName);
  }

  let layoutElement;
  if (route.layout) {
    const layoutElementName = (await import(/* @vite-ignore */route.layout.replace(".", "")))
      ?.default;

    // reuse existing layout, if there is one
    const existingLayoutElement = document.querySelector(
      `${layoutElementName}#${CSS.escape(route.fullPath)}`,
    );
    // FIXME: cannot update unmounted root
    // FIXME: would need to update existing layout's children
    // replaceChildren doesn't seem to work properly
    layoutElement = existingLayoutElement ||
      document.createElement(layoutElementName);
    layoutElement.id = route.fullPath;

    if (pageElement) {
      layoutElement.replaceChildren(pageElement);
    } else if (childElement) {
      layoutElement.replaceChildren(childElement);
    }
    return layoutElement;
  }

  return childElement;
}

// create the full concat'd string of component elements
async function ssrAction(context) {
  const { path, params, route } = context;
  let template = ``;

  let layoutElementName;
  if (route.layout) {
    layoutElementName = (await import(/* @vite-ignore */route.layout.replace(".", "")))?.default;
    template += `<${layoutElementName} id="layout-${route.fullPath}">`;
  }

  let pageElementName;
  if (route.page) {
    pageElementName = (await import(/* @vite-ignore */route.page.replace(".", "")))?.default;
    template += `<${pageElementName}>`;
  }

  const child = await context.next();
  if (child) {
    template += child;
  }

  if (pageElementName) {
    template += `</${pageElementName}>`;
  }

  if (layoutElementName) {
    template += `</${layoutElementName}>`;
  }

  return template || null;
}
