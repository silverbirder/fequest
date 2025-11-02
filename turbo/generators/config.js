module.exports = function generator(plop) {
  plop.setHelper("ensureRelative", (input) => {
    if (typeof input !== "string") return "";
    const trimmed = input.trim();
    if (!trimmed.length) return "";
    return trimmed.startsWith("./") ||
      trimmed.startsWith("../") ||
      trimmed.startsWith("/")
      ? trimmed.replace(/^\/*/, "")
      : trimmed;
  });

  plop.setGenerator("feature", {
    description:
      "Create a feature module",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the feature name?",
        validate: (input) =>
          (input && input.trim().length > 0) || "A feature name is required.",
      },
      {
        type: "input",
        name: "baseDir",
        message: "Where should the feature be created? (relative to repo root)",
        default: "apps/admin/src/features",
        transformer: (input) => input.trim(),
      },
    ],
    actions: (answers) => {
      const actions = [];
      const baseDir = plop.renderString("{{ensureRelative baseDir}}", answers);
      const featureDir = `${baseDir}/{{dashCase name}}`;

      const files = [
        {
          template: "container.tsx.hbs",
          output: `${featureDir}/container.tsx`,
        },
        {
          template: "component.tsx.hbs",
          output: `${featureDir}/component.tsx`,
        },
        {
          template: "presenter.ts.hbs",
          output: `${featureDir}/presenter.ts`,
        },
        {
          template: "spec.tsx.hbs",
          output: `${featureDir}/{{kebabCase name}}.test.tsx`,
        },
        {
          template: "index.ts.hbs",
          output: `${featureDir}/index.ts`,
        },
      ];

      files.forEach(({ template, output }) => {
        actions.push({
          type: "add",
          path: plop.renderString(output, answers),
          templateFile: `templates/feature/${template}`,
          skipIfExists: true,
        });
      });

      return actions;
    },
  });
};
