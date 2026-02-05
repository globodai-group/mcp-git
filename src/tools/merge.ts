import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitMergeTool: ToolDefinition = {
  name: "git_merge",
  description: "Merge branches",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      branch: { type: "string", description: "Branch to merge" },
      no_ff: { type: "boolean", description: "Create merge commit even if fast-forward possible" },
      squash: { type: "boolean", description: "Squash commits" },
      message: { type: "string", description: "Merge commit message" },
      abort: { type: "boolean", description: "Abort current merge" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["merge"];
    
    if (args.abort) {
      gitArgs.push("--abort");
    } else {
      if (!args.branch) return error("Branch name required");
      if (args.no_ff) gitArgs.push("--no-ff");
      if (args.squash) gitArgs.push("--squash");
      if (args.message) gitArgs.push("-m", args.message as string);
      gitArgs.push(args.branch as string);
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git merge failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr });
  },
};