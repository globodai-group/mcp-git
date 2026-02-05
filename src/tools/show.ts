import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitShowTool: ToolDefinition = {
  name: "git_show",
  description: "Show commit details and diff",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      commit: { type: "string", description: "Commit SHA (default: HEAD)" },
      stat: { type: "boolean", description: "Show diffstat only" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["show"];
    if (args.stat) gitArgs.push("--stat");
    gitArgs.push(args.commit as string ?? "HEAD");

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git show failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout });
  },
};