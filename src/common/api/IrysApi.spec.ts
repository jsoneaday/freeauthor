// import { render, waitFor, screen } from "@testing-library/react";
// import UserEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import { IrysApi } from "./IrysApi";
import { IApi } from "./IApi";
import { faker } from "@faker-js/faker";

describe("IrysApi tests", () => {
  it("addWork adds a new work", async () => {
    const api: IApi = new IrysApi();
    await api.connect();

    const result = await api.addWork(
      faker.lorem.words(3),
      faker.lorem.lines(1),
      faker.lorem.paragraph(1),
      "author123",
      "topic123"
    );
    console.log("addWork", result);
  });
});
