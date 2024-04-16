import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import { glob } from "glob";
import { extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { builtinModules } from "node:module";

export default [
  {
    input: Object.fromEntries(
      glob
        .sync(
          [
            "*.ts",
            "**/*.ts",
            "**/**/*.ts",
            "**/**/**/*.ts",
            "**/**/**/**/*.ts",
          ],
          {
            ignore: ["**/*.d.ts", "**/*.test.ts", "node_modules/**"],
          }
        )
        .map((file) => [
          file.slice(0, file.length - extname(file).length),
          fileURLToPath(new URL(file, import.meta.url)),
        ])
    ),
    output: {
      dir: "build",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: ".",
    },
    external(id) {
      return id.includes(sep + "node_modules" + sep);
    },
    plugins: [
      typescript({ moduleResolution: "bundler" }),
      resolve({ preferBuiltins: true }),
      commonjs({ ignoreDynamicRequires: true, ignore: builtinModules }),
    ],
  },
];
