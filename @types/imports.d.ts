declare module "*.svg" {
  const value: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}
