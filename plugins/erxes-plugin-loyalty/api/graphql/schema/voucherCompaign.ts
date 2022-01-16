import { commonInputs, commonTypes } from './common';

export const types = `
  type VoucherCompaign {
    _id: String,
    ${commonTypes}
    buyScore: Float,

    score: Float,
    scoreAction: String,

    voucherType: String,

    productCategoryIds: [String],
    productIds: [String],
    discountPercent: Float,

    bonusProductId: String,
    bonusCount: Float,

    spinCompaignId: String,
    spinCount: Float,

    lotteryCompaignId: String,
    lotteryCount: Float,
  }
`;

const VoucherCompaignDoc = `
  ${commonInputs}
  buyScore: Float,

  score: Float,
  scoreAction: String,

  voucherType: String,

  productCategoryIds: [String],
  productIds: [String],
  discountPercent: Float,

  bonusProductId: String,
  bonusCount: Float,

  spinCompaignId: String,
  spinCount: Float,

  lotteryCompaignId: String,
  lotteryCount: Float,
`

export const queries = `
  voucherCompaignDetail(_id: String!): VoucherCompaign
  voucherCompaigns(searchValue: String, filterStatus: String, page: Int, perPage: Int): [VoucherCompaign]
`;

export const mutations = `
  voucherCompaignsAdd(${VoucherCompaignDoc}): VoucherCompaign
  voucherCompaignsEdit(_id: String!, ${VoucherCompaignDoc}): VoucherCompaign
  voucherCompaignsRemove(_ids: [String]): JSON
`;
