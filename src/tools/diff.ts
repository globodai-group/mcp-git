import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitDiffTool: ToolDefinition = {
  name: "git_diff",
  description: "Show changes between commits, commit and working tree, etc",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      staged: { type: "boolean", description: "Show staged changes" },
      commit: { type: "string", description: "Compare with commit" },
      file: { type: "string", description: "Specific file to diff" },
      stat: { type: "boolean", description: "Show diffstat only" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["diff"];
    
    if (args.staged) gitArgs.push("--staged");
    if (args.stat) gitArgs.push("--stat");
    if (args.commit) gitArgs.push(args.commit as string);
    if (args.file) gitArgs.push("--", args.file as string);

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git diff failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout });
  },
};