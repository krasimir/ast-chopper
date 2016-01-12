# AST chopper

You have an abstract syntax tree, the code that the tree is produced from and you want to verify the nodes inside are correct. The tool is language agnostic. As long as you have the original input and its AST it works.

## AST requirements

Should be in the following format:

```
{
  "type": "File",
  "start": 0,
  "end": 50,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 4,
      "column": 1
    }
  },
  "program": {...},
  "comments": [...],
  "tokens": [...]
}
```

*Notes*

* The AST should contain `start`, `end` and `loc` properties in its nodes.