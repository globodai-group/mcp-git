import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitPullTool: ToolDefinition = {
  name: "git_pull",
  description: "Fetch and integrate with remote branch",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      remote: { type: "string", description: "Remote name (default: origin)" },
      branch: { type: "string", description: "Branch name" },
      rebase: { type: "boolean", description: "Rebase instead of merge" },
      ff_only: { type: "boolean", description: "Fast-forward only" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["pull"];
    
    if (args.rebase) gitArgs.push("--rebase");
    if (args.ff_only) gitArgs.push("--ff-only");
    if (args.remote) gitArgs.push(args.remote as string);
    if (args.branch) gitArgs.push(args.branch as string);

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git pull failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr });
  },
};