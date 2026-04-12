JRIDES – Peer-to-Peer Vehicle Rental Platform | React.js · Node.js · Express · MongoDB · JWT

Built a full-stack P2P vehicle rental web app with role-based dashboards for renters, owners, and admins; features include JWT auth, file upload (DL/RC), booking management, and real-time availability toggling.



Skills to List (from this project)
Frontend: React.js, React Router v6, Context API, Axios, CSS3, Responsive Design
Backend: Node.js, Express.js, REST API Design, JWT Authentication, Bcrypt.js, Multer
Database: MongoDB, Mongoose ODM, Data Modeling, Population Queries
Concepts: Role-Based Access Control, File Upload Handling, Protected Routes, CRUD Operations, MVC Architecture
Tools: Git, Postman, VS Code, npm

Architecture Decision: "I used Context API instead of Redux because the app's state was primarily auth-related (user token + role), which didn't require complex state trees."
Security: "I implemented JWT tokens with 30-day expiry stored in localStorage, role-based middleware on every protected route, and Bcrypt with salt factor 12 for password hashing."
File Handling: "Multer handles multipart form uploads — images go to the /uploads directory, with file type validation (JPEG/PNG/PDF only) and a 5MB size limit."
Database Design: "Bookings reference both the Vehicle and two Users (renter + owner) via ObjectId refs, allowing efficient population without data duplication."
Booking Flow: "A booking starts as 'pending', the owner can approve/reject it. On approval, the vehicle's isAvailable flag flips to false. On rejection or cancellation, it flips back to true."
