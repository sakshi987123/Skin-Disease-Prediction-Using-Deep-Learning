# DermaCure AI – Intelligent Skin Disease Detection & Doctor Consultation Platform

## Overview

DermaCure AI is an AI-powered healthcare platform designed to assist in the early detection of skin diseases through image-based and symptom-based analysis. The system leverages Deep Learning and Computer Vision techniques to analyze skin images and generate preliminary predictions.

The platform provides two user roles: **Patient** and **Doctor**. Patients can upload skin images, receive AI-generated prediction reports, and share those reports with doctors. Doctors can review the reports, analyze the condition, and provide professional feedback and recommendations directly through the platform.

This project demonstrates the integration of Artificial Intelligence, Machine Learning, Deep Learning, Medical Image Processing, and Full-Stack Web Development in the healthcare domain.

---

## Key Features

### AI-Powered Disease Detection

* Skin disease prediction using Deep Learning models
* Image-based disease analysis
* Symptom-based disease assessment
* Real-time prediction results

### Patient Portal

* Secure registration and login
* Upload skin images for analysis
* View AI-generated prediction reports
* Send reports to doctors for review
* Receive doctor feedback and recommendations

### Doctor Portal

* Secure doctor authentication
* Access patient-submitted reports
* Review AI-generated predictions
* Analyze patient conditions
* Send medical observations and recommendations back to patients

### Additional Features

* JWT-based authentication
* OTP verification system
* MongoDB database integration
* Responsive and user-friendly interface
* Secure report management system

---

## User Roles

### Patient

* Register and log in to the platform
* Upload skin images
* Receive AI-generated disease predictions
* Send reports to doctors
* View doctor's analysis and recommendations

### Doctor

* Log in to the platform
* Access patient reports
* Review AI predictions
* Analyze patient conditions
* Provide recommendations and feedback
* Send reviewed reports back to patients

---

## Technology Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* MongoDB

### Artificial Intelligence & Machine Learning

* Python
* TensorFlow
* Flask
* Convolutional Neural Networks (CNN)
* Computer Vision

### Authentication & Security

* JWT Authentication
* OTP Verification

---

## System Workflow

```text
Patient Uploads Skin Image
            │
            ▼
      AI Prediction Model
            │
            ▼
   Disease Prediction Report
            │
            ▼
 Patient Sends Report to Doctor
            │
            ▼
      Doctor Reviews Report
            │
            ▼
 Doctor Provides Analysis &
       Recommendations
            │
            ▼
 Patient Receives Final Report
```

---

## Project Structure

```text
DermaCure-AI/
│
├── src/                  # Frontend source code
├── backend/              # Backend APIs and services
├── models/               # Trained AI models
├── public/               # Static assets
├── README.md
├── package.json
└── LICENSE
```

---

## Prerequisites

Before running this project, ensure you have the following installed:

* Node.js (Version 16 or higher)
* Python (Version 3.8 or higher)
* MongoDB
* Git

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/sakshi987123/Skin-Disease-Prediction-Using-Deep-Learning.git
cd Skin-Disease-Prediction-Using-Deep-Learning
```

### Install Frontend Dependencies

```bash
npm install
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Run the setup script:

```bash
node setup.js
```

Install backend dependencies:

```bash
npm install
```

### Set Up Python Environment

Activate the virtual environment:

#### Windows

```bash
venv310\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

---

## Running the Project

### Start Flask AI Server

```bash
python app.py
```

The Flask server will run on:

```text
http://localhost:5001
```

### Start Node.js Backend Server

Open a new terminal:

```bash
cd backend
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal from the root directory:

```bash
npm run dev
```

The frontend application will run on:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file and configure the required variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## How It Works

1. Patient registers and logs into the platform.
2. Patient uploads a skin image.
3. The Deep Learning model analyzes the image.
4. An AI-generated disease prediction report is created.
5. The patient reviews the prediction result.
6. The patient sends the report to a doctor.
7. The doctor accesses the report through the doctor dashboard.
8. The doctor reviews the AI prediction and patient details.
9. The doctor provides analysis and recommendations.
10. The reviewed report is sent back to the patient.
11. The patient can view both the AI prediction and doctor feedback.


---

## Applications

* Early skin disease awareness
* AI-assisted healthcare solutions
* Medical image analysis
* Telemedicine support
* Healthcare technology innovation
* Educational and research purposes

---

## Future Enhancements

* Live doctor-patient chat
* Video consultation support
* Enhanced disease prediction accuracy
* Mobile application development
* Multi-language support
* Cloud deployment
* Electronic medical record integration

---

## Learning Outcomes

This project helped in gaining practical experience with:

* Deep Learning and Computer Vision
* TensorFlow model development
* Medical image classification
* Full-Stack Web Development
* REST API development
* MongoDB database management
* Authentication and authorization
* Healthcare-focused software solutions


---

## Disclaimer

DermaCure AI is developed for educational and research purposes only. The predictions generated by the AI model are not intended to replace professional medical diagnosis or treatment. Users should always consult qualified healthcare professionals for medical advice.
