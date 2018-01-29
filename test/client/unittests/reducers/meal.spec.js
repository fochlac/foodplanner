import meal from "COMPONENTS/reducers/meal.js";

describe("meal-reducer", () => {
  test("MEAL_SIGNUP", () => {
    const action = {
      type: "MEAL_SIGNUP",
      status: "complete",
      data: {
        meal: 1,
        id: "test"
      }
    };

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3]
          },
          {
            id: 2,
            signups: [1, 2, 3]
          }
        ],
        action
      )
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3, "test"]
      },
      {
        id: 2,
        signups: [1, 2, 3]
      }
    ]);

    action.status = "incomplete";
    expect(meal("test", action)).toEqual("test");
  });

  test("DIALOG-PRINT_MEAL", () => {
    const action = {
      type: "DIALOG",
      content: "PRINT_MEAL"
    };

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
            print: true
          },
          {
            id: 2,
            signups: [1, 2, 3]
          }
        ],
        action
      )
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
        print: false
      },
      {
        id: 2,
        signups: [1, 2, 3],
        print: false
      }
    ]);

    action.content = "incomplete";
    expect(meal("test", action)).toEqual("test");
  });

  test("PRINT_MEAL", () => {
    const action = {
      type: "PRINT_MEAL",
      ids: [1, 3]
    };

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
            print: false
          },
          {
            id: 2,
            signups: [1, 2, 3]
          },
          {
            id: 3,
            signups: [1, 2, 3]
          }
        ],
        action
      )
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
        print: true
      },
      {
        id: 2,
        signups: [1, 2, 3],
        print: false
      },
      {
        id: 3,
        signups: [1, 2, 3],
        print: true
      }
    ]);
  });

  test("CREATE_MEAL", () => {
    const action = {
      type: "CREATE_MEAL",
      data: { test: "test" }
    };

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3]
          },
          {
            id: 2,
            signups: [1, 2, 3]
          },
          {
            id: 3,
            signups: [1, 2, 3]
          }
        ],
        action
      )
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3]
      },
      {
        id: 2,
        signups: [1, 2, 3]
      },
      {
        id: 3,
        signups: [1, 2, 3]
      },
      {
        test: "test",
        signups: []
      }
    ]);

    action.status = "incomplete";
    expect(meal("test", action)).toEqual("test");
  });

  test("CREATE_MEAL", () => {
    const action = {
      type: "CANCEL_MEAL",
      id: 3
    };

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3]
          },
          {
            id: 2,
            signups: [1, 2, 3]
          },
          {
            id: 3,
            signups: [1, 2, 3]
          }
        ],
        action
      )
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3]
      },
      {
        id: 2,
        signups: [1, 2, 3]
      }
    ]);

    action.status = "incomplete";
    expect(
      meal(
        {
          id: 3,
          signups: [1, 2, 3]
        },
        action
      )
    ).toEqual({
      id: 3,
      signups: [1, 2, 3]
    });
  });
});
