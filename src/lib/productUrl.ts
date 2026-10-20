type ProductLink = {
  id: string;
  name: string;
  slug?: string;
};

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductPath(product: ProductLink): string {
  return `/product/${product.slug || slugifyProductName(product.name) || product.id}`;
}
