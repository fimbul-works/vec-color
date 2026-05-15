export default {
  groups: [
    {
      name: "Bundle",
      include: "bundles/bundle.js",
    },
    {
      name: "Functionality",
      include: "bundles/*.js",
      exclude: "bundles/bundle.js",
    },
  ],
  minify: true,
};
