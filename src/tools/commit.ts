import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitCommitTool: ToolDefinition = {
  name: "git_commit",
  description: "Record changes to the repository",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      message: { type: "string", description: "Commit message" },
      all: { type: "boolean", description: "Automatically stage modified files (-a)" },
      amend: { type: "boolean", description: "Amend previous commit" },
      allow_empty: { type: "boolean", description: "Allow empty commit" },
    },
    required: ["path", "message"],
  },
  handler: async (args) => {
    const gitArgs = ["commit"];
    
    if (args.all) gitArgs.push("-a");
    if (args.amend) gitArgs.push("--amend");
    if (args.allow_empty) gitArgs.push("--allow-empty");
    gitArgs.push("-m", args.message as string);

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git commit failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout, success: true });
  },
};