import React from 'react';
import pick from 'lodash/pick';

class CacheRenderer extends React.Component {
    static propTypes = {
        // array of {id, args, page(args), isActive}
        items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    };

    static defaultProps = {
        items: []
    };

    render() {
        const {items} = this.props;
        return <div>
            {
                items.map(item=> {
                    return <CachePage key={item.id} {...pick(item, 'args', 'page', 'isActive')}/>
                })
            }
        </div>
    }
}

class CachePage extends React.Component {
    static propTypes = {
        args: React.PropTypes.any,

        // page builder, func(args, cacheState)
        page: React.PropTypes.func.isRequired,

        isActive: React.PropTypes.bool
    };

    shouldComponentUpdate(oldProps) {
        return !(oldProps.args === this.props.args && oldProps.page === this.props.page && oldProps.isActive === this.props.isActive)
    }

    render() {
        const {args, page, isActive} = this.props;

        return <div style={{display: isActive ? 'block' : 'none'}}>
            {page(args, {isActive})}
        </div>
    }
}

export default CacheRenderer;