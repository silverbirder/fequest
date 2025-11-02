export default function generator(plop) {
  plop.setGenerator("react-component", {
    description: "Create a shared UI component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the component name?",
        validate: (input) =>
          (input && input.trim().length > 0) || "A component name is required.",
      },
      {
        type: "input",
        name: "baseDir",
        message:
          "Where should the component be created? (relative to @repo/ui)",
        default: "src/components",
        transformer: (input) => input.trim(),
      },
    ],
    actions: (answers) => {
      const baseDir =
        answers.baseDir && answers.baseDir.trim().length > 0
          ? answers.baseDir.trim()
          : "src/components";
      const componentDir = `${baseDir}/{{kebabCase name}}`;
      const indexPath = `${baseDir}/index.ts`;

      const actions = [
        {
          type: "add",
          path: plop.renderString(`${componentDir}/{{kebabCase name}}.tsx`, answers),
          templateFile: "templates/react-component/component.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(
            `${componentDir}/{{kebabCase name}}.test.tsx`,
            answers,
          ),
          templateFile: "templates/react-component/component.test.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(
            `${componentDir}/{{kebabCase name}}.stories.tsx`,
            answers,
          ),
          templateFile: "templates/react-component/component.stories.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(`${componentDir}/index.ts`, answers),
          templateFile: "templates/react-component/component.index.ts.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(indexPath, answers),
          templateFile: "templates/react-component/index.base.ts.hbs",
          skipIfExists: true,
        },
        {
          type: "append",
          path: plop.renderString(indexPath, answers),
          template: 'export * from "./{{kebabCase name}}";',
          separator: "\n",
          unique: true,
        },
      ];

      return actions;
    },
  });
}
