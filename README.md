# @theyahia/kaiten-mcp

> 📦 Part of **[WWmcp — Emerging Markets MCP](https://github.com/theYahia/WWmcp)** — 114 MCP servers for non-Western APIs (Brazil/MENA/Gulf/SE Asia/Africa/CIS).

MCP server for **Kaiten** kanban API. **10 tools** for boards, cards, columns, comments, tags, and users.

[![npm](https://img.shields.io/npm/v/@theyahia/kaiten-mcp)](https://www.npmjs.com/package/@theyahia/kaiten-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Part of the [Russian API MCP](https://github.com/theYahia/russian-mcp) series by [@theYahia](https://github.com/theYahia).

## Setup

1. In Kaiten, go to **Profile > API tokens**
2. Create a new token
3. Note your subdomain (e.g. `mycompany` from `mycompany.kaiten.ru`)

## Usage with Claude Desktop

```json
{
  "mcpServers": {
    "kaiten": {
      "command": "npx",
      "args": ["-y", "@theyahia/kaiten-mcp"],
      "env": {
        "KAITEN_DOMAIN": "your-domain",
        "KAITEN_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add kaiten -e KAITEN_DOMAIN=your-domain -e KAITEN_TOKEN=your-token -- npx -y @theyahia/kaiten-mcp
```

## Try this prompt

> *"Создай задачу в колонке 'In Progress' доски 'Sprint 23', назначь @alex, добавь тег bug"*

The agent will call `list_boards` → `list_columns` → `create_card` → `list_users` → `update_card` → `list_tags` and chain the operations.

## Pairs well with

- **[planfix-mcp](https://github.com/theYahia/planfix-mcp)** — RU project management / CRM
- **[megaplan-mcp](https://github.com/theYahia/megaplan-mcp)** — RU all-in-one business platform
- **[yandex-tracker-mcp](https://github.com/theYahia/yandex-tracker-mcp)** — Yandex's Jira-like tracker

Browse all 114 servers in the [WWmcp catalog](https://github.com/theYahia/WWmcp).

## Tools (10)

| Tool | Description |
|------|-------------|
| `list_boards` | List all boards |
| `list_columns` | List columns of a board |
| `list_cards` | List cards with filters by board and column |
| `get_card` | Get a single card by ID |
| `create_card` | Create a card on a board in a column |
| `update_card` | Update card title, description, owner |
| `move_card` | Move a card to a different column |
| `add_comment` | Add a comment to a card |
| `list_tags` | List all workspace tags |
| `list_users` | List all workspace users |

## Demo Prompts

```
Show all boards in Kaiten
List columns on board 123
Create a card "Fix login bug" on board 123, column 456
Move card 789 to column "Done"
Add a comment to card 100: "Deployed to staging"
Show all tags
Who are the users in our Kaiten workspace?
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KAITEN_DOMAIN` | Yes | Your Kaiten subdomain (e.g. `mycompany`) |
| `KAITEN_TOKEN` | Yes | API token from profile settings |

## License

MIT

---

**Part of [WWmcp](https://github.com/theYahia/WWmcp)** — the emerging-markets MCP catalog. ⭐ Star the catalog if you find these servers useful, and [open an issue](https://github.com/theYahia/WWmcp/issues) to request a server for another non-Western API.
