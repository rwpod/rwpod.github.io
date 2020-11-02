# RWpod website ![Build and Deploy](https://github.com/rwpod/rwpod.github.io/workflows/Build%20and%20Deploy/badge.svg?branch=www)

Build on [middlemanapp.com](http://middlemanapp.com/)

Content on website: <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png" /></a>


### Dev

#### Update idv3 for mp3

```bash
./node_modules/.bin/gulp update_idv3 --audio /Users/leo/Stuff/podcasts/08/0843/0843.mp3 --md source/posts/2020/11-02-podcast-08-43.html.md --number 0843
```

#### Purge the Cache for an Existing CDN Endpoint

```bash
doctl compute cdn flush 4e2758e2-2f33-474e-bd1e-7e8628ecc68d --files "[*]"
```
