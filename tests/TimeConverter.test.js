import {EuropeanTime} from "../src/components/utils/TimeConverter";

test("Converting timestamp to eu time format works", () => {
    const test_date = "2020-09-12T00:00:00.000Z";
    const european_format_date = EuropeanTime(test_date);

    expect(european_format_date).toBe("12-09-2020");
})