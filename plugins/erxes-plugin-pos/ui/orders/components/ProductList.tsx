import CategoryList from '../containers/CategoryList';
import RightMenu from './RightMenu';
import React from 'react';
import Row from './ProductRow';
import {
  __,
  BarItems,
  DataWithLoader,
  EmptyState,
  FormControl,
  Pagination,
  router,
  Table,
  Wrapper
} from 'erxes-ui';
import { IPosProduct } from '../types';
import { IProductCategory } from 'erxes-ui/lib/products/types';
import { IRouterProps } from 'erxes-ui/lib/types';
import { menuPos } from './List';

interface IProps extends IRouterProps {
  history: any;
  queryParams: any;
  products: IPosProduct[];
  loading: boolean;
  searchValue: string;
  currentCategory: IProductCategory;

  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  isFiltered: boolean;
  clearFilter: () => void;
}

type State = {
  searchValue?: string;
};

class List extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.queryParams.searchValue
    };
  }

  renderRow = () => {
    const { products, history } = this.props;

    return products.map(product => (
      <Row
        history={history}
        key={product._id}
        product={product}
      />
    ));
  };

  search = e => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });

    this.timer = setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };

  moveCursorAtTheEnd(e) {
    const tmpValue = e.target.value;

    e.target.value = '';
    e.target.value = tmpValue;
  }

  render() {
    const {
      loading,
      queryParams,
      history,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      currentCategory,
    } = this.props;

    const rightMenuProps = {
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      queryParams,
    };

    let actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Type to search')}
          onChange={this.search}
          defaultValue={queryParams.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
        <RightMenu {...rightMenuProps} />
      </BarItems>
    );

    let content = (
      <>
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Code')}</th>
              <th>{__('Name')}</th>
              <th>{__('Category')}</th>
              <th>{__('Unit Price')}</th>
              <th>{__('Pos Sale')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </>
    );

    if (currentCategory && currentCategory.productCount === 0) {
      content = (
        <EmptyState
          image="/images/actions/8.svg"
          text="No Brands"
          size="small"
        />
      );
    }

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('POS of Products')}
            submenu={menuPos}
          />
        }
        actionBar={
          <Wrapper.ActionBar right={actionBarRight} />
        }
        leftSidebar={
          <CategoryList queryParams={queryParams} history={history} />
        }
        footer={<Pagination />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            emptyText="There is no data"
            emptyImage="/images/actions/5.svg"
          />
        }
      />
    );
  }
}

export default List;