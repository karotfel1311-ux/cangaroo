## About

Cangaroo is all in one tool to manage your pkg repository

## Development

1. Download dependecies with `pnpm install
2. copy .env.example to .env
3. run `pnpm run start:dev`
4. open [http://localhost:3000](http://localhost:3000)

## What works

- scrap dlps website
- auto download from favourite (predefined) provider with jdownloader
- list downlads from jdownloader
- list local .pkg files categorized by catalogs
- install any .pkg file with RPI (remote package installer)
- dynamic configuration for integrations (RPI, DPI, server port, server ip)

## To do

- configure jdownloader to work as integration (plug & play)
- auto reconnect jdownloader
- allow to pause, restart, fix password issue, remove finished tasks in downloader
- connect (remote repository) -> (downloader) -> (local files) together

## Docker usage

- service port `3000`
- mount catalogs `/app/cached` and `/app/files`