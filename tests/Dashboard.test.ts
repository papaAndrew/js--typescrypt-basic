import { Dashboard } from "../src/control/Dashboard";
import {
  IDashboardView,
  MSG_CLOSE_CARD,
  MSG_NEW_CARD,
} from "../src/view/DashboardView";

describe("Dashboard", () => {
  let boardView: IDashboardView;

  let onStateChange = jest.fn();

  const getDashBoardView = (): IDashboardView => ({
    addGameCard: jest.fn(),
    removeGameCard: jest.fn(),
    getGameViewElement: jest.fn(() => document.createElement("div")),
    onStateChange: jest.fn((cb) => {
      onStateChange = jest.fn(cb);
    }),
  });

  beforeEach(() => {
    boardView = getDashBoardView();
  });

  it("is a class", () => {
    expect(Dashboard).toBeInstanceOf(Function);
    expect(new Dashboard(boardView)).toBeInstanceOf(Dashboard);
  });

  describe("functionality", () => {
    beforeEach(() => {
      new Dashboard(boardView);
    });

    it("renders initial state on instantiating", () => {
      const firstCardID = "Game1";
      expect(boardView.addGameCard).toBeCalledWith(firstCardID, "Game 1");
      expect(boardView.getGameViewElement).toBeCalledWith(firstCardID);
    });

    it("interaction view.onStateChange renders changed game card", () => {
      onStateChange(MSG_NEW_CARD);

      expect(boardView.addGameCard).toBeCalled();

      onStateChange(MSG_CLOSE_CARD, "card-id");

      expect(boardView.removeGameCard).toBeCalled();
    });
  });
});
