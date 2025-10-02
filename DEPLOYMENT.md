# Vercel Deployment Setup

This document provides comprehensive instructions for deploying the Bistro Bert website to Vercel, including branch configuration, environment variables, and troubleshooting tips.

## Overview

The Bistro Bert website is configured to deploy to Vercel with the following setup:

- **Framework**: Next.js 14+ with App Router
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Regions**: bru1 (Brussels)
- **Branch Strategy**: 
  - `master` → Production environment
  - `staging` → Preview environment

## Repository Connection to Vercel

### Prerequisites
- GitHub repository with the project code
- Vercel account (free or pro)
- Admin access to the GitHub repository

### Step-by-Step Connection

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import the Repository**
   - Click "Add New..." → "Project"
   - Select the Bistro Bert repository from your GitHub account
   - Click "Import"

3. **Configure Project Settings**
   - Vercel will automatically detect the Next.js framework
   - Verify the following settings:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

4. **Environment Variables**
   - Add any required environment variables in the deployment settings
   - Common variables for this project:
     - `NEXT_PUBLIC_ENV`: Set to "production" for production deployments

5. **Deploy**
   - Click "Deploy" to trigger the initial deployment
   - Wait for the build to complete

## Branch Deployment Strategy

The project is configured with a two-branch deployment strategy:

### Production Branch (master)
- **Branch**: `master`
- **Environment**: Production
- **Environment Variable**: `NEXT_PUBLIC_ENV=production`
- **Deployment URL**: Your main domain (e.g., bistro-bert.vercel.app)
- **Auto-deployment**: Enabled

### Preview Branch (staging)
- **Branch**: `staging`
- **Environment**: Preview
- **Environment Variable**: `NEXT_PUBLIC_ENV=staging`
- **Deployment URL**: Unique preview URL for each deployment
- **Auto-deployment**: Enabled

### Creating and Managing Branches

1. **Staging Branch Setup**
   ```bash
   # Create staging branch if it doesn't exist
   git checkout -b staging
   git push origin staging
   ```

2. **Branch Protection Rules** (Recommended)
   - In GitHub repository settings → Branches
   - Add protection rules for master branch:
     - Require pull request reviews before merging
     - Require status checks to pass before merging
     - Include Vercel deployment status as a required check

## Environment Variables Configuration

### Production Environment
- `NEXT_PUBLIC_ENV`: `production`
- Any other production-specific variables (API keys, etc.)

### Preview Environment
- `NEXT_PUBLIC_ENV`: `staging`
- Any staging-specific variables

### Adding Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add variables for different environments:
   - **Production**: Select "Production" environment
   - **Preview**: Select "Preview" environment
   - **Development**: Select "Development" environment

## Deployment Workflow

### Initial Setup
1. Connect repository to Vercel (as described above)
2. Configure environment variables
3. Deploy master branch to production

### Regular Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```
   - Open a pull request to staging or master
   - Vercel will automatically create a preview deployment

2. **Staging Updates**
   ```bash
   # Merge to staging
   git checkout staging
   git merge feature/new-feature
   git push origin staging
   ```
   - Vercel will automatically deploy to preview environment

3. **Production Updates**
   ```bash
   # Merge to master
   git checkout master
   git merge staging
   git push origin master
   ```
   - Vercel will automatically deploy to production

### Manual Deployments

1. **From Vercel Dashboard**
   - Go to your project
   - Click "Deployments"
   - Click "Redeploy" or "Deploy" with specific branch/commit

2. **Using Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy specific branch
   vercel --prod  # Production
   vercel         # Preview
   ```

## Configuration File Details

The `vercel.json` file contains the following key configurations:

```json
{
  "version": 2,
  "name": "bistro-bert",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["bru1"],
  "git": {
    "deploymentEnabled": {
      "master": true,
      "staging": true
    }
  },
  "environments": {
    "production": {
      "build": {
        "env": {
          "NEXT_PUBLIC_ENV": "production"
        }
      }
    },
    "preview": {
      "build": {
        "env": {
          "NEXT_PUBLIC_ENV": "staging"
        }
      }
    }
  }
}
```

## Troubleshooting

### Common Issues and Solutions

1. **Build Failures**
   - **Issue**: Build fails during deployment
   - **Solution**: 
     - Check build logs in Vercel dashboard
     - Ensure all dependencies are in package.json
     - Verify environment variables are correctly set
     - Run `npm run build` locally to reproduce issues

2. **Environment Variables Not Working**
   - **Issue**: Environment variables not available in the application
   - **Solution**:
     - Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
     - Check that variables are added to the correct environment in Vercel
     - Redeploy after adding new variables

3. **Branch Not Deploying Automatically**
   - **Issue**: Pushes to branch don't trigger deployments
   - **Solution**:
     - Verify branch is listed in `vercel.json` under `git.deploymentEnabled`
     - Check GitHub webhook is properly configured
     - Ensure Vercel has access to the repository

4. **Deployment Stuck in Queue**
   - **Issue**: Deployment remains in "Queued" state
   - **Solution**:
     - Cancel the deployment and try again
     - Check Vercel status page for platform issues
     - Contact Vercel support if issue persists

5. **Routing Issues**
   - **Issue**: Pages not found or routing errors
   - **Solution**:
     - Verify Next.js App Router structure is correct
     - Check for static export configuration conflicts
     - Ensure `vercel.json` doesn't override Next.js routing

### Performance Optimization

1. **Build Optimization**
   - Use Next.js Image component for optimized images
   - Implement dynamic imports for code splitting
   - Enable ISR (Incremental Static Regeneration) where appropriate

2. **Deployment Optimization**
   - Use appropriate regions for your target audience
   - Enable Edge Functions for API routes if needed
   - Monitor build times and optimize slow builds

### Monitoring and Analytics

1. **Vercel Analytics**
   - Enable Vercel Analytics in project settings
   - Monitor page views, web vitals, and user behavior

2. **Performance Monitoring**
   - Check Web Vitals in Vercel dashboard
   - Use Lighthouse audits for performance insights
   - Monitor Core Web Vitals thresholds

## Best Practices

1. **Branch Management**
   - Use feature branches for development
   - Keep master branch always deployable
   - Use staging for pre-production testing

2. **Environment Variables**
   - Never commit sensitive data to repository
   - Use different variables for each environment
   - Document required variables in README

3. **Deployment Safety**
   - Enable branch protection rules
   - Require pull requests for production changes
   - Use preview deployments for testing

4. **Performance**
   - Optimize images and assets
   - Implement proper caching strategies
   - Monitor and optimize Core Web Vitals

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

For deployment-specific issues:
1. Check Vercel status page: [status.vercel.com](https://status.vercel.com)
2. Review Vercel documentation
3. Contact Vercel support through dashboard

For application-specific issues:
1. Review build logs in Vercel dashboard
2. Test locally with `npm run build && npm start`
3. Check GitHub issues for known problems