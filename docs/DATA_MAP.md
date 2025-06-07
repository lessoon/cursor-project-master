# Data Map

## 1. Data Entities / Tables
*[List each major data entity or database table and its schema. For each, provide a brief description and list of fields (with types).]*

- **User** – stores user account information  
  - id (UUID, primary key)  
  - name (string)  
  - email (string, unique)  
  - password_hash (string)  
  - created_at (datetime)  
- **Order** – stores order records (if e-commerce context)  
  - id (UUID, primary key)  
  - user_id (UUID, foreign key to User)  
  - items (json or text, list of items purchased)  
  - total_price (decimal)  
  - created_at (datetime)  
- *... additional entities as needed ...*

## 2. Entity Relationships
*[Describe relationships between entities: one-to-many, many-to-many (with join tables if any), etc.]*

- *Each **User** can have many **Orders** (1-to-N relationship).*  
- *...*

## 3. Data Flow / Lifecycle
*[If applicable, describe how data flows through the system. E.g., "User data is created during signup (User table), then used in authentication (JWT generation). Order data flows from frontend form to backend API to DB, then triggers an email via ..."]*

## 4. Data Constraints and Validation
*[List any constraints, such as field validation rules or business rules related to data.]*

- *Email must be unique and follow standard email format.*  
- *Password is stored hashed using Bcrypt (salted) – never stored in plaintext.*  
- *Order total_price is calculated as sum of item prices – must match sum of line items.*  
- *...*

## 5. Sample Data (Optional)
*[Provide examples of what the data might look like in JSON or table form, which can be useful for testing and for the AI to understand the structure.]*

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Alice",
    "email": "alice@example.com",
    "password_hash": "$2b$10$...",
    "created_at": "2025-06-01T10:00:00Z"
  },
  "order": {
    "id": "223e4567-e89b-12d3-a456-426614174111",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "items": "[{\"product\":\"Book\",\"price\":9.99},{\"product\":\"Pen\",\"price\":1.50}]",
    "total_price": 11.49,
    "created_at": "2025-06-02T15:30:00Z"
  }
}
````