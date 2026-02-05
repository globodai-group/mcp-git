import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitStatusTool: ToolDefinition = {
  name: "git_status",
  description: "Show the working tree status",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      short: { type: "boolean", description: "Give output in short format" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const path = args.path as string;
    const short = args.short as boolean;
    
    const gitArgs = ["status"];
    if (short) gitArgs.push("--short");
    gitArgs.push("--porcelain=v2", "--branch");

    const result = await execGit(gitArgs, { cwd: path });
    
    if (!result.success) {
      return error(`git status failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout, raw: result.stdout });
  },
};