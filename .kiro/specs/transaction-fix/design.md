# Design Document

## Overview

This design addresses the critical transaction creation issue in the BudgetWise application. The root cause is that the `TransactionService.createTransaction()` method is not setting the `title` field from the `TransactionRequest`, even though the `Transaction` entity requires it as a non-nullable field. This causes database constraint violations when attempting to save new transactions.

The fix involves updating the backend service layer to properly map all fields from the request DTO to the entity, ensuring data consistency between the frontend and backend.

## Architecture

The transaction creation flow follows this pattern:
1. **Frontend (React)** → Collects user input and sends TransactionRequest
2. **Controller Layer** → Receives request and delegates to service
3. **Service Layer** → Maps DTO to entity and saves to database
4. **Repository Layer** → Persists transaction to database
5. **Response Flow** → Returns saved transaction data back to frontend

The issue exists in step 3 where the service layer is not properly mapping the `title` field.

## Components and Interfaces

### Backend Components

#### TransactionService (Needs Fix)
- **Current Issue**: Missing `transaction.setTitle(request.getTitle())` in `createTransaction()` method
- **Fix Required**: Add proper field mapping for title and ensure all required fields are set
- **Method**: `createTransaction(TransactionRequest request, String username)`

#### TransactionRequest DTO (Already Correct)
- Contains all required fields including `title`
- Has proper validation annotations
- Fields: `title`, `description`, `amount`, `type`, `category`, `transactionDate`

#### Transaction Entity (Already Correct)
- Has `title` field marked as `@Column(nullable = false)`
- Contains all necessary fields and relationships
- Proper JPA annotations for database mapping

### Frontend Components

#### Transactions Component (Already Correct)
- Properly collects all required fields including title
- Sends complete TransactionRequest object to backend
- Has proper error handling and user feedback

#### API Service (Already Correct)
- Correctly formats and sends transaction data
- Proper error handling and token management
- Uses correct HTTP methods and endpoints

## Data Models

### TransactionRequest Structure
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "amount": "BigDecimal (required)",
  "type": "INCOME|EXPENSE (required)",
  "category": "string (required)",
  "transactionDate": "LocalDateTime (required)"
}
```

### Transaction Entity Fields
- `id`: Auto-generated primary key
- `title`: Required string field (currently not being set)
- `description`: Optional text field
- `amount`: Required decimal with precision 10, scale 2
- `type`: Required enum (INCOME/EXPENSE)
- `category`: Required string
- `transactionDate`: Required datetime
- `user`: Required foreign key relationship
- `createdAt`/`updatedAt`: Audit fields

## Error Handling

### Current Error Scenario
1. Frontend sends complete transaction data including title
2. Backend service creates Transaction entity but doesn't set title
3. Database save fails due to NOT NULL constraint violation
4. Generic error returned to frontend: "Error creating transaction"

### Improved Error Handling
1. Service layer properly maps all fields including title
2. If validation fails, return specific field-level errors
3. Frontend displays clear, actionable error messages
4. Successful creation returns complete transaction data

### Error Response Format
```json
{
  "message": "Specific error description",
  "field": "fieldName (if applicable)",
  "code": "ERROR_CODE"
}
```

## Testing Strategy

### Unit Tests
- Test `TransactionService.createTransaction()` with valid data
- Test field mapping from TransactionRequest to Transaction entity
- Test validation error scenarios
- Verify all required fields are properly set

### Integration Tests
- Test complete transaction creation flow from controller to database
- Test error handling and response formatting
- Verify database constraints are satisfied
- Test user authentication and authorization

### Frontend Tests
- Test form submission with valid data
- Test error message display
- Test loading states and user feedback
- Test transaction list refresh after creation

## Implementation Approach

### Phase 1: Backend Fix
1. Update `TransactionService.createTransaction()` method
2. Add proper field mapping for title field
3. Ensure all TransactionRequest fields are mapped to Transaction entity
4. Add comprehensive error handling

### Phase 2: Validation Enhancement
1. Add server-side validation for all required fields
2. Improve error messages for better user experience
3. Ensure consistent validation between frontend and backend

### Phase 3: Testing and Verification
1. Test transaction creation with various data combinations
2. Verify error handling works correctly
3. Test integration between frontend and backend
4. Validate database constraints are satisfied

## Security Considerations

- Maintain existing JWT authentication for transaction endpoints
- Ensure users can only create transactions for their own account
- Validate transaction amounts to prevent negative values for expenses
- Sanitize input data to prevent injection attacks

## Performance Considerations

- Transaction creation should remain fast (< 200ms)
- Database indexes on user_id and transaction_date for efficient queries
- Proper connection pooling for database operations
- Minimal impact on existing transaction retrieval performance