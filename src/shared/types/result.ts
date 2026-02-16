/**
 * Result Pattern - Manejo de errores funcional
 * Inspirado en Rust y Kotlin
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(public readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Success(fn(this.value));
  }

  flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  mapError<F>(_fn: (error: never) => F): Result<T, F> {
    return this as any;
  }

  match<U>(onSuccess: (value: T) => U, _onFailure: (error: never) => U): U {
    return onSuccess(this.value);
  }

  getOrThrow(): T {
    return this.value;
  }

  getOrElse(_defaultValue: T): T {
    return this.value;
  }
}

export class Failure<E> {
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(public readonly error: E) {}

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as any;
  }

  flatMap<U>(_fn: (value: never) => Result<U, E>): Result<U, E> {
    return this as any;
  }

  mapError<F>(fn: (error: E) => F): Result<never, F> {
    return new Failure(fn(this.error));
  }

  match<U>(_onSuccess: (value: never) => U, onFailure: (error: E) => U): U {
    return onFailure(this.error);
  }

  getOrThrow(): never {
    throw this.error;
  }

  getOrElse<T>(defaultValue: T): T {
    return defaultValue;
  }
}

// ============================================
// HELPERS
// ============================================

export const Ok = <T>(value: T): Result<T, never> => new Success(value);
export const Err = <E>(error: E): Result<never, E> => new Failure(error);

/**
 * Ejecuta una función async y retorna un Result
 */
export async function tryAsync<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Ejecuta una función sync y retorna un Result
 */
export function trySync<T>(fn: () => T): Result<T, Error> {
  try {
    const value = fn();
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}

// ============================================
// EJEMPLOS DE USO
// ============================================

/*
// Ejemplo 1: Básico
const result = await tryAsync(() => authService.signIn(email, password));

if (result.isSuccess) {
  console.log('Usuario:', result.value);
} else {
  console.error('Error:', result.error);
}

// Ejemplo 2: Con map
const userNameResult = result.map(user => user.name);

// Ejemplo 3: Con match
const message = result.match(
  user => `Bienvenido ${user.name}`,
  error => `Error: ${error.message}`
);

// Ejemplo 4: Chain de operaciones
const finalResult = await tryAsync(() => authService.signIn(email, password))
  .then(r => r.map(user => user.id))
  .then(r => r.flatMap(id => fetchUserProfile(id)));
*/
