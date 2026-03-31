# @theyahia/kaiten-mcp

MCP-сервер для Kaiten API — карточки, доски, канбан. **3 инструмента.**

[![npm](https://img.shields.io/npm/v/@theyahia/kaiten-mcp)](https://www.npmjs.com/package/@theyahia/kaiten-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "kaiten": {
      "command": "npx",
      "args": ["-y", "@theyahia/kaiten-mcp"],
      "env": { "KAITEN_DOMAIN": "your-domain", "KAITEN_TOKEN": "your-token" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add kaiten -e KAITEN_DOMAIN=your-domain -e KAITEN_TOKEN=your-token -- npx -y @theyahia/kaiten-mcp
```

### VS Code / Cursor

```json
{ "servers": { "kaiten": { "command": "npx", "args": ["-y", "@theyahia/kaiten-mcp"], "env": { "KAITEN_DOMAIN": "your-domain", "KAITEN_TOKEN": "your-token" } } } }
```

### Windsurf

```json
{ "mcpServers": { "kaiten": { "command": "npx", "args": ["-y", "@theyahia/kaiten-mcp"], "env": { "KAITEN_DOMAIN": "your-domain", "KAITEN_TOKEN": "your-token" } } } }
```

> Требуется `KAITEN_DOMAIN` (поддомен вашего аккаунта) и `KAITEN_TOKEN` (API-токен из настроек профиля).

## Инструменты (3)

| Инструмент | Описание |
|------------|----------|
| `get_cards` | Список карточек с фильтрацией по доске и колонке |
| `create_card` | Создание карточки на доске |
| `get_boards` | Список досок |

## Примеры

```
Покажи все доски в Kaiten
Карточки на доске 123
Создай карточку "Баг: не работает кнопка" на доске 123 в колонке 456
```

## Лицензия

MIT
