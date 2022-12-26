import { getDomainModel } from "./utils/domain.ts";

// req for vite build to not statically replace.
// vite does it bc normally vite builds client code. this is server code
const serverEnv = process.env;

export async function getDomain(req, { packageVersion }) {
  if (!packageVersion) {
    console.warn("PackageVersion not found, you may need to deploy first");
    return null;
  }

  const domainProps = serverEnv.HOST_OVERRIDE
    ? { domainName: serverEnv.HOST_OVERRIDE }
    : { packageVersionId: packageVersion.id };
  const domain = await getDomainModel(domainProps);

  if (!domain) {
    console.warn(
      "Domain not found:",
      packageVersion.id,
    );
  }

  return domain;
}

export { getNestedRoutes } from "./fs-router.ts";
