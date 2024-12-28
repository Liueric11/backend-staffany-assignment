# Staffany Take Home Test - Backend

## Stacks

- Framework: Hapi JS
- ORM: TypeORM
- DB: PostgreSQL

## How to Install and Run

1. Ensure you have Postgres and Node installed
2. `npm i --legacy-peer-deps`
3. `./createdb.sh` while you have Postgres running

Note that you must have Postgres installed and running locally on your machine (i.e. not via Docker).
A basic setup is provided (via `createdb.sh`) but if you have a more advanced setup (e.g. via Docker) then you have to manage that config yourself.

## How to run

1. `npm run dev`

## How to test

1. `npm run test`

You are recommended to write tests as part of your assignment, even though they are not an explicit requirement.

## Requirements Checklist

- [x] User should be able to see a list of shifts
- [x] User should be able to see the name, date, start time, end time of each shift
- [x] User should be able to create & update shifts via form
- [x] User should be able to delete shifts
- [x] User should not be able to create or edit a shift such that is clashing with an existing shift
- [x] User should be able to "publish" an entire week's worth of shifts at a time
- [x] User should not be able to edit or delete a shift after it's been "published"
- [x] User should not be able to create shifts in a "week" that is "published"

## Project Structure

- Database Entities are located inside `./src/database/default/entity/`. Entities contains the database schema.
- Database Repositories are located inside `./src/database/default/repository/`. Repositories contains CRUD Operations.
- Business Logics are located inside `./src/usecases/`
- API Endpoint routing are located inside `./src/routes/`
