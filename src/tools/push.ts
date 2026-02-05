import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitPushTool: ToolDefinition = {
  name: "git_push",
  description: "Update remote refs and objects",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      remote: { type: "string", description: "Remote name (default: origin)" },
      branch: { type: "string", description: "Branch name" },
      force: { type: "boolean", description: "Force push" },
      force_with_lease: { type: "boolean", description: "Force push with lease (safer)" },
      set_upstream: { type: "boolean", description: "Set upstream for branch (-u)" },
      tags: { type: "boolean", description: "Push tags" },
      delete: { type: "boolean", description: "Delete remote branch" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["push"];
    
    if (args.force) gitArgs.push("--force");
    if (args.force_with_lease) gitArgs.push("--force-with-lease");
    if (args.set_upstream) gitArgs.push("-u");
    if (args.tags) gitArgs.push("--tags");
    if (args.delete && args.branch) {
      gitArgs.push(args.remote as string ?? "origin", "--delete", args.branch as string);
    } else {
      if (args.remote) gitArgs.push(args.remote as string);
      if (args.branch) gitArgs.push(args.branch as string);
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git push failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr || "Push complete" });
  },
};