#!/usr/bin/env node

/**
 * Git CLI MCP Server
 * 
 * Complete git operations via CLI wrapper.
 * 100% of git functionality available.
 */

import { createMCPServer, startMCPServer } from "./lib/mcp-core.js";

// Repository info
import { gitStatusTool } from "./tools/status.js";
import { gitLogTool } from "./tools/log.js";
import { gitDiffTool } from "./tools/diff.js";
import { gitShowTool } from "./tools/show.js";

// Branching
import { gitBranchTool } from "./tools/branch.js";
import { gitCheckoutTool } from "./tools/checkout.js";
import { gitMergeTool } from "./tools/merge.js";

// Staging & Commits
import { gitAddTool } from "./tools/add.js";
import { gitCommitTool } from "./tools/commit.js";
import { gitResetTool } from "./tools/reset.js";
import { gitStashTool } from "./tools/stash.js";

// Remote operations
import { gitRemoteTool } from "./tools/remote.js";
import { gitFetchTool } from "./tools/fetch.js";
import { gitPullTool } from "./tools/pull.js";
import { gitPushTool } from "./tools/push.js";
import { gitCloneTool } from "./tools/clone.js";

const tools = [
  // Info
  gitStatusTool,
  gitLogTool,
  gitDiffTool,
  gitShowTool,
  // Branching
  gitBranchTool,
  gitCheckoutTool,
  gitMergeTool,
  // Staging & Commits
  gitAddTool,
  gitCommitTool,
  gitResetTool,
  gitStashTool,
  // Remote
  gitRemoteTool,
  gitFetchTool,
  gitPullTool,
  gitPushTool,
  gitCloneTool,
];

const server = createMCPServer(
  {
    name: "mcp-git",
    version: "1.0.0",
    description: "Complete Git CLI wrapper - all git operations",
  },
  tools
);

startMCPServer(server).catch(console.error);