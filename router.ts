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

  let wcElement;
  if (route.moduleUrl) {
    const { default: wc } =
      await import(/* @vite-ignore */ route.moduleUrl.replace(/^\./, "")) || {};

    // reuse existing layout, if there is one
    const existingLayoutElement = document.querySelector(
      `${wc.tagName}#${getDomId(route)}`,
    );
    wcElement = existingLayoutElement ||
      document.createElement(wc.tagName);
    wcElement.id = getDomId(route);

    if (childElement) {
      wcElement.replaceChildren(childElement);
    }
    return wcElement;
  }

  return childElement;
}

// create the full concat'd string of component elements
async function ssrAction(context) {
  const { path, params, route } = context;
  let template = ``;

  let wc;
  if (route.moduleUrl) {
    wc = (await import(/* @vite-ignore */ route.moduleUrl.replace(/^\./, "")))
      ?.default;
    template += `<${wc.tagName} id="${getDomId(route)}">`;
  }

  const child = await context.next();
  if (child) {
    template += child;
  }

  if (wc) {
    template += `</${wc.tagName}>`;
  }

  return template || null;
}

function kebabCase(str = ""): string {
  return (
    str.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
    ) || []
  )
    .join("-")
    .toLowerCase();
}

function getDomId(route) {
  return `module-${kebabCase(route.fullPath)}`;
}
