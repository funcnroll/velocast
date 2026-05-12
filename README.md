# Velocast

Upload a GPX route, set your departure time, speed, along with your rider profile and get a scored weather forecast for each segment along your route as you'll actually encounter it.

Built because existing tools either sit behind a paywall or surface raw data without telling you whether conditions are actually worth riding in.

## Stack

React, TypeScript, Vite, Leaflet, Tailwind CSS, Turf.js, Open-Meteo API, Bottleneck, date-fns, react-hot-toast, useHooks

## Notes

Core logic (GPX processing, rate limiting, weather scoring) written by hand. UI and minor refactors assisted by Claude (Anthropic).
