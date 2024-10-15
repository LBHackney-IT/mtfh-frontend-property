import { useState } from "react";

import { axiosInstance } from "@mtfh/common";
import { AssetAddress, AssetTenure, AssetType } from "@mtfh/common/lib/api/asset/v1";
import { config } from "@mtfh/common/lib/config";

export interface AssetSearchResult {
  id: string;
  assetId: string;
  assetType: AssetType;
  assetAddress: AssetAddress;
  tenure: AssetTenure;
}

interface SearchResultsResponse {
  results: {
    assets?: AssetSearchResult[];
  };
  total: number;
}

export const useSearchResults = (assetTypes: AssetType[] = []) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResultsData, setSearchResultsData] = useState<AssetSearchResult[] | null>(
    null,
  );

  const [total, setTotal] = useState<number>();

  const fetchResults = (newSearchText: string) => {
    setError(null);
    setSearchResultsData(null);

    const url = `${
      config.assetSearchApiUrlV1
    }/search/assets?searchText=${newSearchText}&useCustomSorting=true&assetTypes=${assetTypes.toString()}`;

    setLoading(true);
    axiosInstance
      .get<SearchResultsResponse>(url)
      .then((res) => {
        const assetResponse = res.data.results.assets;

        setSearchResultsData(assetResponse || []);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { fetchResults, error, total, searchResultsData, loading };
};
