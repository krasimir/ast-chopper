# AST chopper



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