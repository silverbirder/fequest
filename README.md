# Fequest

## Docker

```
docker build -f apps/admin/Dockerfile -t fequest-admin .
docker run  --rm -p 3001:3001 fequest-admin
```

```
docker build -f apps/user/Dockerfile -t fequest-user .
docker run  --rm -p 3000:3000 fequest-user
```
