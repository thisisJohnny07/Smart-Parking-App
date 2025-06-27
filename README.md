# Smart-Parking-App

## Project Overview

This project is a full-stack web application combining a Django REST API backend with a modern ReactJS frontend built using Vite and styled with Tailwind CSS. It provides user authentication, reservation system, admin dashboard, delivering a fast, responsive, and visually consistent user experience.

## Tech Stack

- **Backend:** Django, Django REST Framework, JWT Authentication
- **Frontend:** ReactJS with Vite
- **Database:** SQLite
- **Integration** Paymongo (Payment Gateway)
- **Other Tools:** Node.js, npm/yarn, Git

# Prerequisites
Make sure you have the following installed:
- Python 3.13.5
- Node.js 22.11.0
- npm 11.3.0

### Backend Setup (Django)

1. Navigate to the backend directory

2. Copy Secret Key to .env file in the backend root dir
- PAYMONGO_PUBLIC_KEY=pk_test_QhcjgukPpuUXseW1ywGtHiS6
- PAYMONGO_SECRET_KEY=sk_test_gQ8pXx5YdhodbJBZVAEV8nn6

3. Install required Python packages
- pip install django djangorestframework djangorestframework-simplejwt

4. Apply database migrations
- python manage.py makemigrations
- python manage.py migrate

5. Run the development server
- python manage.py runserver

### Frontend Setup (NodeJS)

1. Navigate to the frontend directory

2. Install npm dependencies:
- npm install
- or
- yarn install

2. Start the frontend development server:
- npm run dev
- or
- yarn dev

3. The frontend is accessible at http://localhost:5173 (default Vite port).
- To access the admin sign-up page, navigate to http://localhost:5173/admin/sign-up.

# Admin Credentials

- username: admin
- password: adminuser@25

# Register or use this User Credentials

- username: John_Rey
- password: password@25

- username: Jenezel
- password: jenezel@25

- username: Maribel
- password: maribel@25

# For card payments, use PayMongo test cards:

https://developers.paymongo.com/docs/testing

# Postman API Documentation

https://documenter.getpostman.com/view/35027587/2sB2xEBU7F
