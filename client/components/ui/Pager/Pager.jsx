import React from 'react';
import './Pager.less';

export default class Pager extends React.Component {
  constructor(props) {
    super();

    this.state = {
      page: 1
    }

    this.setPage = this.setPage.bind(this);
  }

  renderPagerLinks() {
    const { size, children } = this.props,
      { page } = this.state,
      pageCount = Math.ceil(children.length / size);

    let pages = [];

    if (pageCount > 9) {
      if (page < 3) {
        pages = [1, 2, 3, 4, 5];
      } else if (page > pageCount - 3) {
        pages = [4, 3, 2, 1, 0].map(val => pageCount - val);
      } else {
        pages = [page - 2, page - 1, page, page + 1, page + 2];
      }

      return (
        <span className="pagerList">
          {(page > 1) && <span className="fa fa-angle-double-left" onClick={() => this.setPage(1)}></span>}
          {(page > 1) && <span className="fa fa-angle-left" onClick={() => this.setPage(page - 1)}></span>}
          {
            pages.map(pageNumber => <span key={pageNumber} onClick={() => this.setPage(pageNumber)} className={'page' + (pageNumber === this.state.page ? ' activePage' : '')}>{pageNumber}</span>)
          }
          {(page < pageCount) && <span className="fa fa-angle-right" onClick={() => this.setPage(page + 1)}></span>}
          {(page < pageCount) && <span className="fa fa-angle-double-right" onClick={() => this.setPage(pageCount)}></span>}
        </span>
      );

    } else {
      return (
        <span className="pagerList">
          {
            Array.from(Array(pageCount).keys()).map(val => val+1).map(pageNumber => <span key={pageNumber} onClick={() => this.setPage(pageNumber)} className={'page' + (pageNumber === this.state.page ? ' activePage' : '')}>{pageNumber}</span>)
          }
        </span>
      );
    }
  }

  setPage(page) {
    this.setState({page}, () => {
      typeof this.props.onChange === 'function' && this.props.onChange({page})
    });
  }

  renderPager() {
    const { size, children } = this.props;
    const { page } = this.state;

    return (
      <div className="pager">
        {
          (size < children.length)
          ? <span >
            {
              this.renderPagerLinks()
            }
          </span>
          : null
        }
        <span className="sizeArea">
          Anzahl: {((children.length % size === 0 || page < (children.length / size)) ? size : (children.length % size))}
        </span>
      </div>
    );
  }

  render() {
    const { size, children, top, bottom, inactive } = this.props;
    const { page } = this.state;
    const wrapper = this.props.wrapper ? this.props.wrapper : children => children;

    if (inactive || children.length < size) {
      return <span>{wrapper(children)}</span>
    }

    return (
      <div className="pagedList">
        {
          top && this.renderPager()
        }
        <div className="pagedContent">
          {
            wrapper(children.filter((item, index) => (index >= ((page - 1) * size) && (index < page * size))))
          }
        </div>
        {
          bottom && this.renderPager()
        }
      </div>
    );
  }
}
