# React Page Cache
cache react pages.

## Introduction
SPA is good and bad. As I encountered, one shortage is the easy-losing page context: you go to a new page, and click back button on mobile or browser, biting your apple and expecting the previous page, and ... W**??? The page is reloading and the infinite-scroll list you have dragged for a year is just gone!!! Ok, let's add some data cache mechanism to this page, and soon you will punch your monitor because this work is not easy to do, and there are more and more states and pages your want to enhance. So what's the key? Why Bob can buy everything in anytime without going to ask his mom? Well, because he just *caches* the cash in his pocket (and he is rich)! So, I am rich of memories with 4GB on my mobile phone and 8GB on my computer, don't stop me caching 100,000,000 pages!

## Usage
### Install this package
`npm i --save react-page-cache`

### Create a cache manager and mount the renderer

```
import createCacheManager from 'react-page-cache';

const manager = createCacheManager();
ReactDOM.render(
    manager.renderer,
    document.getElementById('root')
);
```

### Activate page as you need

```
 manager.activatePage({
    id: 'unique page id',
    args: {...}, // whatever page args, optional
    page: (args)=><MyTestPage {...}/>, // how to build the page by the args
    cacheTime: 10 * 60 * 1000 // cache time after this page is inactivated, if omitted, it will equal to global options
})
```

### If you really need, you can inactivate all pages
`manager.inactivePages()`

### You can set global options
```
manager.GlobalOptions.cacheTime = 5 * 60 * 1000;
manager.GlobalOptions.cacheLimit = 5;
```

## Demo Repo
[here](https://github.com/zhaoyao91/react-page-cache-demo)

## TODO
- support page switch animations.

## License
MIT