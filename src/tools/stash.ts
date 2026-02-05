import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitStashTool: ToolDefinition = {
  name: "git_stash",
  description: "Stash changes in working directory",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      action: { 
        type: "string", 
        enum: ["push", "pop", "apply", "list", "drop", "clear"],
        description: "Stash action (default: push)" 
      },
      message: { type: "string", description: "Stash message (for push)" },
      index: { type: "number", description: "Stash index (for pop/apply/drop)" },
      include_untracked: { type: "boolean", description: "Include untracked files" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const action = (args.action as string) ?? "push";
    const gitArgs = ["stash", action];
    
    switch (action) {
      case "push":
        if (args.include_untracked) gitArgs.push("-u");
        if (args.message) gitArgs.push("-m", args.message as string);
        break;
      case "pop":
      case "apply":
      case "drop":
        if (args.index !== undefined) gitArgs.push(`stash@{${args.index}}`);
        break;
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git stash failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr || "Done", action });
  },
};