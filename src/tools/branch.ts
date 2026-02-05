import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitBranchTool: ToolDefinition = {
  name: "git_branch",
  description: "List, create, or delete branches",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      action: { 
        type: "string", 
        enum: ["list", "create", "delete", "rename"],
        description: "Action to perform (default: list)" 
      },
      name: { type: "string", description: "Branch name (for create/delete/rename)" },
      new_name: { type: "string", description: "New name (for rename)" },
      all: { type: "boolean", description: "List all branches including remote" },
      force: { type: "boolean", description: "Force delete" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const action = (args.action as string) ?? "list";
    const gitArgs = ["branch"];
    
    switch (action) {
      case "list":
        if (args.all) gitArgs.push("-a");
        gitArgs.push("-v");
        break;
      case "create":
        if (!args.name) return error("Branch name required");
        gitArgs.push(args.name as string);
        break;
      case "delete":
        if (!args.name) return error("Branch name required");
        gitArgs.push(args.force ? "-D" : "-d", args.name as string);
        break;
      case "rename":
        if (!args.name || !args.new_name) return error("Both name and new_name required");
        gitArgs.push("-m", args.name as string, args.new_name as string);
        break;
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git branch failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout, action });
  },
};