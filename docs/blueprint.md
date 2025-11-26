# **App Name**: LeafWise

## Core Features:

- Image Capture/Upload: Allows users to capture a new image with their camera or upload an existing image from their device's gallery to identify a plant.
- Plant Identification: Leverages an AI model through an external Plant-ID API to analyze the provided image and identify the plant species. Returns the common name, scientific name, and a confidence percentage. The AI model acts as a tool in identifying plants and determining what data is relevant to return to the user.
- Identification Results Display: Displays the plant's common name, scientific name, confidence percentage, and basic care tips in a clear, user-friendly format.
- Scan History: Stores past plant identifications locally on the user's device, including the image, plant information, and timestamp.
- History Management: Enables users to browse through their identification history, view details of previous scans, and delete scans they no longer need.

## Style Guidelines:

- Primary color: Forest green (#388E3C) to evoke nature and growth.
- Background color: Light beige (#F5F5DC) for a natural, earthy feel; keeps the app accessible.
- Accent color: Burnt orange (#D35400) for highlights and action items to stand out against the calm background.
- Body and headline font: 'PT Sans' sans-serif for readability and a touch of warmth. 
- Use minimalist icons that are intuitive and representative of plants, history, and settings.
- Employ a clean, responsive layout optimized for mobile devices, ensuring key functions are easily accessible.
- Implement subtle loading animations to provide feedback during image processing and API calls.