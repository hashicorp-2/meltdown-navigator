#!/bin/bash
# Copy-paste these commands one by one

# 1. Navigate to project
cd /Users/ogowemr/meltdown-navigator

# 2. Remove old remote (if exists)
git remote remove origin 2>/dev/null || true

# 3. Add correct remote with your username
git remote add origin https://github.com/hashicorp-2/meltdown-navigator.git

# 4. Verify remote is set correctly
git remote -v

# 5. Make sure you're on main branch
git branch -M main

# 6. Push to GitHub
git push -u origin main

