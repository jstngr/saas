# Product Requirements Document (PRD)

## 1. Overview

**Product Name**: Project Management Feature\
**Purpose**: Enable users to create and manage projects within the app, assign roles to collaborators and clients, and maintain an audit trail of all project activities.

## 2. Features

### 2.1 Project Management

- **Project Chats**:

  - The project owner can create chats within a project.
  - Users can leave a chat at any time.
  - The project owner cannot remove users from a chat.
  - A chat cannot be deleted once it contains more than one message.
  - Chats can be named and assigned to specific users within the project.
  - Users can only see chats they are invited to.
  - Every project has a default chat that includes all project members.
  - The default chat name matches the project name but can be changed by the project owner.

- **Create a Project**: Users can create a project with the following attributes:

  - Project Name (string)
  - UUID (system-generated, unique identifier)
  - Start Date (date picker)
  - Deadline (date picker)
  - Budget (numeric field)

- **Edit a Project**: Users can update project details.

- **Delete a Project**: Projects can only be deleted if no users have been invited.

  - The UI should reflect the deactivated state clearly, allowing users to see and restore deactivated projects.

- **Project Listing Page**:

  - Users will have a dedicated page listing all their projects.
  - Clicking on a project will route the user to a dedicated project space where they can manage project details, collaborate, and track progress.
  - Deactivated projects will still be visible but will be clearly marked as deactivated.
  - Users can only view the history log of deactivated projects; no modifications will be allowed.

### 2.2 User and Role Management

- **Invite Users to a Project**:

  - The app checks if the email exists in the system.
  - If the user exists, they receive an invite via email and in-app notification.
  - If the user accepts, they are added to the project; if they deny, the project owner is notified.
  - If the user does not exist:
    - The system creates a new user account.
    - Sends a welcome email with an option to accept or decline the invitation.
    - If declined, the system removes the entry.
    - If accepted, the user is redirected to a password setup page.
    - If the invitation is not accepted within 7 days, the system automatically deletes the user entry.
  - The system tracks whether an invitation has been accepted or declined.
  - Project owners can cancel pending invitations before they are accepted.

- **Roles and Permissions**:

  - **Collaborator**: Read & write access.
  - **Collaborator (Restricted Write)**: Limited write access (restrictions defined later).
  - **Client (Read Only)**: Can only view project details.
  - **Client (Read & Write)**: Can view and modify specific aspects.

### 2.3 Notifications

- **Real-Time Chat Notifications**:

  - If a user receives a message in any project chat, they should be notified in real time.
  - The backend and frontend should maintain a connection to enable real-time message delivery.
  - Notifications should include:
    - Project name
    - Sender name
    - A truncated message preview (max 100 characters)
  - Clicking the notification should route the user to the corresponding project chat page.

- **Notification Center**:

  - Notifications will be categorized (e.g., chat messages, project updates, invitations).
  - The app will include a notification center where users can see all notifications.
  - Notifications should be markable as read.
  - Unread notifications should have an indicator displaying the count of unread messages.
  - A 'Mark All as Read' functionality should be available.
  - Read notifications should not be shown the next time the notification center is opened.

- **Email & In-App Notifications**:

  - Project owner gets notified when:
    - A user accepts or denies an invitation.
    - A user is added or removed from the project.
  - Invited users receive:
    - An invitation email and in-app notification.
    - A welcome email if they are new to the system.

### 2.4 History Log

- **Track All Project Activities**:
  - Record user actions such as:
    - Project creation, editing, and deletion.
    - User invitations, acceptances, rejections, and cancellations.
    - Changes in roles and permissions.
  - Display a timestamped activity log within the project dashboard.

## 3. API Endpoints

### 3.1 Project Management

- `POST /projects` – Create a new project.
- `GET /projects` – Get all projects for a user.
- `GET /projects/{project_id}` – Get details of a specific project.
- `PUT /projects/{project_id}` – Update a project.
- `DELETE /projects/{project_id}` – Delete a project if no users have been invited.

### 3.2 User and Role Management

- `POST /projects/{project_id}/invite` – Invite a user to a project.
- `POST /projects/{project_id}/invite/cancel` – Cancel a pending invitation.
- `POST /projects/{project_id}/join` – Accept an invitation.
- `POST /projects/{project_id}/decline` – Decline an invitation.
- `GET /projects/{project_id}/members` – Get all members of a project.
- `PUT /projects/{project_id}/members/{user_id}` – Update user role.
- `DELETE /projects/{project_id}/members/{user_id}` – Remove a user from a project.

### 3.3 Chat Management

- `POST /projects/{project_id}/chats` – Create a new chat.
- `GET /projects/{project_id}/chats` – Get all chats in a project.
- `GET /projects/{project_id}/chats/{chat_id}` – Get details of a chat.
- `POST /projects/{project_id}/chats/{chat_id}/messages` – Send a message.
- `GET /projects/{project_id}/chats/{chat_id}/messages` – Retrieve chat messages.

### 3.4 Notifications

- `GET /notifications` – Get all notifications for a user.
- `PUT /notifications/{notification_id}/read` – Mark a notification as read.
- `PUT /notifications/mark-all-read` – Mark all notifications as read.

### 3.5 History Log

- `GET /projects/{project_id}/history` – Retrieve project history log.

## 4. Database Schema

### 4.1 Tables

#### `users`

- `id` (UUID, Primary Key)
- `name` (String, Not Null)
- `email` (String, Unique, Not Null)
- `password_hash` (String, Not Null)
- `created_at` (Timestamp, Default: Now)
- `updated_at` (Timestamp, Default: Now)

#### `projects`

- `id` (UUID, Primary Key)
- `name` (String, Not Null)
- `owner_id` (UUID, Foreign Key -> users.id, Not Null)
- `start_date` (Date, Not Null)
- `deadline` (Date, Not Null)
- `budget` (Decimal, Not Null)
- `status` (Enum: Active, Deactivated, Not Null)
- `created_at` (Timestamp, Default: Now)
- `updated_at` (Timestamp, Default: Now)

#### `project_members`

- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key -> projects.id, Not Null)
- `user_id` (UUID, Foreign Key -> users.id, Nullable if invited but not accepted)
- `email` (String, Not Null)
- `role` (Enum: Collaborator, Restricted Collaborator, Client Read, Client Read/Write, Not Null)
- `status` (Enum: Pending, Accepted, Declined, Not Null)
- `joined_at` (Timestamp, Nullable)
- `created_at` (Timestamp, Default: Now)
- `updated_at` (Timestamp, Default: Now)
