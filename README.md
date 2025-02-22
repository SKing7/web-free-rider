Web Free Rider
实时显示位置和违章摄像头

## Getting Started


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Docker

> Dockerfile

配置tunel

- cloudflare中添加CNAME记录，目标指向当前及其的id.cloudflare.com
-  ~/.cloudflared/config.yml
```yml
   tunnel: xxx 
   credentials-file:  /Users/tz/.cloudflared/9483550a-7198-4b67-96e6-cfdee802a666.json
   ingress:
     - hostname: mg.tz0618.uk
       service: http://localhost:2618  # 修改为你的本地服务端口
     - hostname: web-free-rider.tz0618.uk
       service: http://localhost:1989
     - service: http_status:404

```
- 重启cloudflare服务

```shell
launchctl stop com.cloudflare.tune.memorygame
launchctl start com.cloudflare.tune.memorygame
```