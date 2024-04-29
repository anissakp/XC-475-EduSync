# EduSync

## Description
EduSync is a web application tailored for college students who wish to simplify and enhance their educational experience. Designed to integrate various Learning Management Systems (LMS) into a single, accessible platform, EduSync allows students to seamlessly access all their course materials, assignments, and schedules in one place. The app facilitates better organization and time management, enabling students to focus more on learning efficiently and effectively. By centralizing course information, EduSync aims to reduce the complexities associated with managing multiple LMS interfaces and ensures that students have everything they need for their academic success right at their fingertips.

## Installation
Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/anissakp/XC-475-EduSync.git
   ```

2. **Install Dependencies at Root Directory**
   ```bash
   cd XC-475-EduSync
   npm install
   ```

3. **Install Firebase Functions Dependencies**
   ```bash
   cd functions
   sudo npm install
   cd ..
   ```

4. **Environment Configuration**
   To run and build the app, specific environment variables are required. Please contact edusyncofficial@gmail.com to obtain the necessary `.env` file data.

## Usage
To run the application locally:

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Simultaneously, Start Firebase Functions Emulator**
   ```bash
   cd functions
   npm run serve
   ```

After starting the application:

- **Log in with your Google account** to access the main features of EduSync.

- **Connect to Blackboard using the Demo Account**
   - **Username:** xysugino
   - **Password:** xysugino

## Build
To build the application for production, run these commands in the root directory: 

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

## Team Members
- Zai Sugino
- Anissa Patel
- Samantha Pang
- Shaimaa Sabbagh
- Emily Doherty

## More Information
For more details about using or contributing to the EduSync project, please visit our project site: [EduSync Site](https://edusync-e6e17.web.app/).
