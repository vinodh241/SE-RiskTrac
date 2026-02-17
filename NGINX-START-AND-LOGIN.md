# How to Start Nginx & Check the Application Login Page

## Deployed on a server (e.g. 10.0.1.32)

When the stack runs on a **server** (e.g. **10.0.1.32**), open the app from your browser using the **server IP** and port **8080**:

- **Login page:** **http://10.0.1.32:8080/**
- **Health:** http://10.0.1.32:8080/health
- **ORM:** http://10.0.1.32:8080/orm/
- **User Management:** http://10.0.1.32:8080/user-management/

The scripts in `scripts/` use `scripts/config` with `APP_HOST=10.0.1.32` so start/status output shows these URLs.

---

## Prerequisites

- Docker and Docker Compose installed
- The external network `risktrac` must exist (used by docker-compose)

## 1. Create the Docker network (one-time)

If you haven’t already:

```bash
docker network create risktrac
```

## 2. Start all services (including Nginx)

From the project root (where `docker-compose.yaml` is):

```bash
cd d:\DevSecOps-Aws-84\SE-RiskTrac
docker-compose up -d
```

This starts: **authapi**, **umapi**, **ormapi**, **bcmapi**, **umweb**, **ormweb**, **hostweb**, and **nginx**.

## 3. Check that Nginx is running

```bash
docker ps
```

You should see a container named **nginx** with port **8080->80** (or 80->80 if you use port 80). Optional:

```bash
docker logs nginx
```

To hit Nginx directly from the server (should return 200):

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health
```

You should see `200`. (On the server use port 8080; from another machine use http://10.0.1.32:8080/health.)

## 4. Open the application login page

The **login page** is served by **hostweb** at the **root** URL.

**If the app is on a server (e.g. 10.0.1.32):**

- **URL:** **http://10.0.1.32:8080/**  
- From your PC/laptop, open a browser and go to that URL.

**If running on the same machine (local):**

- **URL:** **http://localhost:8080/**  
- Or with a hostname: **http://serisktrac.secureyes.net/** (if DNS points to the server).

Steps:

1. Open a browser (on your PC or on the server).
2. Go to: **http://10.0.1.32:8080/** (replace with your server IP if different).
3. You should see the SE-RiskTrac **login page** (hostweb).

## 5. Other useful URLs (after login)

| URL | App |
|-----|-----|
| http://10.0.1.32:8080/ | Host web – **login page** (default) |
| http://10.0.1.32:8080/user-management/ | User Management web |
| http://10.0.1.32:8080/orm/ | ORM web |

*(Use your server IP instead of 10.0.1.32 if different; use localhost:8080 when testing on the same machine.)*

## 6. Seeing "hello from nginx web server" instead of the login page?

That usually means the Nginx image is serving a default page instead of proxying to your app. Do this:

1. **Rebuild the Nginx image** (from project root):

   ```bash
   docker-compose build nginx --no-cache
   ```

2. **Restart Nginx**:

   ```bash
   docker-compose up -d nginx
   ```

3. **Ensure hostweb is running** (it serves the login page):

   ```bash
   docker ps
   docker logs hostweb
   ```

   If hostweb is not running, start the stack: `docker-compose up -d`.

4. Open **http://localhost/** again; you should see the application login page.

## 7. If something else fails

**Nginx not starting**

- Ensure the `risktrac` network exists: `docker network create risktrac`
- Check logs: `docker logs nginx`
- Ensure port 80 is free: `netstat -an | findstr ":80"` (Windows) or `ss -tlnp | grep 80` (Linux)

**Login page not loading / 502**

- Ensure **hostweb** is up: `docker ps` and `docker logs hostweb`
- Ensure **authapi** and **umapi** are up (login uses these): `docker logs authapi` and `docker logs umapi`

**Restart only Nginx**

```bash
docker-compose restart nginx
```

**Stop everything**

```bash
docker-compose down
```
