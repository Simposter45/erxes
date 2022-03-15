import { isEnabled } from "@erxes/ui/src/utils/core";

const brandDetail = `
  query brandDetail($_id: String!) {
    brandDetail(_id: $_id) {
      _id
      name
      emailConfig
      code
      ${
        isEnabled("inbox")
          ? `
          integrations {
            _id
            name
            kind
            brandId
          }
        `
          : ``
      }
    }
  }
`;

const brands = `
  query brands($page: Int, $perPage: Int, $searchValue: String) {
    brands(page: $page, perPage: $perPage, searchValue: $searchValue) {
      _id
      code
      name
      createdAt
      description
      emailConfig
    }
  }
`;

const brandsCount = `
  query totalBrandsCount {
    brandsTotalCount
  }
`;

const integrationsCount = `
  query totalIntegrationsCount {
    integrationsTotalCount {
      byBrand
    }
  }
`;

const brandsGetLast = `
  query brandsGetLast {
    brandsGetLast {
      _id
    }
  }
`;

export default {
  brandsGetLast,
  brands,
  brandDetail,
  brandsCount,
  integrationsCount,
};
