import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitFetchTool: ToolDefinition = {
  name: "git_fetch",
  description: "Download objects and refs from remote",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      remote: { type: "string", description: "Remote name (default: origin)" },
      all: { type: "boolean", description: "Fetch all remotes" },
      prune: { type: "boolean", description: "Prune deleted remote branches" },
      tags: { type: "boolean", description: "Fetch tags" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["fetch"];
    
    if (args.all) gitArgs.push("--all");
    if (args.prune) gitArgs.push("--prune");
    if (args.tags) gitArgs.push("--tags");
    if (!args.all && args.remote) gitArgs.push(args.remote as string);

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git fetch failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr || "Fetch complete" });
  },
};