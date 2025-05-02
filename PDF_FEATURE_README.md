# PDF Storybook Generator Feature

This feature allows users to generate beautifully illustrated PDF storybooks from their generated stories using OpenAI's DALL-E API.

## Setup Instructions

1. Create a `.env.local` file in the root of your project with the following content:

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# AWS S3 Configuration (optional)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=magic-story-buddy
```

2. Replace `your_openai_api_key_here` with your actual OpenAI API key.

3. (Optional) If you want to use AWS S3 for storing the generated PDFs, uncomment and fill in the AWS configuration variables.

## How It Works

1. When a user clicks the "Create PDF Storybook" button after generating a story:
   - The story is split into 8 sections
   - For each section, an image description is generated using GPT-4o
   - DALL-E 3 creates an illustration for each description
   - The images and text are compiled into a PDF
   - The PDF is stored (either locally or in S3) and made available for download

2. For local development, PDFs are stored in a temporary directory and served through the `/api/download-pdf` endpoint.

3. For production with S3, signed URLs are generated for temporary access to the PDFs.

## Customization Options

- You can adjust the number of sections by modifying the `numSections` parameter in the `splitStoryIntoSections` function call.
- Image style and quality can be adjusted in the `generateImage` function.
- PDF layout and styling can be customized in the `createPDF` function.

## Dependencies

This feature uses the following packages:
- `openai` - For generating image descriptions and images
- `pdfkit` - For creating PDF documents
- `sharp` - For optimizing images
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` - For S3 storage (optional)
- `node-fetch` - For fetching images from OpenAI

## Notes

- DALL-E 3 image generation costs approximately $0.04 per image. Each PDF generates 8 images, so expect a cost of about $0.32 per PDF.
- The PDF generation process takes 30-60 seconds depending on the story length. 