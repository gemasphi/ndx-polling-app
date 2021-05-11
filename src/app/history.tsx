import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export function forwardTo(location) {
	history.push(location);
}

