# TypeScript standards

## Prefer interfaces for object shapes

- Prefer `interface` over `type` for object-shaped declarations, including data models, component props, and object parameters or return values. Apply this consistently across the codebase.
- Use `type` when an interface cannot express the construct clearly or directly, such as unions, intersections, tuples, primitive aliases, mapped or conditional types, and utility-type compositions.
- Do not use `type` for an object shape merely out of habit. If an object shape needs to combine with a union, keep the object definitions as interfaces and use a type alias for the union.

```ts
interface Variable {
  id: string;
  name: string;
}

interface ComponentProps {
  variable: Variable;
}

type Direction = "higher" | "lower";
type SearchResult = Variable | null;
```
