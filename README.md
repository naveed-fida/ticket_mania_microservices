# TicketMania App
A Node.js project created to practice ideas in microservices. It's a web app through which users can sell and buy tickets to events. It has the following services:

1. **The authentication service**
2. **The tickets service:** Handles ticket creation/editing.
3. **The orders service:** Handles order creation and editing.
4. **Expiration**: Cancels orders after 15 minutes so if a user doesn't checkout, the order is opened up to other users.
5. **payments**: Handles credit card payments.

## Why These Five Services?
These amount of services here are an obvious overkill as no single one has a lot of complexity. The five services
 have been chosen for no reason other than to have as many services as possible to explore issues in microservices.

## Infrastructure
Docker and kubernetes are used to manage instances of these services and handle networking between them.

## The Client
These services come together inside a Next.js web client.

## Repository Structure
The main repository holds infrastructure related config files while the services and some shared code are held in
 seperate repositories that are marked as the submodules of this repository.
 
**This project is incomplete and is ongoing".