import { Box, Icon } from '@erxes/ui/src/components';
import { __ } from '@erxes/ui/src/utils';
import { SectionBodyItem } from '@erxes/ui/src/layout/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import { LoyaltyAmount } from '../../styles';
import { IDonate } from '../donates/types';
import { ILottery } from '../lotteries/types';
import { ISpin } from '../spins/types';
import { IVoucher } from '../vouchers/types';

type IProps = {
  ownerId?: string;
  ownerType?: string;
  vouchers: IVoucher[];
  spins: ISpin[];
  donates: IDonate[];
  lotteries: ILottery[];
};

class LoyaltySection extends React.Component<IProps, {}> {
  renderVouchers() {
    const { ownerId, ownerType, vouchers } = this.props;
    if (!vouchers.length) {
      return '';
    }

    return (
      <SectionBodyItem>
        <Link to={`/erxes-plugin-loyalty/vouchers?ownerId=${ownerId}&ownerType=${ownerType}`}>
          <Icon icon="star" />
          {`Vouchers`} ({vouchers.length})
        </Link>
      </SectionBodyItem>
    )
  }

  renderSpins() {
    const { ownerId, ownerType, spins } = this.props;
    if (!spins.length) {
      return '';
    }

    return (
      <SectionBodyItem>
        <Link to={`/erxes-plugin-loyalty/spins?ownerId=${ownerId}&ownerType=${ownerType}`}>
          <Icon icon="star" />
          {`Spins`} ({spins.length})
        </Link>
      </SectionBodyItem>
    )
  }

  renderLotteries() {
    const { ownerId, ownerType, lotteries } = this.props;
    if (!lotteries.length) {
      return '';
    }

    return (
      <SectionBodyItem>
        <Link to={`/erxes-plugin-loyalty/lotteries?ownerId=${ownerId}&ownerType=${ownerType}`}>
          <Icon icon="star" />
          {`Lotteries`} ({lotteries.length})
        </Link>
      </SectionBodyItem>
    )
  }

  renderDonates() {
    const { ownerId, ownerType, donates } = this.props;
    if (!donates.length) {
      return '';
    }

    return (
      <SectionBodyItem>
        <Link to={`/erxes-plugin-loyalty/donates?ownerId=${ownerId}&ownerType=${ownerType}`}>
          <Icon icon="star" />
          {`Donates`} ({donates.length})
        </Link>
      </SectionBodyItem>
    )
  }

  render() {
    return (
      <Box
        title={__('Loyalty')}
        name="Loyalties"
        isOpen={true}
      >
        {this.renderVouchers()}
        {this.renderLotteries()}
        {this.renderSpins()}
        {this.renderDonates()}
      </Box>
    )
  }
}
export default LoyaltySection;