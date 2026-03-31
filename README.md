# @theyahia/kaiten-mcp

MCP-сервер для Kaiten API — карточки, доски, колонки, теги, пользователи, пространства. **12 инструментов, 2 скилла.**

[![npm](https://img.shields.io/npm/v/@theyahia/kaiten-mcp)](https://www.npmjs.com/package/@theyahia/kaiten-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Smithery](https://smithery.ai/badge/@theyahia/kaiten-mcp)](https://smithery.ai/server/@theyahia/kaiten-mcp)

> **Kaiten** — российская система управления проектами с канбан-досками.
> [Зарегистрируйтесь по реферальной ссылке](https://kaiten.ru/?utm_source=referral&ref=theyahia) и получите бонус. Реферальная программа: **15-40% recurring на 24 месяца**.

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "kaiten": {
      "command": "npx",
      "args": ["-y", "@theyahia/kaiten-mcp"],
      "env": { "KAITEN_TOKEN": "your-token" }
    }
  }
}
```

С кастомным доменом (`acme.kaiten.ru`):

```json
{
  "mcpServers": {
    "kaiten": {
      "command": "npx",
      "args": ["-y", "@theyahia/kaiten-mcp"],
      "env": { "KAITEN_DOMAIN": "acme", "KAITEN_TOKEN": "your-token" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add kaiten -e KAITEN_TOKEN=your-token -- npx -y @theyahia/kaiten-mcp
```

### Smithery

[![Install on Smithery](https://smithery.ai/badge/@theyahia/kaiten-mcp)](https://smithery.ai/server/@theyahia/kaiten-mcp)

### VS Code / Cursor

```json
{ "servers": { "kaiten": { "command": "npx", "args": ["-y", "@theyahia/kaiten-mcp"], "env": { "KAITEN_TOKEN": "your-token" } } } }
```

### Windsurf

```json
{ "mcpServers": { "kaiten": { "command": "npx", "args": ["-y", "@theyahia/kaiten-mcp"], "env": { "KAITEN_TOKEN": "your-token" } } } }
```

### Streamable HTTP (для веб-клиентов)

```bash
KAITEN_TOKEN=your-token npx @theyahia/kaiten-mcp --http --port 3001
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|-----------|-------------|----------|
| `KAITEN_TOKEN` | Да | API-токен из настроек профиля Kaiten |
| `KAITEN_DOMAIN` | Нет | Поддомен (например `acme` для `acme.kaiten.ru`). По умолчанию: `mykaiten.ru` |

## Инструменты (12)

### Карточки
| Инструмент | Описание |
|------------|----------|
| `get_cards` | Список карточек с фильтрацией по доске и колонке |
| `get_card` | Получить одну карточку по ID |
| `create_card` | Создание карточки на доске |
| `update_card` | Обновить карточку (название, описание, колонку, владельца) |

### Доски и колонки
| Инструмент | Описание |
|------------|----------|
| `get_boards` | Список досок |
| `get_columns` | Колонки доски по board_id |

### Теги
| Инструмент | Описание |
|------------|----------|
| `get_tags` | Все теги пространства |
| `add_tag_to_card` | Добавить тег к карточке |

### Пользователи
| Инструмент | Описание |
|------------|----------|
| `get_users` | Список пользователей |
| `get_current_user` | Текущий пользователь (владелец токена) |

### Пространства
| Инструмент | Описание |
|------------|----------|
| `get_spaces` | Список пространств |
| `get_space` | Пространство по ID с досками |

## Скиллы (2)

| Скилл | Описание |
|-------|----------|
| `skill-my-cards` | Мои карточки на доске — автоматически находит карточки текущего пользователя |
| `skill-create-card` | Интерактивное создание карточки с выбором доски и колонки |

## Примеры

```
Покажи все доски в Kaiten
Карточки на доске 123
Создай карточку "Баг: не работает кнопка" на доске 123 в колонке 456
Покажи мои карточки
Какие колонки на доске 123?
Кто в команде?
Покажи все теги
```

## Разработка

```bash
npm install
npm test          # Vitest
npm run dev       # stdio
npm run start:http # HTTP на порту 3001
```

## Лицензия

MIT
