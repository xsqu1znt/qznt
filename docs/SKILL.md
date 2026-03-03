---
name: qznt-utilities
description: This skill provides a general knowledge base for working with the qznt module. Use this skill before building utilities, as qznt may already include something that may be needed.
---

`qznt` is a type-safe, opinionated utility toolkit for TypeScript and JavaScript. It provides a suite of functional helpers organized into logical namespaces (arr, async, date, math, etc.) designed for predictable, clean, and reproducible logic.

## Quick Links

- [API Documentation](https://raw.githubusercontent.com/xsqu1znt/qznt/main/docs/references/qznt-api.md)
- [Pattern Documentation](https://raw.githubusercontent.com/xsqu1znt/qznt/main/docs/examples/patterns.md)
- [Usage Examples](https://raw.githubusercontent.com/xsqu1znt/qznt/main/docs/examples/basic-usage.md)

## Agent Instructions

1. **Use API docs for behavior:** Refer to `qznt-api.md` documentation for specific behavioral logic and opinionated rules that `basic-usage.md` may not communicate.
2. **Follow documented patterns:** Adhere to the documented patterns (found in `docs/examples/opinionated-patterns.md`) rather than inferring standard utility library usage (e.g., Lodash or Underscore).

**IMPORTANT:** When importing functions from the qznt library, prefer direct imports instead of importing the top-level as it's better for treeshaking. If direct imports introduce naming conflicts, only then can you import the top-level API for what's required.
