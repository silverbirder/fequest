export default function generator(plop) {
  plop.setGenerator("component", {
    actions: (answers) => {
      const baseDir =
        answers.baseDir && answers.baseDir.trim().length > 0
          ? answers.baseDir.trim()
          : "src/components";
      const componentDir = `${baseDir}/{{kebabCase name}}`;
      const indexPath = `${baseDir}/index.ts`;

      const actions = [
        {
          path: plop.renderString(`${componentDir}/{{kebabCase name}}.tsx`, answers),
          skipIfExists: true,
          templateFile: "templates/component/component.tsx.hbs",
          type: "add",
        },
        {
          path: plop.renderString(
            `${componentDir}/{{kebabCase name}}.spec.tsx`,
            answers,
          ),
          skipIfExists: true,
          templateFile: "templates/component/component.spec.tsx.hbs",
          type: "add",
        },
        {
          path: plop.renderString(
            `${componentDir}/{{kebabCase name}}.stories.tsx`,
            answers,
          ),
          skipIfExists: true,
          templateFile: "templates/component/component.stories.tsx.hbs",
          type: "add",
        },
        {
          path: plop.renderString(`${componentDir}/index.ts`, answers),
          skipIfExists: true,
          templateFile: "templates/component/component.index.ts.hbs",
          type: "add",
        },
        {
          path: plop.renderString(indexPath, answers),
          skipIfExists: true,
          templateFile: "templates/component/index.base.ts.hbs",
          type: "add",
        },
        {
          path: plop.renderString(indexPath, answers),
          separator: "\n",
          template: 'export * from "./{{kebabCase name}}";',
          type: "append",
          unique: true,
        },
      ];

      return actions;
    },
    description: "Create a shared UI component",
    prompts: [
      {
        message: "What is the component name?",
        name: "name",
        type: "input",
        validate: (input) =>
          (input && input.trim().length > 0) || "A component name is required.",
      },
      {
        default: "src/components",
        message:
          "Where should the component be created? (relative to @repo/ui)",
        name: "baseDir",
        transformer: (input) => input.trim(),
        type: "input",
      },
    ],
  });
}
