# MongoDB Atlas Database Setup

To complete the MeetNDPlay deployment, you must connect it to a real MongoDB Atlas database. Please follow these steps carefully.

## Step 1: Create a MongoDB Atlas Account
If you don't have one, go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.

## Step 2: Create a Project
Inside MongoDB Atlas, click **New Project** and name it `MeetNDPlay`.

## Step 3: Create a Cluster
1. Click **Build a Database**.
2. Select the **M0 Free** cluster tier (or a dedicated tier if you are going to production).
3. Select a cloud provider and region closest to your users.
4. Click **Create Cluster**.

## Step 4: Create a Database User
1. Under Security in the left sidebar, click **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** as the authentication method.
4. Enter a username (e.g., `meetndplay_admin`) and a strong, secure password. 
5. Under Database User Privileges, select **Read and write to any database**.
6. Click **Add User**.
   > [!IMPORTANT]
   > Save this password somewhere safe. You will need it for your connection string.

## Step 5: Configure Network Access
1. Under Security in the left sidebar, click **Network Access**.
2. Click **Add IP Address**.
3. For development purposes, click **Add Current IP Address** or **Allow Access from Anywhere** (`0.0.0.0/0`).
   > [!WARNING]
   > If deploying to production, restrict this to only the IP addresses of your production servers (e.g., Vercel or Heroku IPs).
4. Click **Confirm**.

## Step 6: Get Your Connection String
1. Go back to **Database** under Deployment in the left sidebar.
2. Click **Connect** on your cluster.
3. Choose **Drivers** (Node.js).
4. Copy the connection string provided. It should look like this:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

## Step 7: Configure Environment Variables
1. Open the file `backend/.env` in your project.
2. Paste the connection string, replacing `<username>` and `<password>` with the credentials from Step 4. Also, specify the database name `meetndplay` before the query parameters.
   ```env
   MONGODB_URI=mongodb+srv://meetndplay_admin:YOUR_PASSWORD@cluster0.mongodb.net/meetndplay?retryWrites=true&w=majority
   ```
3. Save the file.

## Step 8: Verify the Connection
Run the backend server (`npm start` or `npm run dev` in the backend directory). The console should output:
`[MongoDB] Connected to database: meetndplay`

## Step 9: Seed the Database
To quickly populate the database with sports and demo users for testing, run:
```bash
npm run seed
```

## Step 10: Start Playing!
Open the frontend application. You are now running on a robust, production-ready database!
