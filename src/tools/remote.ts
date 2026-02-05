import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitRemoteTool: ToolDefinition = {
  name: "git_remote",
  description: "Manage remote repositories",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      action: { 
        type: "string", 
        enum: ["list", "add", "remove", "show", "set-url"],
        description: "Action (default: list)" 
      },
      name: { type: "string", description: "Remote name" },
      url: { type: "string", description: "Remote URL" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const action = (args.action as string) ?? "list";
    const gitArgs = ["remote"];
    
    switch (action) {
      case "list":
        gitArgs.push("-v");
        break;
      case "add":
        if (!args.name || !args.url) return error("Name and URL required");
        gitArgs.push("add", args.name as string, args.url as string);
        break;
      case "remove":
        if (!args.name) return error("Remote name required");
        gitArgs.push("remove", args.name as string);
        break;
      case "show":
        if (!args.name) return error("Remote name required");
        gitArgs.push("show", args.name as string);
        break;
      case "set-url":
        if (!args.name || !args.url) return error("Name and URL required");
        gitArgs.push("set-url", args.name as string, args.url as string);
        break;
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git remote failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout, action });
  },
};