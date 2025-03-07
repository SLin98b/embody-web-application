﻿# embody-web-application
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

### You can now run the web application locally under http://localhost:3000 on your device and on other devices in the same network!
### Deployment beyond local network scope was handled via Vercels' serverless architecture:

#### npm install -g vercel
#### vercel login
#### vercel

# After the initial set-up, you can deploy a production of the app via
#### vercel -prod


