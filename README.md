# 💰 SmartSpend – AI Expense Manager

> A modern, futuristic, and intelligent expense management web application with a dark 3D UI, interactive analytics, and automated cloud deployment using AWS EC2, Nginx, GitHub Actions, and SCP.

---

## 📌 Project Overview

**SmartSpend – AI Expense Manager** is a web-based personal finance management application designed to help users track income, monitor expenses, analyze spending habits, and receive financial insights.

The application provides a modern **dark-themed 3D interface** with interactive charts and a responsive design.

The project is also deployed on an **AWS EC2 instance** using **Nginx** as the web server and uses **GitHub Actions with SCP/SSH** for automated deployment.

This project demonstrates both **frontend web development** and practical **Cloud & DevOps deployment** concepts.

---

## ✨ Features

### 💳 Expense Management
- Add income and expenses
- Select expense categories
- Enter transaction descriptions
- Select transaction dates
- Automatically calculate financial totals
- Store transaction data using browser LocalStorage

### 📊 Financial Dashboard
- Total Balance
- Total Income
- Total Expenses
- Savings Rate
- Recent Transactions
- Monthly Budget Progress

### 📈 Analytics
- Category-based expense analysis
- Interactive doughnut chart
- Spending distribution
- Visual financial statistics

### 🤖 AI Financial Insights
The application provides automated financial recommendations based on spending patterns.

Example insights:

- High spending in specific categories
- Budget usage warnings
- Savings recommendations
- Spending behavior analysis

> **Note:** The current version uses JavaScript-based rule logic for financial insights. A real AI/ML API can be integrated in future versions.

### 🔎 Transaction Search
Users can search and filter transactions quickly from the dashboard.

### 🎨 Modern 3D UI
- Dark futuristic design
- Glassmorphism cards
- Neon-style visual effects
- 3D hover animations
- Responsive layout
- Modern typography
- Interactive components

### 📱 Responsive Design
The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js
- Google Fonts

## Browser Storage

- LocalStorage

## Cloud & DevOps

- Amazon Web Services (AWS)
- AWS EC2
- Linux
- Nginx
- Git
- GitHub
- GitHub Actions
- SCP
- SSH

---

# 🏗️ Project Architecture

```text
                 👨‍💻 Developer
                      │
                      ▼
                Local Project
                      │
                      │ git push
                      ▼
                  🐙 GitHub
                      │
                      │ GitHub Actions
                      ▼
              ⚙️ CI/CD Workflow
                      │
                      │ SCP / SSH
                      ▼
                ☁️ AWS EC2
                      │
                      ▼
                  🌐 Nginx
                      │
                      ▼
             💰 SmartSpend Website
                      │
                      ▼
                  👤 User
```

---

# 🔄 Application Workflow

```text
User
 │
 ▼
SmartSpend Dashboard
 │
 ├── Add Income
 │
 ├── Add Expense
 │
 ├── View Transactions
 │
 ├── Analyze Spending
 │
 ├── Check Budget
 │
 └── View Financial Insights
 │
 ▼
LocalStorage
 │
 ▼
Dashboard Updates
```

---

# 🚀 Deployment Architecture

The application is hosted on an AWS EC2 Linux server.

```text
GitHub Repository
       │
       │ Push Code
       ▼
GitHub Actions
       │
       │ Automated Deployment
       ▼
SCP / SSH
       │
       ▼
AWS EC2 Instance
       │
       ▼
Nginx Web Server
       │
       ▼
/var/www/html
       │
       ▼
SmartSpend Website
```

---

# ☁️ AWS EC2 Deployment

The application is deployed on an **Amazon EC2 instance**.

The EC2 server acts as the hosting environment for the SmartSpend frontend.

### EC2 Responsibilities

- Hosts the website files
- Runs the Nginx web server
- Provides public access to the application
- Receives application updates through GitHub Actions
- Serves HTML, CSS, and JavaScript files

---

# 🌐 Nginx Web Server

**Nginx** is used as the web server to serve the SmartSpend frontend.

The website files are placed inside:

```text
/var/www/html
```

A basic Nginx configuration can look like:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

After configuring Nginx, the service can be restarted using:

```bash
sudo systemctl restart nginx
```

Check Nginx status:

```bash
sudo systemctl status nginx
```

---

# 🔐 SSH Configuration

SSH is used to securely connect to the AWS EC2 server.

Example:

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

Depending on the Linux distribution, the username may be:

```text
ec2-user
```

or:

```text
ubuntu
```

---

# 📦 SCP Deployment

**SCP (Secure Copy Protocol)** is used to transfer website files from the GitHub Actions environment to the EC2 server.

The deployment process transfers files such as:

```text
index.html
style.css
script.js
```

to:

```text
/var/www/html
```

This allows the latest version of the application to be automatically hosted by Nginx.

---

# ⚙️ GitHub Actions CI/CD

The project uses **GitHub Actions** to automate deployment.

Whenever changes are pushed to the configured GitHub branch, the GitHub Actions workflow can:

1. Start the workflow
2. Check out the repository
3. Connect to the EC2 server
4. Transfer updated files using SCP
5. Place files in the Nginx web directory
6. Make the updated website available

### CI/CD Flow

```text
Developer
    │
    ▼
git add .
    │
    ▼
git commit
    │
    ▼
git push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ▼
SCP / SSH
    │
    ▼
AWS EC2
    │
    ▼
Nginx
    │
    ▼
Updated Website
```

---

# 🧩 Example GitHub Actions Workflow

A representative workflow for SCP deployment can look like this:

```yaml
name: Deploy SmartSpend to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Deploy Files to EC2
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "index.html,style.css,script.js"
          target: "/var/www/html"
```

> **Note:** This is a representative example. Your actual workflow may use different action versions, paths, branches, or deployment commands.

---

# 🔑 GitHub Secrets

Sensitive AWS/SSH information should not be stored directly inside the workflow file.

GitHub Actions Secrets can be used for values such as:

```text
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

### Example

```yaml
host: ${{ secrets.EC2_HOST }}
username: ${{ secrets.EC2_USERNAME }}
key: ${{ secrets.EC2_SSH_KEY }}
```

This helps prevent sensitive server information and private SSH keys from being exposed in the repository.

---

# 📁 Project Structure

```text
smart-expense-manager/
│
├── index.html
├── style.css
├── script.js
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
└── README.md
```

---

# 💻 Frontend Structure

## `index.html`

Contains the main structure of the SmartSpend application.

It includes:

- Sidebar navigation
- Dashboard
- Summary cards
- Transactions
- Budget section
- Analytics
- AI insights
- Add transaction modal

---

## `style.css`

Contains the complete visual design.

Main styling concepts include:

- Dark theme
- Glassmorphism
- 3D effects
- Neon UI effects
- Responsive layout
- Cards
- Buttons
- Modals
- Tables
- Animations
- Hover effects

---

## `script.js`

Responsible for application functionality.

It handles:

- Adding transactions
- Updating balances
- Calculating income
- Calculating expenses
- Calculating savings rate
- Filtering transactions
- Searching transactions
- Updating charts
- Budget calculations
- LocalStorage
- Financial insights

---

# 💾 Data Storage

The current version uses browser **LocalStorage**.

Transaction data is stored locally in the user's browser.

Example:

```javascript
localStorage.setItem("transactions", JSON.stringify(transactions));
```

Data can then be retrieved using:

```javascript
const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];
```

### Advantages

- No backend required
- Simple implementation
- Fast data access
- Works directly in the browser

### Limitation

LocalStorage is browser-specific and is not suitable for multi-user production applications.

A future version can use:

```text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
PostgreSQL
```

---

# 📊 Dashboard

The SmartSpend dashboard provides a quick overview of the user's financial condition.

### Dashboard Metrics

| Metric | Description |
|---|---|
| Total Balance | Current balance after income and expenses |
| Total Income | Total recorded income |
| Total Expenses | Total recorded expenses |
| Savings Rate | Percentage of income remaining |
| Budget | Monthly spending limit |
| Transactions | Recent financial activities |

---

# 📈 Expense Analytics

The application uses **Chart.js** to display spending by category.

Example categories:

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Other

The chart helps users understand where their money is being spent.

---

# 🤖 AI Financial Insights

The SmartSpend application includes an intelligent insights section.

The system analyzes transaction information and generates recommendations.

Example:

```text
⚠️ Your shopping expenses are higher than usual.

💡 Consider reducing unnecessary purchases
to improve your monthly savings.
```

Future versions can integrate:

- Machine Learning
- OpenAI API
- Financial prediction models
- Spending prediction
- Personalized recommendations
- Anomaly detection

---

# 💰 Budget Management

Users can define a monthly budget and monitor their spending.

Example:

```text
Monthly Budget: ₹30,000

Expenses: ₹12,499

Remaining: ₹17,501
```

The budget progress can be visualized through the dashboard.

---

# 🖥️ Run Locally

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Move into the project:

```bash
cd smart-expense-manager
```

---

## 2. Open the Project

You can open the project using VS Code:

```bash
code .
```

Then open:

```text
index.html
```

You can also use the **Live Server** extension in VS Code.

---

# 🐧 EC2 Server Setup

After connecting to the EC2 instance:

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

Update the system:

```bash
sudo yum update -y
```

For Ubuntu:

```bash
sudo apt update
sudo apt upgrade -y
```

Install Nginx depending on the operating system.

For Amazon Linux:

```bash
sudo amazon-linux-extras install nginx1
```

For Ubuntu:

```bash
sudo apt install nginx -y
```

Start Nginx:

```bash
sudo systemctl start nginx
```

Enable Nginx on boot:

```bash
sudo systemctl enable nginx
```

Check status:

```bash
sudo systemctl status nginx
```

---

# 📤 Manual Deployment Using SCP

Example:

```bash
scp -i your-key.pem index.html ec2-user@YOUR_EC2_PUBLIC_IP:/var/www/html/
```

Copy CSS:

```bash
scp -i your-key.pem style.css ec2-user@YOUR_EC2_PUBLIC_IP:/var/www/html/
```

Copy JavaScript:

```bash
scp -i your-key.pem script.js ec2-user@YOUR_EC2_PUBLIC_IP:/var/www/html/
```

---

# 🔄 Git Workflow

Basic Git workflow used in the project:

```bash
git status
```

Add files:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Update SmartSpend application"
```

Push changes:

```bash
git push origin main
```

After the push, GitHub Actions can automatically deploy the updated files to the EC2 server.

---

# 🛡️ Security Practices

The project follows basic deployment security practices.

### 🔐 SSH Key

SSH private keys should never be committed to GitHub.

Never upload:

```text
*.pem
id_rsa
private keys
```

to the repository.

### 🔑 GitHub Secrets

Use GitHub Secrets for:

```text
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

### 🔥 AWS Security Groups

The EC2 Security Group should only expose required ports.

Typical configuration:

| Port | Protocol | Purpose |
|---|---|---|
| 22 | TCP | SSH |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |

SSH access should ideally be restricted to trusted IP addresses where practical.

---

# 🌍 Accessing the Website

Once Nginx is configured and the EC2 instance has a public IP address, the website can be accessed through:

```text
http://YOUR_EC2_PUBLIC_IP
```

For production use, HTTPS and a domain name should be configured.

---

# 🚀 Future Improvements

The current application is a frontend-based expense manager. Several improvements can make it a production-ready financial platform.

## 🔐 User Authentication

Implement:

- User registration
- Login
- Logout
- JWT authentication
- Password hashing
- User profiles

---

## 🗄️ Backend

Build a backend using technologies such as:

```text
FastAPI
```

or:

```text
Django + Django REST Framework
```

---

## 🐘 PostgreSQL Database

Replace LocalStorage with PostgreSQL.

Possible architecture:

```text
Frontend
    ↓
REST API
    ↓
FastAPI / Django
    ↓
PostgreSQL
```

---

## 🤖 Real AI Integration

Integrate an AI service to provide:

- Personalized financial advice
- Spending prediction
- Expense categorization
- Financial summaries
- Unusual spending detection
- Monthly financial reports

---

## 📊 Advanced Analytics

Future analytics could include:

- Monthly spending trends
- Yearly expense reports
- Category comparison
- Income vs expense charts
- Savings prediction
- Financial health score

---

## ☁️ AWS Improvements

The deployment can be extended with additional AWS services:

```text
Route 53
    ↓
CloudFront
    ↓
Load Balancer
    ↓
EC2
    ↓
Backend
    ↓
RDS PostgreSQL
```

Other possible services:

- Amazon RDS
- Amazon S3
- CloudFront
- Route 53
- Application Load Balancer
- CloudWatch
- AWS Certificate Manager

---

# 🔒 HTTPS

A production deployment should use HTTPS.

Possible setup:

```text
Domain
   ↓
Route 53
   ↓
Load Balancer / EC2
   ↓
Nginx
   ↓
HTTPS
```

SSL certificates can be configured using tools such as Let's Encrypt or AWS Certificate Manager depending on the architecture.

---

# 🐳 Docker

The application can also be containerized.

Example future architecture:

```text
Docker
│
├── Nginx
├── Frontend
├── Backend
└── PostgreSQL
```

This would make deployment more portable and consistent.

---

# 🔁 Improved CI/CD Pipeline

A more advanced GitHub Actions pipeline could include:

```text
Developer
    ↓
Git Push
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
Build
    ↓
Security Checks
    ↓
Deploy
    ↓
AWS
    ↓
Nginx
    ↓
Production
```

---

# 📋 DevOps Concepts Demonstrated

This project demonstrates several practical DevOps concepts.

### Version Control

```text
Git + GitHub
```

Used for source code management and collaboration.

### Continuous Integration

```text
GitHub Actions
```

Used to automatically execute deployment workflows after code changes.

### Continuous Deployment

```text
GitHub Actions
      ↓
SCP
      ↓
EC2
```

Used to automatically deploy updated application files.

### Infrastructure

```text
AWS EC2
```

Used as the cloud hosting environment.

### Web Server

```text
Nginx
```

Used to serve the frontend application.

### Secure Remote Access

```text
SSH
```

Used for secure communication with the EC2 instance.

### File Transfer

```text
SCP
```

Used to transfer application files to the server.

---

# 📚 What I Learned

Through this project, I gained practical experience in:

### Frontend Development

- HTML
- CSS
- JavaScript
- Responsive design
- UI/UX
- Chart.js
- LocalStorage

### Git & GitHub

- Git repository management
- Branches
- Commits
- Push/Pull
- Remote repositories
- Version control

### Linux

- Linux commands
- File permissions
- Directory management
- Server administration

### AWS

- EC2
- Security Groups
- Public IP
- Cloud server deployment

### Nginx

- Web server configuration
- Static file hosting
- Website deployment
- Service management

### GitHub Actions

- CI/CD workflows
- Automated deployment
- GitHub Secrets
- Deployment automation

### SSH & SCP

- Secure server access
- Remote file transfer
- Automated deployment

---

# 🎯 Project Highlights

⭐ Modern futuristic 3D interface

⭐ Expense and income management

⭐ Interactive financial dashboard

⭐ Category-based expense analytics

⭐ Budget tracking

⭐ Automated financial insights

⭐ LocalStorage data persistence

⭐ Responsive design

⭐ AWS EC2 deployment

⭐ Nginx web server

⭐ GitHub Actions CI/CD

⭐ SCP-based deployment

⭐ Linux server administration

⭐ SSH-based secure deployment

---

# 🧪 Testing

Before deployment, basic testing should include:

### UI Testing

- Dashboard loads correctly
- Navigation works
- Modal opens and closes
- Forms work correctly
- Responsive design works

### Transaction Testing

- Add income
- Add expense
- Delete transaction
- Search transaction
- Filter transactions

### Calculation Testing

Verify:

```text
Balance = Income - Expenses
```

and:

```text
Savings Rate =
((Income - Expenses) / Income) × 100
```

### Deployment Testing

Verify:

```text
Git Push
    ↓
GitHub Actions
    ↓
SCP
    ↓
EC2
    ↓
Nginx
    ↓
Website
```

---

# 📌 Project Status

```text
Frontend              ✅ Completed
Dashboard             ✅ Completed
Expense Management    ✅ Completed
Income Management     ✅ Completed
Analytics             ✅ Completed
Budget Tracking       ✅ Completed
AI Insights           ✅ Basic Version
LocalStorage          ✅ Implemented
AWS EC2               ✅ Deployed
Nginx                 ✅ Configured
GitHub                ✅ Used
GitHub Actions        ✅ Configured
SCP Deployment        ✅ Configured
Backend               🔄 Future Enhancement
Database              🔄 Future Enhancement
Real AI               🔄 Future Enhancement
Authentication        🔄 Future Enhancement
HTTPS                 🔄 Future Enhancement
```

---

# 📝 License

This project is created for **educational, portfolio, and learning purposes**.

You are free to modify and improve the project for your own learning and development.

---

# 👨‍💻 Author

## Rince Mohamed PM

**BCA – Artificial Intelligence, Cloud Computing & DevOps**

Interested in:

- Cloud Computing
- DevOps
- AWS
- Python
- Web Development
- CI/CD
- Automation
- Cloud Deployment

---

# ⭐ GitHub Topics

Recommended GitHub repository topics:

```text
html
css
javascript
chartjs
aws
aws-ec2
nginx
github-actions
cicd
devops
scp
ssh
cloud
cloud-deployment
expense-manager
finance
web-development
```

---

# 📌 Repository Description

You can use the following description for the GitHub repository:

> **AI-powered Smart Expense Manager with a futuristic 3D UI, deployed on AWS EC2 using Nginx with automated GitHub Actions CI/CD and SCP deployment.**

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 🚀 SmartSpend

> **Track your money. Understand your spending. Build better financial habits.**

**Built with HTML, CSS, JavaScript, AWS EC2, Nginx, GitHub Actions, SCP, and DevOps practices.**
