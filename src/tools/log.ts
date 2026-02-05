import { json, error, execGit, type ToolDefinition } from "../lib/mcp-core";

export const gitLogTool: ToolDefinition = {
  name: "git_log",
  description: "Show commit logs",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Repository path" },
      limit: { type: "number", description: "Number of commits (default: 10)" },
      oneline: { type: "boolean", description: "One line per commit" },
      branch: { type: "string", description: "Branch name" },
      author: { type: "string", description: "Filter by author" },
      since: { type: "string", description: "Show commits since date" },
      until: { type: "string", description: "Show commits until date" },
      grep: { type: "string", description: "Filter by commit message" },
    },
    required: ["path"],
  },
  handler: async (args) => {
    const gitArgs = ["log", `--max-count=${args.limit ?? 10}`];
    
    if (args.oneline) gitArgs.push("--oneline");
    else gitArgs.push("--pretty=format:%H|%an|%ae|%ad|%s", "--date=iso");
    
    if (args.author) gitArgs.push(`--author=${args.author}`);
    if (args.since) gitArgs.push(`--since=${args.since}`);
    if (args.until) gitArgs.push(`--until=${args.until}`);
    if (args.grep) gitArgs.push(`--grep=${args.grep}`);
    if (args.branch) gitArgs.push(args.branch as string);

    const result = await execGit(gitArgs, { cwd: args.path as string });
    
    if (!result.success) {
      return error(`git log failed: ${result.stderr}`);
    }
    
    return json({ output: result.stdout });
  },
};