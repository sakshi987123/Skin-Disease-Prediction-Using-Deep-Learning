# DermaCure AI

DermaCure AI is an intelligent AI-based system for early skin disease detection and personalized care using symptom-based and image-based analysis.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Python** (version 3.8 or higher) - [Download here](https://www.python.org/)
- **MongoDB** - [Download here](https://docs.mongodb.com/manual/installation/)
- **Git** (for cloning the repository)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dermacure-ai
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up the backend:**

   a. Navigate to the backend directory:
   ```bash
   cd backend
   ```

   b. Run the setup script:
   ```bash
   node setup.js
   ```

   c. Install Node.js dependencies:
   ```bash
   npm install
   ```

   d. Set up Python environment:
   ```bash
   # Activate the virtual environment (Windows)
   venv310\Scripts\activate

   # Install Python dependencies
   pip install -r requirements.txt
   ```

## Running the Project

1. **Start the Python Flask server** (for AI predictions):
   ```bash
   # From backend directory, with venv activated
   python app.py
   ```
   The Flask server should start on `http://localhost:5001` (or check the output for the exact port).

2. **Start the Node.js backend server** (in a new terminal):
   ```bash
   # From backend directory
   npm run dev
   ```
   The Node.js server should start on `http://localhost:5000` (or check the output for the exact port).

3. **Start the frontend** (in a new terminal):
   ```bash
   # From root directory
   npm run dev
   ```
   The frontend should be available at `http://localhost:5173` (or check the output for the exact port).

## Environment Variables

Make sure to configure the `.env` file in the `backend` directory with the necessary environment variables (refer to `env.example` for the required variables).

## Building for Production

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Build the backend:**
   ```bash
   cd backend
   npm run build
   ```

3. **Start the production servers:**
   - For Node.js backend: `npm start`
   - For Python: `python app.py` (or use a production WSGI server like Gunicorn)

## Project Structure

- `src/` - Frontend React application
- `backend/src/` - Node.js TypeScript backend
- `backend/app.py` - Python Flask server for AI predictions
- `models/` - Pre-trained AI models
- `backend/venv310/` - Python virtual environment

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **AI/ML:** Python, TensorFlow, Flask
- **Authentication:** JWT, OTP

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.