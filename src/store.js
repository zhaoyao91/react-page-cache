import _createStore from 'redux/lib/createStore';

/**
 * state shape
 *
 * {
 *   items: [
 *     {id, args, page(args), scrollTop, lastActivatedAt, isActive, cacheTime, cacheTimer}
 *   ]
 * }
 *
 */

const INIT_STATE = {
    items: []
};

// actions

const SET_ITEM = 'SET_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const SET_ITEMS = 'SET_ITEMS';

// action creators

const setItem = (item)=> {
    return {type: SET_ITEM, item: item};
};

const removeItem = (id)=> {
    return {type: REMOVE_ITEM, id: id};
};

const setItems = (items)=> {
    return {type: SET_ITEMS, items: items}
};

const actions = {
    setItem,
    removeItem,
    setItems
};

// reducer

const items = (items = [], action)=> {
    switch (action.type) {
        case SET_ITEM:
            return items.filter(item=>item.id !== action.item.id).concat(action.item);
        case REMOVE_ITEM:
            return items.filter(item=>item.id !== action.id);
        case SET_ITEMS:
            return action.items;
        default:
            return items;
    }
};

const reducer = (state = {}, action)=> {
    return {
        items: items(state.items, action)
    }
};

// store

function createStore() {
    return _createStore(reducer, INIT_STATE)
}

// export

export {
    actions,
    createStore
};