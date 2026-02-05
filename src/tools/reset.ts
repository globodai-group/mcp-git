import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitResetTool: ToolDefinition = {
  name: "git_reset",
  description: "Reset current HEAD to specified state",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      commit: { type: "string", description: "Commit to reset to (default: HEAD)" },
      mode: { 
        type: "string", 
        enum: ["soft", "mixed", "hard"],
        description: "Reset mode (default: mixed)" 
      },
      files: { 
        type: "array", 
        items: { type: "string" },
        description: "Unstage specific files" 
      },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["reset"];
    
    if (args.files && (args.files as string[]).length > 0) {
      gitArgs.push("--", ...(args.files as string[]));
    } else {
      const mode = args.mode as string ?? "mixed";
      gitArgs.push(`--${mode}`);
      if (args.commit) gitArgs.push(args.commit as string);
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git reset failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || "Reset complete", success: true });
  },
};