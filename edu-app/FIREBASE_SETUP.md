# Firebase Setup Guide for Educational Modules

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - Authentication
   - Firestore Database
   - Storage

## 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenWeatherMap API Key (for the weather map)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

## 3. Update Firebase Config

Update the `src/lib/firebase.ts` file with your actual Firebase credentials from the `.env.local` file.

## 4. Firestore Security Rules

Set up the following Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read published modules
    match /modules/{moduleId} {
      allow read: if resource.data.isPublished == true;
      allow write: if request.auth != null && request.auth.token.role == 'teacher';
    }
    
    // Users can read lessons for enrolled modules
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'teacher';
    }
    
    // Users can manage their own progress
    match /userProgress/{progressId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can manage their own enrollments
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 5. Database Structure

The following collections will be created automatically:

- `users` - User profiles and preferences
- `modules` - Educational modules and courses
- `lessons` - Individual lessons within modules
- `userProgress` - User progress tracking
- `enrollments` - User module enrollments

## 6. Sample Data

The application includes sample educational modules for demonstration purposes. You can:

1. Create real modules through the Firebase console
2. Use the provided service functions to programmatically create content
3. Import existing educational content

## 7. Features

- **Weather Map**: Interactive map showing weather conditions across India
- **Educational Modules**: Browse and filter courses by subject
- **User Management**: Student and teacher role-based access
- **Progress Tracking**: Monitor learning progress and completion
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Animations**: Smooth transitions using Framer Motion

## 8. Running the Application

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## 9. Customization

- Modify the `src/lib/types.ts` file to add new fields
- Update the `src/components/EducationalModules.tsx` for different layouts
- Customize the weather map in `src/components/WeatherMap.tsx`
- Add new subjects and categories as needed

## 10. Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Ensure environment variables are set in your deployment platform
4. Update Firebase security rules for production use
