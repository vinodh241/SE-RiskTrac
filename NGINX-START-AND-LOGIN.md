# How to Start Nginx & Check the Application Login Page

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

You should see a container named **nginx** with port **80->80**. Optional:

```bash
docker logs nginx
```

To hit Nginx directly (should return 200):

```bash
curl -s -o NUL -w "%{http_code}" http://localhost/health
```

You should see `200`.

## 4. Open the application login page

The **login page** is served by **hostweb** at the **root** URL:

- **URL:** **http://localhost/**
- Or: **http://localhost/login** (redirects as needed)
- If you use a hostname (e.g. after configuring DNS/hosts): **http://serisktrac.secureyes.net/**

Steps:

1. Open a browser.
2. Go to: **http://localhost/**
3. You should see the SE-RiskTrac **login page** (hostweb).

## 5. Other useful URLs (after login)

| URL | App |
|-----|-----|
| http://localhost/ | Host web – **login page** (default) |
| http://localhost/user-management/ | User Management web |
| http://localhost/orm/ | ORM web |

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
