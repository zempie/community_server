import { getToken } from "./test/utils";

module.exports = async () => ({
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".e2e-spec.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    testResultsProcessor: "./node_modules/jest-slack-integration",
    // setupFilesAfterEnv: ["<rootDir>/setup.ts"],
    globals: {
        token: await getToken()
    }
});
