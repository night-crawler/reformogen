# Generic React Project

## M2M and FK relation handling conventions

When we fetch a data instance we presume it already has enough data stored in related fields to be rendered immediately.
If we presume it has only links, or ids like `m2m: [1, 2]` (which, obviously is a normal case, but it makes our life more complicated),
it forces us to make additional requests to resolve data dependencies of the fields and just makes overall logic more complex
for no valuable trade-off.
That's why we expect to get a whole render-ready bundle of items.

Since we have each field connected to a store separately, it's not a big deal to modify this behaviour later.

## Service fields conventions

All service fields keys must be prefixed with underscore.

### __urls__

__urls__ must have the shape of an object:

    { create, read, update, delete, describe, describe_object }

## Retries

At the moment it doesn't retry failed files. Retry options are applied only to GET-stuff.
