## SFGMC Archive

This contains the source code for the front and backend application for the San Francisco Gay Men's Chorus Archive project.

## Installation

- Install Yarn
- Install Docker and Docker Compose
- Install dependencies
  - `cd client && yarn && cd ../`
  - `cd server && yarn && cd ../`
- Copy the env file and add appropriate values:
  - `cd server && cp .env.sample .env && cd ../`
  - Edit `.env` and add:
    - CONTENTFUL_GRAPHQL_ENDPOINT
    - CONTENTFUL_MANAGEMENT_TOKEN
    - CONTENTFUL_CONTENT_TOKEN

## Development

- In a new terminal at the root of the project, start up the database:
  - `docker-compose up`
- In a separate terminal, start up the frontend:
  - `cd client && yarn start`
- In a third separate terminal, start up the backend:
  - `cd server && yarn dev`
- Open your browser to [localhost:3000](http://localhost:3000)
