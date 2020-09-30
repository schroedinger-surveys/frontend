import {EuropeanTime} from "../src/components/utils/TimeConverter";

test("Converting timestamp to eu time format works", () => {
    const test_date = "2020-09-12T00:00:00.000Z";
    const european_format_date_long = EuropeanTime(test_date);
    const european_format_date_short = EuropeanTime(test_date.substr(0,10));

    const string_value = EuropeanTime("hello world");
    const number_value = EuropeanTime(3556464);

    expect(european_format_date_long).toBe("12-09-2020");
    expect(european_format_date_short).toBe("12-09-2020");
    expect(string_value).toBe("hello worl"); // string is cut short to substr(0, 10);
    expect(number_value).toBe("");
})