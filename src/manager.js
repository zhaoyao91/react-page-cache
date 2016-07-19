import {createStore, actions} from './store';
import Renderer from './renderer';
import connect from 'react-redux/lib/components/connect';
import React from 'react';
import find from 'lodash/find';
import take from 'lodash/take';

const mapStateToProps = (state)=> {
    return {
        items: state.items
    }
};

const ConnectedRenderer = connect(mapStateToProps)(Renderer);
ConnectedRenderer.displayName = 'ConnectedCacheRenderer';

export default function createManager() {
    const store = createStore();
    const renderer = <ConnectedRenderer store={store}/>;

    return {
        _store: store,

        GlobalOptions: {
            cacheTime: 5 * 60 * 1000,
            cacheLimit: 5
        },

        renderer,

        /**
         * activate a cached page (if it is not cached, then create one first)
         * @param id - unique page id
         * @param args - any page args
         * @param page - func(args): page, page element builder
         * @param cacheTime - milliseconds
         * @param scrollTop - if undefined, recover to the previous position; if null, then remain current position; if number, then scroll to it
         */
        activatePage({id, args, page, cacheTime = this.GlobalOptions.cacheTime, scrollTop}) {
            const store = this._store;
            const currentScrollTop = document.body.scrollTop;

            // inactive other active pages (if works correctly, there will be at most one)
            store.getState().items.filter(item=>item.isActive && item.id !== id).forEach(item=> {
                this._inactivePage(item);
            });

            // activate target page
            const previousScrollTop = this._activatePage({id, args, page, cacheTime});

            // remove over limit pages
            store.dispatch(actions.setItems(take(store.getState().items.slice().sort((a, b)=>b.lastActivatedAt.getTime() - a.lastActivatedAt.getTime()), this.GlobalOptions.cacheLimit)));

            // recover scroll
            if (scrollTop === undefined) this._recoverScroll(previousScrollTop);
            else if (scrollTop === null) this._recoverScroll(currentScrollTop);
            else this._recoverScroll(scrollTop);
        },

        /**
         * inactivate all pages
         */
        inactivatePages() {
            const store = this._store;

            store.getState().items.filter(item=>item.isActive).forEach(item=> {
                this._inactivePage(item);
            });
        },

        /**
         * remove specified page
         * @param id
         */
        removePage(id) {
            this._store.dispatch(actions.removeItem(id));
        },

        _inactivePage(item) {
            const store = this._store;

            // if cache time < 0, do not cache this page and remove it just as it is inactivated
            if (item.cacheTime < 0) {
                store.dispatch(actions.removeItem(item.id));
            }
            else {
                // set clear timer (null = forever)
                let timer;
                if (item.cacheTime !== null) {
                    timer = setTimeout(()=> {
                        store.dispatch(actions.removeItem(item.id));
                    }, item.cacheTime);
                }

                // inactive it
                store.dispatch(actions.setItem(Object.assign({}, item, {
                    isActive: false,
                    cacheTimer: timer,

                    // record scroll position when it is inactivated to recover for the next time it get activated
                    scrollTop: document.body.scrollTop
                })));
            }
        },

        _activatePage({id, args, page, cacheTime}) {
            const store = this._store;
            let scrollTop = 0;
            const item = find(store.getState().items, {id});

            // if found cache
            if (item) {
                // remove the clear timer
                clearTimeout(item.cacheTimer);

                // if current page is already active, stick to its current scroll
                if (item.isActive) {
                    scrollTop = document.body.scrollTop;
                }
                // else, it is re-activated, recover its old scroll
                else {
                    scrollTop = item.scrollTop;
                }
            }

            // activate it
            store.dispatch(actions.setItem({id, args, page, lastActivatedAt: new Date, isActive: true, cacheTime}));

            // who invoked me? please scroll
            return scrollTop;
        },

        _recoverScroll(scrollTop) {
            document.body.scrollTop = scrollTop;
            setTimeout(()=>document.body.scrollTop = scrollTop, 0);
        }
    }
};