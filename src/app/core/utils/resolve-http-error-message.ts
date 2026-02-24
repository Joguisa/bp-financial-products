import { HttpErrorResponse } from '@angular/common/http';
import { HTTP_ERROR_MESSAGES } from '../constants/http-error-messages.constants';
import { HttpStatusCode } from '../constants/http-status.constants';

export function resolveHttpErrorMessage(
    error: HttpErrorResponse
): string {

    if (error.error instanceof ErrorEvent) {
        return `Error: ${error.error.message}`;
    }

    return (
        error.error?.message ||
        HTTP_ERROR_MESSAGES[error.status as HttpStatusCode] ||
        `Error ${error.status}: ${error.statusText}`
    );
}