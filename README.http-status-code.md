# NestJS HTTP Status Codes Reference

This document provides a comprehensive list of HTTP status codes available in NestJS and their corresponding exception classes.

## Common HTTP Exception Classes in NestJS

| Exception Class | Status Code | Status Name | Description |
|-----------------|-------------|-------------|-------------|
| `HttpException` | 200 | OK | Success |
| `HttpException` | 201 | CREATED | Resource created |
| `HttpException` | 202 | ACCEPTED | Request accepted |
| `HttpException` | 204 | NO_CONTENT | No content to return |
| `BadRequestException` | 400 | BAD_REQUEST | Bad request |
| `UnauthorizedException` | 401 | UNAUTHORIZED | Not authenticated |
| `PaymentRequiredException` | 402 | PAYMENT_REQUIRED | Payment required |
| `ForbiddenException` | 403 | FORBIDDEN | Forbidden |
| `NotFoundException` | 404 | NOT_FOUND | Resource not found |
| `MethodNotAllowedException` | 405 | METHOD_NOT_ALLOWED | Method not allowed |
| `NotAcceptableException` | 406 | NOT_ACCEPTABLE | Not acceptable |
| `RequestTimeoutException` | 408 | REQUEST_TIMEOUT | Request timeout |
| `ConflictException` | 409 | CONFLICT | Conflict |
| `GoneException` | 410 | GONE | Resource no longer available |
| `HttpVersionNotSupportedException` | 415 | UNSUPPORTED_MEDIA_TYPE | Unsupported media type |
| `UnprocessableEntityException` | 422 | UNPROCESSABLE_ENTITY | Unprocessable entity |
| `TooManyRequestsException` | 429 | TOO_MANY_REQUESTS | Too many requests |
| `InternalServerErrorException` | 500 | INTERNAL_SERVER_ERROR | Internal server error |
| `NotImplementedException` | 501 | NOT_IMPLEMENTED | Not implemented |
| `BadGatewayException` | 502 | BAD_GATEWAY | Bad gateway |
| `ServiceUnavailableException` | 503 | SERVICE_UNAVAILABLE | Service unavailable |
| `GatewayTimeoutException` | 504 | GATEWAY_TIMEOUT | Gateway timeout |

## Usage Examples

### Import Required Classes

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
```

### Basic Usage

```typescript
// Throw specific exceptions
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input data');
throw new UnauthorizedException('Access token required');
throw new ForbiddenException('Insufficient permissions');
throw new ConflictException('Email already exists');

// Using generic HttpException with custom status
throw new HttpException('Custom error message', HttpStatus.I_AM_A_TEAPOT);
```

### Complete Service Example

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProjectService {
  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid project ID');
    }

    const project = await this.projectsRepo.findOneBy({ id });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }
}
```

## Best Practices

1. **Use specific exception classes** instead of generic `HttpException` when possible
2. **Provide meaningful error messages** that help developers understand the issue
3. **Don't catch HTTP exceptions** in try-catch blocks unless you need to re-throw them
4. **Log unexpected errors** before throwing `InternalServerErrorException`
5. **Use proper status codes** according to REST API standards

## Custom Exception Example

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBusinessException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

// Usage
throw new CustomBusinessException('Business rule violation');
```

---

**Last Updated:** 2025-06-09 12:08:35 UTC  
**Author:** dahani-dev