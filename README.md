# 🔧 MCP Git Server

[![npm version](https://badge.fury.io/js/@artik0din%2Fmcp-git.svg)](https://badge.fury.io/js/@artik0din%2Fmcp-git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)

A complete Git CLI wrapper for the Model Context Protocol (MCP). Provides 100% of git functionality through MCP tools for AI assistants like Claude.

## ✨ Features

- 🎯 **Complete Git CLI wrapper** - All git commands available as MCP tools
- 📝 **Repository information** - Status, logs, diffs, and commit details
- 🌿 **Branch management** - Create, delete, switch, and merge branches
- 📦 **Staging & commits** - Add files, commit changes, reset, and stash
- 🌐 **Remote operations** - Clone, fetch, pull, push, and remote management
- 🔒 **Secure** - No credential storage, uses your existing git configuration

## 📋 Prerequisites

- **Git CLI** must be installed and accessible in PATH
- **Node.js** 16+ for running the MCP server
- Existing git configuration (`git config --global user.name` and `user.email`)

## 🚀 Quick Start

### Using with npx (recommended)
```bash
npx @artik0din/mcp-git
```

### Install globally
```bash
npm install -g @artik0din/mcp-git
mcp-git
```

## 🔧 MCP Client Setup

Add this server to your MCP client configuration:

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["@artik0din/mcp-git"]
    }
  }
}
```

### Other MCP Clients
```json
{
  "name": "git",
  "command": "npx",
  "args": ["@artik0din/mcp-git"]
}
```

## 📚 Available Tools

### Repository Information
- **git_status** - Show working tree status
  - `path` (string, required) - Repository path
  - `short` (boolean) - Give output in short format

- **git_log** - Show commit logs
  - `path` (string, required) - Repository path
  - `limit` (number) - Number of commits (default: 10)
  - `oneline` (boolean) - One line per commit
  - `branch` (string) - Branch name
  - `author` (string) - Filter by author
  - `since` (string) - Show commits since date
  - `until` (string) - Show commits until date
  - `grep` (string) - Filter by commit message

- **git_diff** - Show changes between commits/working tree
  - `path` (string, required) - Repository path
  - `staged` (boolean) - Show staged changes
  - `commit` (string) - Compare with commit
  - `file` (string) - Specific file to diff
  - `stat` (boolean) - Show diffstat only

- **git_show** - Show commit details and diff
  - `path` (string, required) - Repository path
  - `commit` (string) - Commit SHA (default: HEAD)
  - `stat` (boolean) - Show diffstat only

### Branch Management
- **git_branch** - List, create, or delete branches
  - `path` (string, required) - Repository path
  - `action` (string) - Action: list, create, delete, rename
  - `name` (string) - Branch name
  - `new_name` (string) - New name for rename
  - `all` (boolean) - List all branches including remote
  - `force` (boolean) - Force delete

- **git_checkout** - Switch branches or restore files
  - `path` (string, required) - Repository path
  - `branch` (string) - Branch to checkout
  - `create` (boolean) - Create new branch (-b)
  - `file` (string) - File to restore

- **git_merge** - Merge branches
  - `path` (string, required) - Repository path
  - `branch` (string) - Branch to merge
  - `no_ff` (boolean) - Create merge commit even if fast-forward possible
  - `squash` (boolean) - Squash commits
  - `message` (string) - Merge commit message
  - `abort` (boolean) - Abort current merge

### Staging & Commits
- **git_add** - Add file contents to staging area
  - `path` (string, required) - Repository path
  - `files` (array) - Files to add (use ['.'] for all)
  - `all` (boolean) - Add all changes (-A)
  - `update` (boolean) - Update tracked files only (-u)

- **git_commit** - Record changes to repository
  - `path` (string, required) - Repository path
  - `message` (string, required) - Commit message
  - `all` (boolean) - Automatically stage modified files (-a)
  - `amend` (boolean) - Amend previous commit
  - `allow_empty` (boolean) - Allow empty commit

- **git_reset** - Reset current HEAD to specified state
  - `path` (string, required) - Repository path
  - `commit` (string) - Commit to reset to (default: HEAD)
  - `mode` (string) - Reset mode: soft, mixed, hard (default: mixed)
  - `files` (array) - Unstage specific files

- **git_stash** - Stash changes in working directory
  - `path` (string, required) - Repository path
  - `action` (string) - Action: push, pop, apply, list, drop, clear
  - `message` (string) - Stash message (for push)
  - `index` (number) - Stash index (for pop/apply/drop)
  - `include_untracked` (boolean) - Include untracked files

### Remote Operations
- **git_remote** - Manage remote repositories
  - `path` (string, required) - Repository path
  - `action` (string) - Action: list, add, remove, show, set-url
  - `name` (string) - Remote name
  - `url` (string) - Remote URL

- **git_fetch** - Download objects and refs from remote
  - `path` (string, required) - Repository path
  - `remote` (string) - Remote name (default: origin)
  - `all` (boolean) - Fetch all remotes
  - `prune` (boolean) - Prune deleted remote branches
  - `tags` (boolean) - Fetch tags

- **git_pull** - Fetch and integrate with remote branch
  - `path` (string, required) - Repository path
  - `remote` (string) - Remote name (default: origin)
  - `branch` (string) - Branch name
  - `rebase` (boolean) - Rebase instead of merge
  - `ff_only` (boolean) - Fast-forward only

- **git_push** - Update remote refs and objects
  - `path` (string, required) - Repository path
  - `remote` (string) - Remote name (default: origin)
  - `branch` (string) - Branch name
  - `force` (boolean) - Force push
  - `force_with_lease` (boolean) - Force push with lease (safer)
  - `set_upstream` (boolean) - Set upstream for branch (-u)
  - `tags` (boolean) - Push tags
  - `delete` (boolean) - Delete remote branch

- **git_clone** - Clone a repository
  - `url` (string, required) - Repository URL
  - `destination` (string) - Destination directory
  - `branch` (string) - Branch to checkout
  - `depth` (number) - Shallow clone depth
  - `recursive` (boolean) - Clone submodules recursively

## 🔒 Security

This server uses your existing git configuration and credentials. It does not store or manage any sensitive information:

- Uses system-installed git CLI
- Respects your existing SSH keys and credentials
- No network requests outside of git operations
- All operations performed in specified directories only

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.