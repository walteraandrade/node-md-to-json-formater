# Markdown to JSON Converter

This Go program converts Markdown files to JSON format, maintaining the structure of the original content.

## Features

- Converts .md files to .json files
- Maintains markdown content hierarchy
- Supports various markdown elements:
  - Headings with levels
  - Paragraphs
  - Lists and list items
  - Code blocks and code spans
  - Links with URLs
  - Images with URLs
- Processes all .md files in a directory recursively

## Installation

```bash
go install github.com/yourusername/md-to-json@latest
```

## Usage

```bash
md-to-json <directory>
```

The program will process all .md files in the specified directory and create corresponding .json files in the same location.

## Example

Given a markdown file `example.md`:

```markdown
# Title

## Header

Some content

### Nested list

- Item 1
  - Subitem
- Item 2

[Link](https://example.com)

![Image](image.jpg)
```

The program will create `example.json` with a structure like:

```json
{
  "type": "document",
  "children": [
    {
      "type": "heading",
      "level": 1,
      "content": "Title",
      "children": []
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Header",
      "children": []
    },
    {
      "type": "paragraph",
      "content": "Some content",
      "children": []
    },
    {
      "type": "heading",
      "level": 3,
      "content": "Nested list",
      "children": []
    },
    {
      "type": "list",
      "children": [
        {
          "type": "list_item",
          "content": "Item 1",
          "children": [
            {
              "type": "list",
              "children": [
                {
                  "type": "list_item",
                  "content": "Subitem",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "type": "list_item",
          "content": "Item 2",
          "children": []
        }
      ]
    },
    {
      "type": "link",
      "content": "Link",
      "link": "https://example.com",
      "children": []
    },
    {
      "type": "image",
      "content": "Image",
      "image_url": "image.jpg",
      "children": []
    }
  ]
}

## Requirements

- Go 1.21 or higher
- markdown parser library (automatically installed via go.mod)
