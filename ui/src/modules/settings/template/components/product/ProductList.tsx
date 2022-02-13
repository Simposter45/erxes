import Button from 'modules/common/components/Button';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import EmptyState from 'modules/common/components/EmptyState';
import { FormControl } from 'modules/common/components/form';
import Pagination from 'modules/common/components/pagination/Pagination';
import Table from 'modules/common/components/table';
import { Count } from 'modules/common/styles/main';
import { Alert, confirm } from 'modules/common/utils';
import { __, router } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import { BarItems } from 'modules/layout/styles';
import TaggerPopover from 'modules/tags/components/TaggerPopover';
import React from 'react';
import CategoryList from '../../containers/productCategory/CategoryList';
import Row from './ProductRow';
import { IProductTemplate } from '../../types';
import { ICommonListProps } from 'modules/settings/common/types';
import ActionBarDropDown from '../../containers/actionBar/ActionBar';

type Props = {
  history: any;
  queryParams: any;
  productsCount: number;
  isAllSelected: boolean;
  bulk: any[];
  emptyBulk: () => void;
  remove: (doc: { ids: string[] }, emptyBulk: () => void) => void;
  toggleBulk: () => void;
  toggleAll: (targets: IProductTemplate[], containerId: string) => void;
  loading: boolean;
  searchValue: string;
  mergeProducts: () => void;
  mergeProductLoading;
  products: IProductTemplate[];
  changeStatus: (_id: string, status: string) => void;
  duplicateTemplate: (_id: string) => void;
} & ICommonListProps;

type State = {
  searchValue?: string;
};

class List extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue
    };
  }

  renderRow = () => {
    const {
      history,
      toggleBulk,
      bulk,
      products,
      changeStatus,
      duplicateTemplate
    } = this.props;

    return products.map(product => (
      <Row
        history={history}
        key={product._id}
        productTemplate={product}
        toggleBulk={toggleBulk}
        isChecked={bulk.includes(product)}
        changeStatus={changeStatus}
        duplicateTemplate={duplicateTemplate}
      />
    ));
  };

  onChange = () => {
    const { toggleAll, products } = this.props;
    toggleAll(products, 'productTemplate');
  };

  removeProducts = products => {
    const ids: string[] = [];

    products.forEach(product => {
      ids.push(product._id);
    });

    this.props.remove({ ids }, this.props.emptyBulk);
  };

  renderCount = productCount => {
    return (
      <Count>
        {productCount} product{productCount > 1 && 's'}
      </Count>
    );
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
      productsCount,
      loading,
      queryParams,
      isAllSelected,
      history,
      bulk,
      emptyBulk
    } = this.props;

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Product & Service') }
    ];

    let actionBarRight = (
      <ActionBarDropDown queryParams={queryParams} history={history} />
    );

    let content = (
      <>
        <Table hover={true}>
          <thead>
            <tr>
              <th style={{ width: 60 }}>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              <th>{__('Title')}</th>
              <th>{__('Description')}</th>
              <th>{__('Number of items')}</th>
              <th>{__('Tags')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </>
    );

    if (productsCount === 0) {
      content = (
        <EmptyState
          image="/images/actions/8.svg"
          text="No Brands"
          size="small"
        />
      );
    }

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle="simple" size="small" icon="tag-alt">
          Tag
        </Button>
      );

      const onClick = () =>
        confirm()
          .then(() => {
            this.removeProducts(bulk);
          })
          .catch(error => {
            Alert.error(error.message);
          });

      actionBarRight = (
        <BarItems>
          <TaggerPopover
            type="productTemplate"
            successCallback={emptyBulk}
            targets={bulk}
            trigger={tagButton}
            refetchQueries={['productCountByTags']}
          />
          <Button
            btnStyle="danger"
            size="small"
            icon="cancel-1"
            onClick={onClick}
          >
            Remove
          </Button>
        </BarItems>
      );
    }

    console.log('queryParams - productList', queryParams);

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Product & Service')}
            breadcrumb={breadcrumb}
          />
        }
        actionBar={<Wrapper.ActionBar right={actionBarRight} />}
        leftSidebar={
          <CategoryList queryParams={queryParams} history={history} />
        }
        footer={<Pagination count={productsCount} />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={productsCount}
            emptyText="There is no data"
            emptyImage="/images/actions/5.svg"
          />
        }
      />
    );
  }
}

export default List;