import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitCloneTool: ToolDefinition = {
  name: "git_clone",
  description: "Clone a repository",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "Repository URL" },
      destination: { type: "string", description: "Destination directory" },
      branch: { type: "string", description: "Branch to checkout" },
      depth: { type: "number", description: "Shallow clone depth" },
      recursive: { type: "boolean", description: "Clone submodules recursively" },
    },
    required: ["url"],
  },
  handler: async (args) => {
    const gitArgs = ["clone"];
    
    if (args.branch) gitArgs.push("-b", args.branch as string);
    if (args.depth) gitArgs.push("--depth", String(args.depth));
    if (args.recursive) gitArgs.push("--recursive");
    gitArgs.push(args.url as string);
    if (args.destination) gitArgs.push(args.destination as string);

    const result = await execGit(gitArgs, { timeout: 300000 }); // 5 min timeout
    
    if (!result.success) {
      return error(`git clone failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout || result.stderr || "Clone complete" });
  },
};