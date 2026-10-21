import { newPropertySchema } from "./schema";

const schema = newPropertySchema();

test.each(["NORTHEAST", "NORTHWEST", "CENTRAL", "SOUTH"])(
  "accepts neighbourhood %s",
  async (neighbourhood) => {
    await expect(schema.validateAt("neighbourhood", { neighbourhood })).resolves.toBe(
      neighbourhood,
    );
  },
);

test.each([undefined, "", "unknown"])(
  "rejects missing or invalid neighbourhood %s",
  async (neighbourhood) => {
    await expect(schema.validateAt("neighbourhood", { neighbourhood })).rejects.toThrow();
  },
);
