# DermaCure AI: Project Review and Viva Documentation

## 1. Project Title

**DermaCure AI: AI-Based Skin Disease Detection and Doctor Consultation Platform**

DermaCure AI is a web-based healthcare support system designed for early screening of common skin diseases using artificial intelligence. The project combines image-based deep learning, symptom-based machine learning, secure user authentication, doctor-assisted review, consultation management, analytics, and medical report generation.

The system is not intended to replace a dermatologist. It is designed as an assistive screening and decision-support platform where AI provides preliminary predictions and doctors can review, validate, and finalize the diagnosis.

## 2. Problem Statement

Skin diseases are common, but many patients delay consulting a dermatologist due to lack of awareness, time constraints, cost, or limited access to medical specialists. Early symptoms such as redness, itching, scaling, blisters, acne, or pigmentation changes are often ignored until the condition becomes severe.

Traditional diagnosis requires physical consultation, which may not always be immediately available. Patients also find it difficult to understand whether their symptoms require urgent medical attention. At the same time, doctors may benefit from an organized digital workflow that captures patient images, symptoms, preliminary AI insights, and previous case history.

The problem addressed by this project is:

> To design and implement an intelligent, secure, and user-friendly web platform that can assist in early skin disease screening using image and symptom analysis, while allowing qualified doctors to review and finalize patient consultation cases.

## 3. Existing System Analysis

The existing approach for skin disease diagnosis mainly depends on manual consultation with a dermatologist. The usual process includes:

1. Patient observes skin symptoms.
2. Patient visits a clinic or hospital.
3. Doctor examines the affected area visually.
4. Doctor may ask for medical history or additional tests.
5. Doctor provides diagnosis and treatment.

Some online healthcare platforms allow patients to consult doctors remotely, but many of them do not include AI-assisted pre-screening or multi-model comparison. Basic symptom checker websites exist, but they are often rule-based, generic, and not connected with doctor-reviewed consultation workflows.

Existing AI-based skin disease applications may provide image classification, but they often lack:

- User authentication and patient history.
- Doctor review and approval workflow.
- Symptom-based analysis combined with image-based analysis.
- Role-based access control.
- Consultation request management.
- Analytics for medical staff.
- Report generation with clear medical disclaimers.

## 4. Limitations of Existing System

The limitations of the traditional and partially digital existing systems are:

1. **Delayed diagnosis:** Patients may postpone consultation due to appointment availability or lack of awareness.
2. **Manual dependency:** Diagnosis depends completely on physical examination and manual record keeping.
3. **Limited remote support:** Many systems do not provide structured remote consultation with image and symptom submission.
4. **No preliminary AI assistance:** Doctors do not always receive automated preliminary screening results.
5. **Poor patient history tracking:** Previous skin condition records may not be stored digitally in an organized way.
6. **Lack of role-based workflow:** Patients, doctors, and management users often do not have clearly separated dashboards.
7. **No model comparison:** Most systems use a single model or generic symptom rules without comparing outputs.
8. **Scalability limitations:** Manual consultation queues can become difficult to manage as patient count increases.
9. **Limited analytics:** Existing systems often do not provide disease distribution, weekly cases, or model performance analytics.
10. **Lack of report generation:** Patients may not receive a structured downloadable preliminary screening report.

## 5. Proposed Solution

DermaCure AI proposes a full-stack AI-assisted dermatology screening platform. It allows users to register, upload skin images, select symptoms, receive preliminary AI predictions, request doctor consultation, and view finalized reports. Doctors or medical staff can review patient cases, run AI analysis using multiple models, compare predictions, write notes, add recommendations, mark cases urgent, and publish reports to patients.

The system contains three major layers:

1. **Frontend Layer:** React and TypeScript web application for patient, doctor, and management dashboards.
2. **Application Backend Layer:** Node.js, Express, TypeScript, and MongoDB backend for authentication, authorization, consultation workflow, users, and analytics.
3. **AI Prediction Layer:** Python Flask service using TensorFlow/Keras image models and scikit-learn text models for disease prediction.

The proposed system improves the existing process by providing:

- AI-based image prediction.
- Symptom-based text analysis.
- Multi-model comparison.
- Doctor review and finalization.
- Patient history.
- Secure login, OTP verification, and password reset.
- Analytics dashboard.
- Medical report generation.
- Role-based access control.

## 6. Objectives of the Project

The main objectives of DermaCure AI are:

1. To develop a web-based platform for AI-assisted skin disease screening.
2. To classify skin conditions from uploaded images using trained deep learning models.
3. To analyze selected symptoms using a text-based machine learning model.
4. To provide a doctor consultation request workflow.
5. To allow doctors to review, validate, and finalize AI-assisted diagnosis results.
6. To maintain patient diagnosis history securely.
7. To implement role-based authentication and authorization.
8. To generate structured preliminary medical reports.
9. To provide analytics about cases, disease distribution, model performance, and patient activity.
10. To design a scalable architecture separating frontend, backend, database, and AI inference services.

## 7. Scope of the Project

### In Scope

- User registration and login.
- Email OTP verification and password reset.
- Patient profile management.
- Skin image upload and preview.
- Image-based AI disease prediction.
- Symptom-based AI analysis.
- Doctor consultation request submission.
- Pending case queue for doctors.
- Doctor review, notes, recommendations, urgency flag, and finalization.
- Patient diagnosis history.
- Completed case history.
- Healthcare analytics dashboard.
- Medical report generation.
- Role-based route protection.
- MongoDB database storage.

### Out of Scope

- Real-time video consultation.
- Online medicine ordering.
- Integration with hospital management systems.
- Payment gateway integration.
- Government medical record integration.
- Final legal medical diagnosis without doctor review.
- Emergency medical response automation.

## 8. System Architecture

DermaCure AI uses a modular client-server architecture with a separate AI inference service.

### High-Level Architecture

```text
User Browser
    |
    | React + TypeScript frontend
    v
Vite Web Application
    |
    | REST API calls
    v
Node.js + Express + TypeScript Backend
    |
    | Mongoose ODM
    v
MongoDB Database

React Frontend
    |
    | Prediction API calls
    v
Python Flask AI Service
    |
    | TensorFlow / Keras / scikit-learn
    v
Pre-trained Image and Text ML Models
```

### Detailed Component Architecture

```text
Frontend Modules
    - Authentication pages
    - Patient dashboard
    - Image analysis page
    - Symptom analysis page
    - Consultation request page
    - Doctor pending cases
    - Doctor review case
    - Completed cases
    - Analytics and reports

Backend API Modules
    - Authentication controller
    - User controller
    - Diagnosis controller
    - JWT middleware
    - Role authorization middleware
    - Input validation middleware
    - Email and OTP utilities

AI Service Modules
    - Image preprocessing
    - Image model loading
    - Image prediction endpoint
    - Symptom vectorization
    - Text prediction endpoint
    - Health check endpoint

Database Collections
    - users
    - otps
    - diagnoses
```

### Deployment Architecture

```text
Frontend Server: http://localhost:5173
Node Backend:    http://localhost:5000/api/v1
Flask AI Server: http://localhost:5001
MongoDB:         Local or cloud MongoDB connection
```

## 9. Technology Stack Used

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type safety and maintainable frontend code |
| Vite | Fast development server and build tool |
| React Router DOM | Client-side routing |
| Tailwind CSS | Responsive UI styling |
| Lucide React | Icon library |
| Context API | Authentication, theme, and toast state management |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend development |
| MongoDB | NoSQL database |
| Mongoose | Object Data Modeling for MongoDB |
| JWT | Token-based authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| nodemailer | Email and OTP communication |
| helmet | Security headers |
| cors | Cross-origin request handling |
| express-rate-limit | API rate limiting |
| express-mongo-sanitize | NoSQL injection protection |
| compression | Response compression |

### AI and Machine Learning

| Technology | Purpose |
|---|---|
| Python | AI service implementation |
| Flask | Prediction API service |
| Flask-CORS | Frontend access to AI APIs |
| TensorFlow / Keras | Deep learning model loading and prediction |
| OpenCV | Image decoding and preprocessing |
| NumPy | Numerical processing |
| scikit-learn | Text model and TF-IDF vectorizer |
| Pickle | Loading trained text model artifacts |

### Models Used

Image models:

- DenseNet
- Inception
- MobileNet
- Xception

Text models and artifacts:

- Linear SVM model
- TF-IDF vectorizer
- Label encoder
- Logistic Regression model artifact available in model folder
- DistilBERT model archive available in model folder

### Disease Classes

The image model class labels include:

- Acne
- Candidiasis
- Eczema
- Psoriasis
- Rosacea
- Seborrheic Keratoses
- Tinea
- Unknown or Normal
- Vitiligo
- Warts

## 10. Database Design

The system uses MongoDB with Mongoose schemas. The main collections are `users`, `otps`, and `diagnoses`.

### User Collection

The User schema stores authentication, role, profile, and medical profile details.

| Field | Type | Description |
|---|---|---|
| email | String | Unique user email |
| firstName | String | User first name |
| lastName | String | User last name |
| mobile | String | Mobile number |
| role | String | doctor, patient, manager, or user |
| password | String | Hashed password |
| isEmailVerified | Boolean | Email verification status |
| isMobileVerified | Boolean | Mobile verification status |
| isActive | Boolean | Account active status |
| lastLogin | Date | Last login timestamp |
| age | Number | Patient age |
| skinType | String | Skin type such as Normal, Dry, Oily, Combination, Sensitive |
| allergies | Array | Allergy details |
| medicalHistory | String | Patient medical history |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Record update timestamp |

Important database features:

- Unique email constraint.
- Password hashing before save.
- Role index.
- Active status index.
- Password removed from JSON response.

### OTP Collection

The OTP schema stores verification and password reset codes.

| Field | Type | Description |
|---|---|---|
| email | String | User email |
| mobile | String | Optional mobile number |
| otp | String | Six-digit OTP |
| type | String | email_verification, password_reset, mobile_verification, or login |
| expiresAt | Date | OTP expiry time |
| isUsed | Boolean | OTP usage status |
| attempts | Number | Number of verification attempts |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Update timestamp |

Important database features:

- TTL index on `expiresAt`.
- Maximum attempt tracking.
- Separate OTP types.
- Old OTP removal before new OTP creation.

### Diagnosis Collection

The Diagnosis schema stores patient consultation requests and doctor-reviewed reports.

| Field | Type | Description |
|---|---|---|
| user | ObjectId | Patient reference |
| imageUrl | String | Uploaded image or base64 image data |
| symptoms | Array | Patient selected symptoms |
| description | String | Additional patient description |
| prediction.disease | String | AI-predicted disease |
| prediction.confidence | Number | AI confidence score |
| prediction.modelUsed | String | Model used for prediction |
| recommendations | Array | Doctor recommendations |
| doctorNotes | String | Doctor observations |
| doctor | ObjectId | Doctor or medical staff reference |
| status | String | pending, reviewed, or finalized |
| isVisibleToPatient | Boolean | Controls patient report visibility |
| isUrgent | Boolean | Marks urgent cases |
| createdAt | Date | Submission timestamp |
| updatedAt | Date | Last update timestamp |

### Database Relationships

```text
User 1 -------- many Diagnosis
User 1 -------- many OTP
Doctor/User 1 -------- many finalized Diagnosis records
```

## 11. Module-wise Explanation

### 11.1 Authentication Module

This module manages user registration, login, OTP verification, password reset, profile update, password change, token refresh, and logout.

Main backend files:

- `backend/src/controllers/authController.ts`
- `backend/src/routes/auth.ts`
- `backend/src/models/User.ts`
- `backend/src/models/OTP.ts`
- `backend/src/utils/jwt.ts`
- `backend/src/utils/otp.ts`
- `backend/src/utils/email.ts`

Main frontend pages:

- Login
- Register
- Verify OTP
- Forgot Password
- Reset Password
- Registration Success
- Role Selection

Key features:

- Password hashing using bcrypt.
- JWT access and refresh tokens.
- OTP-based email verification.
- OTP-based password reset.
- Profile update.
- Password change after verifying current password.

### 11.2 User and Role Management Module

This module controls access based on roles.

Supported roles:

- `patient` or `user`: submits consultation requests and views own reports.
- `doctor`: reviews patient cases and finalizes reports.
- `manager`: has doctor-like access and analytics access.

Backend middleware:

- `authenticate`: verifies JWT token.
- `authorize`: checks allowed roles.
- `managerOnly`: allows manager and doctor roles.
- `allUsers`: allows all authenticated users.

Frontend route protection is implemented using:

- `ProtectedRoute`
- `PublicRoute`
- Role-based route restrictions in `src/App.tsx`

### 11.3 Image-Based AI Prediction Module

This module accepts a skin image and predicts the possible skin condition.

Main files:

- `backend/app.py`
- `backend/predictor.py`
- `models/Image_model/*.h5`
- `src/services/api.ts`
- `src/pages/user/UploadImage/UploadImage.tsx`

Process:

1. User uploads an image.
2. Frontend sends the image as file data or image URL/base64 to Flask.
3. Flask decodes the image using OpenCV.
4. Image is resized according to selected model input size.
5. Image is normalized.
6. TensorFlow/Keras model performs prediction.
7. Disease label and confidence score are returned.

Supported image models:

- DenseNet
- Inception
- MobileNet
- Xception

### 11.4 Symptom-Based AI Analysis Module

This module predicts a possible condition from selected symptoms.

Main files:

- `backend/app.py`
- `models/text_model/linear_svm_model.pkl`
- `models/text_model/tfidf_vectorizer.pkl`
- `models/text_model/label_encoder.pkl`
- `src/pages/user/SymptomAnalysis/SymptomAnalysis.tsx`

Process:

1. User selects symptoms.
2. Frontend sends symptoms to `/analyze_symptoms`.
3. Flask joins symptoms into input text.
4. TF-IDF vectorizer converts text into numerical features.
5. Text model predicts the disease class.
6. System returns disease, confidence, severity, advice, and comparison data.

### 11.5 Consultation Request Module

This module allows patients to send cases to doctors.

Main files:

- `src/pages/user/RequestConsultation/RequestConsultation.tsx`
- `backend/src/controllers/diagnosisController.ts`
- `backend/src/routes/diagnosis.ts`
- `backend/src/models/Diagnosis.ts`

Process:

1. Patient selects symptoms.
2. Patient uploads image.
3. Patient may run preliminary AI analysis.
4. Patient adds optional description.
5. System converts image to base64 for demo persistence.
6. Consultation request is stored in MongoDB with status `pending`.
7. Doctors are notified by email.

### 11.6 Doctor Review Module

Doctors and managers can view pending requests and finalize them.

Main files:

- `src/pages/doctor/PendingList/PendingList.tsx`
- `src/pages/doctor/ReviewCase/ReviewCase.tsx`
- `src/pages/doctor/CompletedCases/CompletedCases.tsx`
- `backend/src/controllers/diagnosisController.ts`

Doctor actions:

- View patient information.
- View uploaded image.
- View reported symptoms.
- Run AI prediction.
- Compare all image models.
- Select preferred result.
- Add scientific commentary.
- Add treatment recommendations.
- Mark case as urgent.
- Control visibility to patient.
- Finalize case.

### 11.7 Analytics Module

This module provides management and doctor-level insights.

Main files:

- `src/pages/management/Analytics/Analytics.tsx`
- `backend/src/controllers/diagnosisController.ts`

Analytics includes:

- Total cases.
- Pending cases.
- Completed cases.
- Unique patients.
- Average confidence.
- Disease distribution.
- Model performance.
- Weekly case volume.

### 11.8 Report Generation Module

This module generates an HTML-based printable medical report.

Main file:

- `src/utils/reportGenerator.ts`

Report includes:

- Report ID.
- Date and time.
- Patient name.
- Analysis type.
- Disease prediction.
- Confidence score.
- Disease category.
- Urgency level.
- Symptoms.
- AI advice.
- Recommended actions.
- Medical disclaimer.
- Print or save as PDF option.

### 11.9 UI and Layout Module

Main components:

- `MainLayout`
- `Navigation`
- `MobileHeader`
- `PageLayout`
- Reusable UI components such as Button, Card, Input, Select, Checkbox, Toast, and Skeleton.

The UI supports:

- Responsive design.
- Role-based navigation.
- Toast notifications.
- Theme support.
- Reusable components.

## 12. Workflow and Process Flow

### Patient Workflow

```text
Open Application
    |
Register / Login
    |
Verify Email with OTP
    |
Access Dashboard
    |
Choose Image Analysis or Symptom Analysis
    |
Get Preliminary AI Result
    |
Request Doctor Consultation
    |
Upload Image + Symptoms + Description
    |
Case Stored as Pending
    |
Doctor Reviews Case
    |
Patient Views Finalized Report
```

### Doctor Workflow

```text
Doctor Login
    |
Open Pending Cases
    |
Select Patient Case
    |
View Symptoms and Image
    |
Run AI Prediction or Compare Models
    |
Add Notes and Recommendations
    |
Mark Urgency if Required
    |
Set Visibility to Patient
    |
Finalize Case
    |
Case Moves to Completed Cases
```

### AI Image Prediction Flow

```text
Image Input
    |
Image Validation
    |
Send to Flask /predict Endpoint
    |
Decode Image with OpenCV
    |
Resize According to Model
    |
Normalize Pixel Values
    |
Run TensorFlow/Keras Model
    |
Map Output Index to Disease Label
    |
Return Disease and Confidence
```

### Symptom Analysis Flow

```text
Selected Symptoms
    |
Send to Flask /analyze_symptoms Endpoint
    |
Join Symptoms into Text
    |
TF-IDF Vectorization
    |
Text Model Prediction
    |
Label Decoding
    |
Severity and Advice Mapping
    |
Return Diagnosis Result
```

### Backend API Flow

```text
Frontend Request
    |
CORS and Security Middleware
    |
Rate Limiting
    |
JSON Body Parser
    |
JWT Authentication
    |
Role Authorization
    |
Controller Logic
    |
MongoDB Operation
    |
JSON Response
```

## 13. Key Features

1. **AI image diagnosis:** Detects possible skin diseases from uploaded images.
2. **Symptom analysis:** Predicts possible disease using selected symptoms.
3. **Multi-model comparison:** Compares DenseNet, Inception, MobileNet, and Xception results.
4. **Doctor consultation workflow:** Patients can submit cases for doctor review.
5. **Doctor finalization:** Doctors can validate AI output and publish reports.
6. **Role-based access control:** Different dashboards and permissions for patients, doctors, and managers.
7. **Secure authentication:** JWT authentication, hashed passwords, and OTP verification.
8. **Patient history:** Patients can view their previous diagnosis records.
9. **Analytics dashboard:** Medical staff can monitor total cases, model performance, and disease distribution.
10. **Report generation:** Users can download or print structured screening reports.
11. **Email notifications:** OTPs and consultation/report alerts are sent through email utilities.
12. **Medical disclaimer:** Reports clearly state that AI output is preliminary and must be reviewed by a doctor.
13. **Responsive UI:** Works across desktop and mobile screen sizes.
14. **Security middleware:** Helmet, rate limiting, CORS, and MongoDB sanitization.

## 14. User Roles and Permissions

| Role | Permissions |
|---|---|
| Patient / User | Register, login, update profile, upload image, analyze symptoms, request consultation, view own history, view visible finalized reports, generate report |
| Doctor | Login, view pending cases, view patient details for cases, run AI prediction, compare models, add notes, add recommendations, mark urgent, finalize cases, view completed cases, view analytics |
| Manager | Has doctor-like access plus management analytics and user-related administrative views |

### Route-Level Access

| Route / Feature | Patient | Doctor | Manager |
|---|---:|---:|---:|
| User dashboard | Yes | Yes | Yes |
| Request consultation | Yes | No | No |
| Diagnosis history | Yes | No | No |
| Pending cases | No | Yes | Yes |
| Review case | No | Yes | Yes |
| Completed cases | No | Yes | Yes |
| Analytics | No | Yes | Yes |
| Reports | Yes | Yes | Yes |
| Settings | Yes | Yes | Yes |

## 15. Implementation Details

### Frontend Implementation

The frontend is implemented in React with TypeScript. Routing is handled using React Router DOM. The application uses separate pages for authentication, patient features, doctor features, and management analytics.

Important frontend implementation points:

- `AuthContext` manages logged-in user state.
- `ToastContext` displays success and error notifications.
- `ThemeContext` manages theme settings.
- `apiService` centralizes API calls.
- Protected routes restrict pages based on role.
- Reusable UI components improve consistency.
- Image upload uses browser file input and preview URL.
- Reports are generated as printable HTML through Blob URLs.

### Backend Implementation

The backend is implemented with Node.js, Express, and TypeScript.

Important backend implementation points:

- REST APIs are grouped under `/api/v1`.
- Authentication routes handle register, login, OTP, profile, password reset, and token refresh.
- Diagnosis routes handle consultation requests, pending cases, completed cases, analytics, and finalization.
- Mongoose schemas define User, OTP, and Diagnosis collections.
- JWT middleware protects private routes.
- Role middleware controls doctor and manager features.
- Security middleware includes Helmet, CORS, rate limiting, and MongoDB sanitization.

### AI Service Implementation

The AI service is implemented using Flask.

Important AI implementation points:

- `/predict` endpoint accepts image input.
- `/predict?model=all` compares all loaded image models.
- `/analyze_symptoms` endpoint accepts symptoms.
- `/health` endpoint reports loaded models and mock mode.
- Image models are loaded from `.h5` files.
- Text model, vectorizer, and label encoder are loaded from pickle files.
- The service supports base64 images, uploaded image files, and image URLs.
- Custom layer wrappers are used to handle common Keras model loading compatibility issues.

### Security Implementation

Security controls include:

- Password hashing using bcrypt.
- JWT access and refresh tokens.
- OTP expiry and attempt limit.
- CORS origin validation.
- Helmet security headers.
- Rate limiting for API abuse prevention.
- NoSQL injection sanitization.
- Protected API routes.
- Role-based authorization.
- Sensitive password field excluded from JSON output.

## 16. Challenges Faced and Solutions

| Challenge | Solution |
|---|---|
| Loading different Keras `.h5` models with compatibility issues | Added custom layer wrappers and fallback loading logic in Flask |
| Handling multiple model input sizes | Maintained model configuration for target sizes such as 224x224 and 299x299 |
| Supporting image upload and stored image analysis | Implemented support for file uploads, base64 image data, and URL-based images |
| Separating AI prediction from main backend | Created a separate Flask service so AI dependencies do not overload the Node.js API |
| Protecting routes by role | Implemented JWT authentication and role-based middleware in backend and frontend |
| Keeping patient reports private until doctor review | Added `isVisibleToPatient` flag in Diagnosis schema |
| Managing OTP expiry | Used `expiresAt` and MongoDB TTL index |
| Avoiding plain-text passwords | Used bcrypt hashing in User pre-save middleware |
| Displaying analytics from real data | Used MongoDB aggregation pipelines for disease distribution, weekly volume, and model performance |
| Generating reports without server-side PDF dependency | Implemented HTML report generation with browser print/save-as-PDF support |

## 17. Testing Methodology

Testing was performed at multiple levels.

### Unit Testing

The backend includes Jest setup for test support. Unit-level verification focuses on:

- Utility functions.
- JWT generation and verification.
- OTP generation and validation.
- Validation middleware.
- Model schema behavior.

### API Testing

Backend APIs can be tested using Postman, browser fetch, or frontend integration.

Important API test cases:

| Test Case | Expected Result |
|---|---|
| Register with valid data | User created and OTP generated |
| Register with duplicate email | Error response |
| Login with valid credentials | Access token and refresh token returned |
| Login with invalid credentials | Unauthorized response |
| Verify valid OTP | Email verified |
| Verify expired or wrong OTP | Error response |
| Submit consultation request | Diagnosis record created with pending status |
| Get pending cases as doctor | Pending diagnosis list returned |
| Get pending cases as patient | Access denied |
| Finalize diagnosis as doctor | Case finalized and visible as configured |
| Get analytics as doctor | Analytics data returned |

### AI Model Testing

AI service testing includes:

- Checking `/health` endpoint.
- Uploading valid images.
- Testing invalid image input.
- Testing each model individually.
- Testing `model=all` comparison.
- Testing symptom list input.
- Testing empty symptom input.
- Checking low confidence warnings.

### Frontend Testing

Frontend testing includes:

- Page navigation.
- Role-based route access.
- Login and logout flow.
- Image upload validation.
- Symptom selection.
- AI result display.
- Consultation submission.
- Doctor review workflow.
- Report generation.
- Responsive UI checks.

### Integration Testing

Integration testing verifies end-to-end behavior:

```text
Register Patient -> Login -> Upload Image -> Request Consultation
-> Doctor Login -> Review Case -> Run AI -> Finalize
-> Patient Views Report
```

### Security Testing

Security testing includes:

- Accessing protected routes without token.
- Accessing doctor APIs with patient token.
- Testing invalid JWT token.
- Testing expired OTP.
- Testing invalid input data.
- Testing rate limit behavior.

## 18. Results and Outputs

The implemented system successfully provides:

1. Secure registration and login.
2. OTP-based account verification and password reset.
3. Patient dashboard with analysis and consultation options.
4. Image-based AI prediction with confidence score.
5. Symptom-based diagnosis with severity and advice.
6. Multi-model comparison for doctor review.
7. Doctor pending case queue.
8. Doctor review and finalization workflow.
9. Patient diagnosis history.
10. Analytics dashboard with real database statistics.
11. Report generation with printable output.
12. Role-based access control.

### Sample Image Prediction Output

```json
{
  "disease": "Eczema",
  "confidence": 86.42,
  "mock_mode": false
}
```

### Sample Symptom Analysis Output

```json
{
  "diagnosis": "Psoriasis",
  "confidence": 84.5,
  "severity": "Moderate",
  "advice": "Use thick moisturizers and consult a specialist for topical steroids or light therapy."
}
```

### Sample Diagnosis Record Output

```json
{
  "status": "finalized",
  "prediction": {
    "disease": "Acne",
    "confidence": 91.2,
    "modelUsed": "densenet"
  },
  "isVisibleToPatient": true,
  "isUrgent": false
}
```

## 19. Future Enhancements

Possible future enhancements include:

1. Integration with certified dermatologist appointment booking.
2. Real-time video consultation.
3. Cloud storage for medical images instead of base64 storage.
4. Admin panel for model version management.
5. Dataset expansion for more skin disease classes.
6. Explainable AI visualization such as Grad-CAM heatmaps.
7. Mobile application using React Native or Flutter.
8. Multi-language support.
9. Integration with hospital electronic health records.
10. Prescription management.
11. Payment gateway for paid consultations.
12. Doctor availability scheduling.
13. Patient chat with doctor.
14. Advanced audit logging.
15. Deployment using Docker containers.
16. Model monitoring for drift and accuracy.
17. More robust PDF generation from backend.
18. Two-factor authentication for doctors.
19. HIPAA or regional healthcare compliance improvements for production deployment.
20. Real clinical validation with dermatologist-labeled datasets.

## 20. Conclusion

DermaCure AI is a complete full-stack final-year project that combines web development, backend engineering, database design, authentication, role-based access control, artificial intelligence, and healthcare workflow management.

The system addresses the need for early skin disease screening by providing both image-based and symptom-based analysis. It improves reliability by including doctor review instead of relying only on automated AI predictions. The platform also maintains patient history, supports report generation, and provides analytics for medical staff.

The project demonstrates practical implementation of modern software engineering concepts such as modular architecture, REST APIs, secure authentication, machine learning integration, responsive UI design, database modeling, and real-world workflow automation.

Overall, DermaCure AI is a technically sound and socially useful project that can be further improved into a production-ready teledermatology support platform.

## Viva Questions and Answers

### Q1. What is the main aim of DermaCure AI?

The main aim is to provide an AI-assisted skin disease screening platform where patients can upload images or symptoms, receive preliminary predictions, and request doctor review for final diagnosis and recommendations.

### Q2. Does this system replace a dermatologist?

No. The system is an assistive tool. It provides preliminary screening only. Final medical decisions should be made by qualified doctors. The system includes doctor review and medical disclaimers for this reason.

### Q3. Why did you use separate Node.js and Flask backends?

Node.js is used for application logic such as authentication, users, roles, consultation workflow, and MongoDB operations. Flask is used separately for AI inference because Python has strong machine learning support through TensorFlow, Keras, OpenCV, and scikit-learn.

### Q4. Which machine learning models are used?

For image analysis, the project supports DenseNet, Inception, MobileNet, and Xception models. For symptom analysis, it uses a TF-IDF vectorizer with a Linear SVM text classification model. Supporting model artifacts include a label encoder and other trained model files.

### Q5. What are the disease classes supported by the image model?

The supported classes include Acne, Candidiasis, Eczema, Psoriasis, Rosacea, Seborrheic Keratoses, Tinea, Unknown or Normal, Vitiligo, and Warts.

### Q6. Why did you use MongoDB?

MongoDB is suitable because the project data is document-oriented. User profiles, diagnosis records, symptoms, recommendations, prediction objects, and OTP records can be naturally represented as flexible JSON-like documents.

### Q7. How is password security handled?

Passwords are hashed using bcrypt before saving to the database. The password field is not returned in API responses. Login verifies the entered password by comparing it with the hashed password.

### Q8. How is authentication implemented?

Authentication is implemented using JWT. After login, the backend generates an access token and refresh token. Protected routes verify the access token before allowing access.

### Q9. What is role-based access control?

Role-based access control means that each user can access only the features allowed for their role. Patients can submit and view their own records. Doctors and managers can review pending cases, finalize diagnoses, and view analytics.

### Q10. How does OTP verification work?

The system generates a six-digit OTP, stores it with expiry time and type, and sends it to the user's email. During verification, the OTP must match, must not be expired, and must not be already used.

### Q11. What is the purpose of the Diagnosis collection?

The Diagnosis collection stores consultation requests, uploaded image data, symptoms, AI prediction, doctor notes, recommendations, status, visibility, urgency, patient reference, and doctor reference.

### Q12. What happens when a patient requests consultation?

The patient uploads an image, selects symptoms, and submits the request. The backend stores it as a pending diagnosis case and notifies doctors. The doctor can later review and finalize it.

### Q13. How does the image prediction process work?

The frontend sends an image to the Flask `/predict` endpoint. Flask decodes the image, resizes it according to the selected model, normalizes it, runs prediction using TensorFlow/Keras, maps the output to a disease label, and returns confidence.

### Q14. How does symptom analysis work?

Symptoms are sent to Flask as text input. The TF-IDF vectorizer converts the symptoms into numerical features, and the text model predicts a disease class. The result includes diagnosis, confidence, severity, and advice.

### Q15. What is multi-model comparison?

Multi-model comparison allows doctors to run the same image through all loaded image models and compare their predictions and confidence scores. This helps in cross-validating the AI output.

### Q16. Why is doctor review important?

AI models can make incorrect predictions, especially if the image quality is poor or symptoms are incomplete. Doctor review ensures human medical validation before the result is treated as useful guidance.

### Q17. How is patient privacy handled?

Patient records are protected by authentication. Patients can access only their own records. Reports are not visible to patients until the doctor marks them visible. Passwords are hashed and sensitive fields are not exposed.

### Q18. What security middleware is used in the backend?

The backend uses Helmet for secure headers, CORS for origin control, express-rate-limit for request limiting, express-mongo-sanitize for NoSQL injection protection, and JWT middleware for protected routes.

### Q19. What is the purpose of the analytics dashboard?

The analytics dashboard helps doctors and managers understand total cases, pending cases, completed cases, unique patients, average confidence, disease distribution, model performance, and weekly volume.

### Q20. How are reports generated?

Reports are generated on the frontend as structured HTML documents. The report includes patient details, prediction, confidence score, symptoms, advice, recommendations, and a medical disclaimer. The browser print option can be used to save it as PDF.

### Q21. What are the main advantages of your system?

The main advantages are early screening, remote consultation support, AI-assisted prediction, doctor validation, secure authentication, patient history, analytics, and report generation.

### Q22. What are the limitations of your system?

The system depends on image quality, dataset quality, model accuracy, and available disease classes. It does not provide final medical diagnosis without doctor review. Production deployment would require clinical validation and stronger compliance measures.

### Q23. How can model accuracy be improved?

Accuracy can be improved by using a larger dermatologist-labeled dataset, data augmentation, hyperparameter tuning, transfer learning, ensemble learning, and clinical validation with real-world test data.

### Q24. Why did you use TypeScript?

TypeScript provides static typing, better code maintainability, improved IDE support, and reduced runtime errors in both frontend and backend development.

### Q25. What is the role of Mongoose?

Mongoose provides schema definitions, validation, relationships, middleware, and easier interaction with MongoDB collections.

### Q26. What is the use of the `isVisibleToPatient` field?

It controls whether the patient can see the finalized report. This ensures that incomplete or unreviewed results are not shown to the patient.

### Q27. What is the use of the `isUrgent` field?

It allows doctors to mark serious cases as urgent so that such cases can be prioritized in review and follow-up.

### Q28. What testing did you perform?

Testing included authentication testing, API testing, AI endpoint testing, frontend workflow testing, role-based access testing, integration testing, and security-related testing.

### Q29. What are the future enhancements?

Future enhancements include Grad-CAM explainability, cloud image storage, mobile app, appointment booking, video consultation, prescription module, multilingual support, Docker deployment, and clinical validation.

### Q30. What did you learn from this project?

This project provided practical experience in full-stack development, AI model integration, REST API design, MongoDB database modeling, secure authentication, role-based systems, healthcare workflows, and building a complete engineering project suitable for real-world extension.

