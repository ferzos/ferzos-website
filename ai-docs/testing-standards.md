# Testing standards

## Shared mocks

- Before adding a mock in a test, always check the shared test utilities and Jest setup for an existing mock function. Reuse it rather than duplicating mock setup; extend the shared utility when another test needs the same behavior.

## UI queries

- Do not import or use `screen` in UI tests. Destructure the needed `getBy*` query functions from the `render()` result.
- Choose queries in this priority order, following [Testing Library's query priority](https://testing-library.com/docs/queries/about/):
  1. `getByRole`, preferably with an accessible `name`.
  2. `getByLabelText` for form fields.
  3. `getByPlaceholderText` only when a placeholder is the available user-facing identifier.
  4. `getByText` for non-interactive content.
  5. `getByDisplayValue` for a form element's current value.
  6. `getByAltText` for elements with alt text.
  7. `getByTitle` when no higher-priority query fits.
  8. `getByTestId` only as a last resort when the element cannot reasonably be selected by the queries above.
- Use the matching `queryBy*` query when asserting that an element is absent, and `findBy*` when waiting for an element to appear asynchronously.

```tsx
const { getByRole, getByText } = render(<Example />);

expect(getByRole("button", { name: "Save" })).toBeInTheDocument();
expect(getByText("Saved")).toBeInTheDocument();
```

## Test names

The `should ...` naming convention applies to every type of unit test, including function, hook, and UI unit tests. It also applies to UI integration tests.

Use the following pattern:

```ts
it('should <expected output or state> when <user action or scenario>', () => {
  // Test implementation.
});
```

- Start the test name with `should`. Do not include `it` in the name; `it()` already supplies it.
- Describe the expected, observable output or state.
- Describe the input, action, or scenario that leads to that outcome when relevant.
- For UI unit tests and UI integration tests, prefer user behavior over implementation details such as event handlers or internal methods.
- For function and hook unit tests, describe the returned value or exposed state for the tested input or action.
- Keep names specific enough to explain the behavior without reading the test implementation.
- Apply the same naming convention to parameterized tests using `it.each()`.

### Examples

| Preferred | Avoid |
| --- | --- |
| `should show modal when submit button is clicked` | `should show modal when onClick is triggered` |
| `should show an error when a fractional number of shops is entered` | `should reject non-integers` |
| `should show a stopping distance of 3.68 km when a 10 km journey is entered` | `should show 37% of the remaining km` |
| `should show 1 shop when 3 shops are entered` | `should use singular for 1` |
| `should return 1 shop when 3 shops are available` | `objects: singular for 1` |
| `should expose an updated count after increment is called` | `updates count` |

## UI test scope

Describe user interactions and observable UI results. Do not claim that a button was clicked or a message was displayed unless the test actually exercises that interaction or display.

Exact values are useful when they express the expected UI outcome; avoid making the test name a description of the underlying algorithm.

## Function and hook unit-test scope

Use `should ...` names to describe the expected return value, exposed state, or observable effect. User-interaction wording is not required for non-UI tests. Do not claim that an interaction or rendering occurred when the test only calls a function or exercises a hook.