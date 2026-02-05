import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitAddTool: ToolDefinition = {
  name: "git_add",
  description: "Add file contents to the staging area",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      files: { 
        type: "array", 
        items: { type: "string" },
        description: "Files to add (use ['.'] for all)" 
      },
      all: { type: "boolean", description: "Add all changes (-A)" },
      update: { type: "boolean", description: "Update tracked files only (-u)" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["add"];
    
    if (args.all) {
      gitArgs.push("-A");
    } else if (args.update) {
      gitArgs.push("-u");
    } else if (args.files && (args.files as string[]).length > 0) {
      gitArgs.push(...(args.files as string[]));
    } else {
      return error("Specify files, --all, or --update");
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git add failed: ${result.stderr}`);
    }
    
    return json({ success: true, message: "Files staged" });
  },
};