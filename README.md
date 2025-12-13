# Human Lost & Found System

A comprehensive MERN stack web application with AI-powered face recognition to help reunite missing persons with their families.

## 🌟 Features

### Core Features
- **User Authentication** - JWT-based secure authentication with role-based access (user/admin)
- **Report Lost Person** - Upload photo and details of missing persons
- **Report Found Person** - Report found persons with automatic face matching
- **AI Face Matching** - Automatic face recognition using face-api.js (similarity ≥ 75%)
- **Admin Dashboard** - Approve/reject reports, manage users, view analytics
- **Match Results** - View and manage face matching results
- **Modern UI** - Responsive design with Tailwind CSS and premium aesthetics

### Technical Features
- Face recognition with face-api.js
- Image upload with Cloudinary integration
- MongoDB database with Mongoose ODM
- RESTful API architecture
- Protected routes and authorization
- Real-time face matching on report submission
- Comprehensive error handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone or Navigate to Project

```powershell
cd "c:\Users\User\Desktop\project I"
```

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already created with default values
# Update it if you want to use Cloudinary for image storage

# Start MongoDB (if not running as service)
# Open a new terminal and run:
mongod

# Start the backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal** window:

```powershell
# Navigate to frontend directory
cd "c:\Users\User\Desktop\project I\frontend"

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 📦 Face Recognition Model Setup

The face-api.js library requires model files to work. Follow these steps:

1. Create models directory:
```powershell
cd backend
mkdir models\face-api-models
```

2. Download models from: https://github.com/vladmandic/face-api/tree/master/model

3. Download these three model folders and place them in `backend/models/face-api-models/`:
   - `ssd_mobilenetv1`
   - `face_landmark_68`
   - `face_recognition`

**Note:** The application will create the directory automatically and show instructions if models are missing.

## 🔑 Default Admin Credentials

```
Email: admin@lostandfound.com
Password: Admin@123
```

Create the admin user by registering through the app, then update the user's role to 'admin' in MongoDB:

```javascript
// Using MongoDB Compass or mongosh
db.users.updateOne(
  { email: "admin@lostandfound.com" },
  { $set: { role: "admin" } }
)
```

Or register with role selection in the Register page (for testing purposes).

## 📁 Project Structure

```
project-I/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary config
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── LostHuman.js       # Lost person schema
│   │   ├── FoundHuman.js      # Found person schema
│   │   └── Match.js           # Match schema
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── lostController.js  # Lost person CRUD
│   │   ├── foundController.js # Found person CRUD
│   │   ├── adminController.js # Admin operations
│   │   └── matchController.js # Matching logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── lostRoutes.js
│   │   ├── foundRoutes.js
│   │   ├── adminRoutes.js
│   │   └── matchRoutes.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── upload.js          # File upload
│   ├── utils/
│   │   └── faceRecognition.js # Face matching
│   ├── uploads/               # Uploaded images
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Loader.jsx
    │   │   └── ImageUpload.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── ReportLost.jsx
    │   │   └── ReportFound.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   ├── PrivateRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

### Lost Persons
- `POST /api/lost` - Create lost person report (Protected)
- `GET /api/lost` - Get all lost persons (Public)
- `GET /api/lost/:id` - Get single lost person (Public)
- `PUT /api/lost/:id` - Update lost person (Protected)
- `DELETE /api/lost/:id` - Delete lost person (Protected)

### Found Persons
- `POST /api/found` - Create found person report (Protected)
- `GET /api/found` - Get all found persons (Public)
- `GET /api/found/:id` - Get single found person (Public)
- `PUT /api/found/:id` - Update found person (Protected)
- `DELETE /api/found/:id` - Delete found person (Protected)

### Admin
- `GET /api/admin/stats` - Dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/reports` - Get all reports (Admin)
- `PUT /api/admin/approve/lost/:id` - Approve lost report (Admin)
- `PUT /api/admin/reject/lost/:id` - Reject lost report (Admin)
- `PUT /api/admin/approve/found/:id` - Approve found report (Admin)
- `PUT /api/admin/reject/found/:id` - Reject found report (Admin)
- `DELETE /api/admin/report/:type/:id` - Delete report (Admin)
- `DELETE /api/admin/user/:id` - Delete user (Admin)

### Matches
- `POST /api/match/run` - Run manual matching (Admin)
- `GET /api/match/results` - Get match results (Protected)
- `GET /api/match/:id` - Get single match (Protected)
- `PUT /api/match/:id` - Update match status (Admin)
- `DELETE /api/match/:id` - Delete match (Admin)

## 🎯 How It Works

1. **User Registration** - Users register and login to the system
2. **Report Lost Person** - Upload photo and details of missing person
3. **Admin Approval** - Admin reviews and approves lost person reports
4. **Report Found Person** - Someone reports a found person with photo
5. **Automatic Matching** - System automatically compares face with all approved lost persons
6. **Match Creation** - If similarity ≥ 75%, a match record is created
7. **Match Review** - Admin and users can view match results
8. **Reunion** - Contact information is shared for both parties

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/human-lost-found

# JWT
JWT_SECRET=human_lost_found_jwt_secret_key_2024_change_in_production
JWT_EXPIRE=30d

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Face Recognition
FACE_MATCH_THRESHOLD=0.75

# Admin
ADMIN_EMAIL=admin@lostandfound.com
ADMIN_PASSWORD=Admin@123
```

### Cloudinary Setup (Optional)

1. Create free account at https://cloudinary.com
2. Get your credentials from dashboard
3. Update .env file with:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET

**Note:** If Cloudinary is not configured, images will be stored locally in `backend/uploads/`

## 🧪 Testing the Application

1. **Register** a new user account
2. **Login** with your credentials
3. **Report Lost Person** - Add test data with a clear face photo
4. Login as **Admin** and approve the lost report
5. **Report Found Person** - Add another report (can be the same photo for testing)
6. Wait for automatic matching (check backend console for logs)
7. View **Match Results** to see the detected match

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt.js** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Image storage
- **face-api.js** - Face recognition
- **Canvas** - Image processing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icons
- **React Toastify** - Notifications

## 📝 Future Enhancements

- Real-time notifications with Socket.io
- SMS alerts integration
- Map location picker with Leaflet
- PDF report export
- Email notifications
- Advanced search and filters
- Mobile app (React Native)
- Multi-language support

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running. Start it with `mongod` command.

### Face Recognition Model Error
```
Error: Face recognition models not loaded
```
**Solution:** Download and place the model files in `backend/models/face-api-models/`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in `.env` file or kill the process using that port.

### Image Upload Error
```
Error: No face detected in the image
```
**Solution:** Upload a clear photo with a visible face. Ensure good lighting and face is not obscured.

## 📧 Support

For issues and questions:
- Create an issue in the project repository
- Email: support@lostandfound.com

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Human Lost & Found System
Built with ❤️ using MERN Stack

---

**Note:** This is a demonstration system. For production use, implement additional security measures, error handling, and testing.
