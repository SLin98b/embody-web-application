# embody-web-application
Version 1.0

This web application allows users to identify and locate Emotions in the body. This application was developed for my bachelors thesis in media informatics. 

## Main functions:
- display of a silhouette of the human body
- login feature across sessions
- locating emotions on this silhouette
- tracking location, intensity and situational context in logs
- displaying an overview of logged entries
- log storage via Supabase

### For a more detailed description of the implemented features and design choices made, please refer to the Paper for which this app was developed. This documentary focuses on a requirements & set-up guide.

# Requirements
## Please note that while third party tools and services were used for storage and deployment, all of these services are provided free of charge.
- git
- Node.js v.18+
- Next.js
- Supabase account for Database access
- Vercel account for deployment

# Set-up
## Cloning the repository
#### git clone https://github.com/SLin98b/embody-web-application.git
#### cd embody-web-application

## Installation of the dependencies is handled via
#### npm install

### You can now run the web application locally under http://localhost:3000 on your device and on other devices in the same network! To have database functions, you need to sign up to supabase and create a table with the corresponding data entries:

![image](https://github.com/user-attachments/assets/eaeeef3c-306c-4cdf-aed4-0b1592dd0253)

### Once you have done that, be sure to enter your SUPABASE KEY and SUPABASE ANON KEY into your env.local file.

### Deployment beyond local network scope was handled via Vercels' serverless architecture:

#### npm install -g vercel
#### vercel login
#### vercel

# After the initial set-up, you can deploy a production of the app via
#### vercel -prod

# Customizing the application for different use-cases: 
## As described in the bachelor thesis, several elements have been designed to be easily customizable. These are also described in comments in the files. Some examples:
- hideable features throughout the app via use of tailwindCSS. If any features are deemed unnecessary for e.g. lab studies, you can simply hide them by implementing "hidden" in their className="".
- An example is the custom emotion input field, which is set to hidden by default
- the array of displayed emotions can be edited in the locales.ts file. Be aware that one should change both english and german arrays.
- the body part tagging can be adapted to be more specific by adding if-clauses in the getBodyPart function in the entry-page.tsx file
- the display of emotions can be randomized
- changing the slider descriptions to accomodate other use cases
- etc...


