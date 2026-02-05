import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitCheckoutTool: ToolDefinition = {
  name: "git_checkout",
  description: "Switch branches or restore working tree files",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      branch: { type: "string", description: "Branch to checkout" },
      create: { type: "boolean", description: "Create new branch (-b)" },
      file: { type: "string", description: "File to restore" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["checkout"];
    
    if (args.create && args.branch) {
      gitArgs.push("-b", args.branch as string);
    } else if (args.branch) {
      gitArgs.push(args.branch as string);
    } else if (args.file) {
      gitArgs.push("--", args.file as string);
    } else {
      return error("Specify branch or file");
    }

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git checkout failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr, success: true });
  },
};