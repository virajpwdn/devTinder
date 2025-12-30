# DevTinder Backend 🚀

> **A production‑grade, scalable backend powering a real‑time developer matchmaking platform.**
> Built with modern backend engineering, cloud‑native deployment, and full observability in mind.

---

## 🧠 Overview

**DevTinder Backend** is the core engine behind the DevTinder platform — handling authentication, matchmaking logic, real‑time chat, payments, notifications, and system observability.

This project is designed and implemented with **real‑world production standards**, focusing on:

* Scalability
* Fault tolerance
* Asynchronous processing
* Real‑time communication
* Cloud‑native deployment
* Monitoring & observability

The backend is fully **containerized**, deployed on **Kubernetes**, and actively monitored using industry‑standard tools.

---

## 🛠 Tech Stack

### Core Backend

* **Node.js** – Runtime environment
* **Express.js** – Web framework
* **MongoDB** – Primary database (NoSQL)

### Asynchronous & Messaging

* **AWS SQS** – Email event queue for newly signed‑up users

### Real‑Time Communication

* **Socket.IO** – Real‑time chat and live interactions

### Payments

* **Razorpay** – Secure payment gateway integration

### Containerization & Orchestration

* **Docker** – Containerization
* **Kubernetes** – Deployment, scaling, and orchestration

### Observability & Monitoring

* **Prometheus** – Metrics collection
* **Loki** – Centralized logging
* **Grafana** – Metrics & logs visualization

---

## ✨ Key Features

### 🔐 Authentication & User Management

* Secure user signup and login
* User profile creation and updates
* Event‑driven post‑signup workflows

### 📬 Email Notifications (Async)

* AWS SQS‑based email queue
* Decoupled email processing for reliability
* Non‑blocking backend workflows

### 💬 Real‑Time Chat

* One‑to‑one messaging using Socket.IO
* Low‑latency, bidirectional communication
* Scalable real‑time architecture

### 💳 Payment Integration

* Razorpay payment gateway
* Secure transaction handling
* Backend‑verified payment workflows

### 📦 Cloud‑Native Deployment

* Fully Dockerized services
* Kubernetes‑managed deployments
* Environment‑agnostic architecture

### 📊 Observability (Production‑Ready)

* Application and system metrics via Prometheus
* Centralized logs using Loki
* Interactive dashboards in Grafana
* Easier debugging, monitoring, and scaling decisions

---

## 🧩 System Architecture (High Level)

```
Client (Web/App)
     │
     ├── REST APIs (Express)
     │       ├── Auth & User Service
     │       ├── Matchmaking Logic
     │       ├── Payments Service (Razorpay)
     │       └── Event Producers
     │
     ├── Socket.IO (Real‑Time Chat)
     │
     ├── MongoDB (Persistent Storage)
     │
     ├── AWS SQS (Email Queue)
     │
     └── Observability Stack
             ├── Prometheus (Metrics)
             ├── Loki (Logs)
             └── Grafana (Dashboards)
```

---

## 🚀 Live Project

The backend is **live and actively running** in a production environment.

🔗 **Live URL:** *Available on request / configured in deployment*
📈 **Monitoring Dashboards:** Grafana dashboards connected to live metrics

---

## ⚙️ Local Development Setup

### Prerequisites

* Node.js (v18+ recommended)
* Docker & Docker Compose
* MongoDB (local or containerized)
* Kubernetes (kind / minikube / cloud cluster)

### Steps

```bash
# Clone repository
git clone <repo-url>
cd devtinder-backend

# Install dependencies
npm install

# Start development server
npm run dev
```

For containerized setup:

```bash
docker build -t devtinder-backend .
docker run -p 3000:3000 devtinder-backend
```

---

## ☸️ Kubernetes Deployment

* Docker images are deployed to a Kubernetes cluster
* Services, Deployments, and Ingress configured
* Horizontal scalability supported
* Environment variables managed via ConfigMaps & Secrets

```bash
kubectl apply -f k8s/
```

---

## 📈 Monitoring & Observability

* **Prometheus** scrapes backend metrics
* **Loki** aggregates structured logs
* **Grafana** visualizes:

  * API performance
  * Error rates
  * System health
  * Resource utilization

This setup ensures:

* Faster debugging
* Better performance insights
* Production‑level reliability

---

## 🧪 Code Quality & Practices

* Modular architecture
* Clean separation of concerns
* Environment‑based configuration
* Scalable and maintainable codebase
* Production‑focused error handling

---

## 🛣 Future Enhancements

* Rate limiting & API throttling
* Advanced matchmaking algorithms
* Microservices decomposition
* Distributed tracing (OpenTelemetry)
* CI/CD automation

---

## 👨‍💻 Authors & Ownership

This project is **entirely designed, developed, and deployed by me.
