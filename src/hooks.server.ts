import { type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle, authorizationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
