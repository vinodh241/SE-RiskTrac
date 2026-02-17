# SE-RiskTrac – Working Scripts

Run from the **project root** or from anywhere (scripts resolve paths automatically).

| Script       | Purpose |
|-------------|---------|
| `start.sh`  | Create network if needed, start all services (docker-compose up -d) |
| `stop.sh`   | Stop all services (docker-compose down) |
| `restart.sh`| Stop then start all services |
| `status.sh`| Show container status and health check URLs |
| `logs.sh`   | Tail logs (all services or one: `./scripts/logs.sh nginx`) |
| `build.sh` | Build Docker images (all or specific: `./scripts/build.sh nginx`) |
| `config`    | Set `APP_HOST` (e.g. **10.0.1.32**) so start/status show the correct URLs |

## Deployed on server (e.g. 10.0.1.32)

The default in `scripts/config` is **APP_HOST=10.0.1.32**. Start and status scripts will show:

- **Login:** http://10.0.1.32:8080/
- **ORM:** http://10.0.1.32:8080/orm/
- **UM:** http://10.0.1.32:8080/user-management/

To use a different host or localhost, edit `scripts/config` and set `APP_HOST` (e.g. `export APP_HOST=localhost`).

## Quick start

```bash
# Make executable (once)
chmod +x scripts/*.sh

# Start everything (creates risktrac network if missing)
./scripts/start.sh

# Check status and login URL (uses APP_HOST from scripts/config)
./scripts/status.sh

# Open in browser (when deployed on 10.0.1.32)
#   Login:  http://10.0.1.32:8080/
#   ORM:    http://10.0.1.32:8080/orm/
#   UM:     http://10.0.1.32:8080/user-management/
```

## Requirements

- Docker and Docker Compose installed
- Run on Linux (e.g. `devops@PD-Docker`); for Windows use Git Bash or WSL to run these scripts

## Ports

- **8080** – Nginx (web + login page). Use 80 if you change docker-compose and port 80 is free.
- **6001** – authapi  
- **6002** – umapi  
- **6003** – ormapi  
- **6004** – bcmapi  
