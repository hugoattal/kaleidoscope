import lpConfigVue from "@luna-park/eslint-config/vue";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist/*"]
    },
    ...lpConfigVue,
    {
        rules: {
            "sort-keys-custom-order/object-keys": ["error", {
                orderedKeys: ["id", "name", "title"]
            }],
            "sort-keys-custom-order/type-keys": ["error", {
                orderedKeys: ["id", "name", "title"]
            }]
        }
    }
);
