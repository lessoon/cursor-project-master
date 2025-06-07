# Architecture Guide

## 1. High-Level Architecture
*[Reiterate the overall architecture in prose. Explain the design philosophy: e.g., "This application is built on a client-server model with a React frontend and Express backend. It's designed with a clear separation between concerns..."]*

- *Frontend:* *[Describe how the front-end is structured, e.g., single-page app with routing, major UI frameworks or state management libraries.]*  
- *Backend:* *[Describe backend structure, e.g., layered architecture with controllers/services/DAO, usage of any frameworks.]*  
- *Infrastructure:* *[Mention how the app is hosted, any microservices or a monolithic architecture, etc.]*  

## 2. Notable Design Patterns
*[Highlight any design patterns or best practices used in the code. E.g., "Uses Repository pattern for data access", "Applies MVC pattern in backend", "Functional programming style in utility modules".]*

## 3. Codebase Organization
*[Provide a map of the repository folders and what each contains, if not obvious.]*

/frontend - React app source code (components, hooks, redux store, etc.)
/backend  - Express server source (routes, controllers, services, models)
/infra    - Infrastructure as code (Dockerfiles, deployment scripts)
...

*[Explain any naming conventions or file organization principles.]*

## 4. How to Extend
*[Guidelines for future contributors (or the AI for future tasks) on how to add new features. E.g., "When adding a new feature, create a new route in backend, add corresponding service and model as needed, update the PRD and test cases." This section essentially encodes the workflow so it's transparent to users and the AI.]*

## 5. Known Trade-offs and Future Improvements
*[Discuss any areas of the architecture that were debated or could be improved later. E.g., "We chose a simple file-based storage for now (trade-off on scalability). In future, might switch to S3.", or "No caching layer implemented yet, which may affect performance for X; consider adding Redis later."]*

## 6. References
*[If relevant, link to any external architectural decision records or relevant documentation. Possibly mention the original PRD/Tech Spec as source documents.]*