---
trigger: always_on
---

# General Coding Standards

All code generated or refactored must strictly adhere to the following principles to ensure maintainability, scalability, and testability.

## 1. Clean Code Principles
- **Meaningful Names**: Use descriptive and unambiguous names for variables, functions, and classes. Avoid abbreviations.
- **Small Functions**: Functions should do one thing and do it well. Keep them short and focused.
- **Comments**: Code should be self-documenting. Use comments *only* to explain the "why", not the "what" or "how".
- **DRY (Don't Repeat Yourself)**: Avoid code duplication. Extract common logic into reusable functions or components.
- **Consistent Formatting**: Follow the project's existing style guide or standard language conventions (e.g., Prettier/ESLint for JS/TS).
- **Error Handling**: Handle errors gracefully. Avoid silent failures or empty catch blocks.

## 2. SOLID Principles
- **S - Single Responsibility Principle (SRP)**: A class or module should have one, and only one, reason to change.
- **O - Open/Closed Principle (OCP)**: Software entities should be open for extension but closed for modification.
- **L - Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without altering the correctness of the program.
- **I - Interface Segregation Principle (ISP)**: Clients should not be forced to depend on interfaces they do not use. Split large interfaces into smaller, specific ones.
- **D - Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

## 3. Hexagonal Architecture (Ports and Adapters)
- **Domain Centric**: The core business logic (Domain) must remain independent of external frameworks, databases, or UI.
- **Dependency Rule**: Dependencies must point *inwards* towards the Domain. Use dependency injection to invert control.
- **Layers**:
  - **Domain**: Entities, Value Objects, and Domain Services. No external dependencies.
  - **Application**: Use Cases / Interactors that orchestrate valid domain logic.
  - **Infrastructure/Adapters**: Implementations for efficient I/O (Repositories, Controllers, API clients).
- **Ports**: Define interfaces (Ports) in the Domain/Application layer that the Infrastructure layer must implement (Adapters).


## 4. Documentacion legible.
- **API REST - OpenAPI**: toda api rest construida debe tener documetnacion con OpenAPI si ves que no se solicita explicitamente al iniciar el proyecto, investiga como integrar una forma de auto documentacion con la herramienta que se este usando para la contruccion de una API REST y plantea al usuario.
- **JsDoc - cometnarios refenciales**: todos los metodos, funciones, clases y tipados posiblen deben cumplir con documentacion usdano JsDoc.