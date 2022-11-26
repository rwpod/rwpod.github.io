# RWpod website ![Build and Deploy](https://github.com/rwpod/rwpod.github.io/workflows/Build%20and%20Deploy/badge.svg?branch=www)

Content on website: <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png" /></a>

Build on top of:

 - [Astro](https://astro.build/)
 - [Svelte](https://svelte.dev/)

and other small libs

### Dev

#### Purge the Cache for an Existing CDN Endpoint

```bash
doctl compute cdn flush 4e2758e2-2f33-474e-bd1e-7e8628ecc68d --files "[*]"
```
