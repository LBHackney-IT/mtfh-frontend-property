const extractAddressNumber = (addressLine1: string) => {
  // Regex to look for consecutive numbers in a string
  const match = addressLine1.match(/\d+/);
  return match ? parseInt(match[0], 10) : NaN;
};

// eg sortAddressGeneric([{ name: "1 pitcairn house", otherFields... }], "name", "desc")
export const sortAddressGeneric = <T extends Record<K, string>, K extends keyof T>(
  addresses: T[],
  attribute: K,
  order: "asc" | "desc" = "asc",
) => {
  addresses.sort((a, b) => {
    const addressA = extractAddressNumber(a[attribute]);
    const addressB = extractAddressNumber(b[attribute]);

    if (!Number.isNaN(addressA) && !Number.isNaN(addressB)) {
      // Both names have numbers, sort numerically

      if (order === "asc") return addressA - addressB;
      return addressB - addressA;
    }

    // At least one name doesn't have a number in its addressLine1 (name), sort alphabetically
    return a[attribute].localeCompare(b[attribute]);
  });
};
