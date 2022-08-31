import * as path from "path";

import react from 'react';
import reactDom from 'react-dom';

import json from "@rollup/plugin-json";
import {cleandir} from "rollup-plugin-cleandir";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import alias from "rollup-plugin-alias"
import babel from "rollup-plugin-babel";
import copy from 'rollup-plugin-copy'

import * as pkg from "./package.json"
import * as tsconfig from "./tsconfig-require.json"

const outDir = path.join(__dirname, tsconfig.compilerOptions.outDir)
const pathResolve = p => path.resolve(__dirname, p)

//配置规则
export default {
    input:path.join(__dirname, "src/index.ts"),
    //输出文件
    output:[
        //输出CommonJS规范的代码
        {format:"cjs", name:pkg.name, file:path.join(outDir, "index.js")},
        //输出ESM规范的代码
        {format:"esm", name:pkg.name, file:path.join(outDir, "index.esm.js")}
    ],
    //配置插件
    plugins:[
        //自动读取tsconfig.json
        typescript(),
        //自动清除文件夹
        cleandir(outDir),
        //配置Rollup支持CommonJS规范用以识别CommonJS规范的依赖
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                react: Object.keys(react),
                'react-dom': Object.keys(reactDom)
            }
        }),
        //解析node_modules中CommonJS规范的第三方模块
        resolve({
			preferBuiltins: true,
			mainFields: ['browser']
		}),
        alias({"@/": pathResolve("src")}),
        babel({
            babelrc: true,
            exclude: 'node_modules/**'
        }),
        json(),
        copy({
            targets: [
              { src: ['package.json', 'README.md'], dest: `${outDir}` },
            ]
        })
    ],
    external: [
        'react',
        'react-dom',
    ],
}