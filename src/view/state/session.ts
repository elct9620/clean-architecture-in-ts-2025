import { createContext, useContext } from "hono/jsx/dom";

const SESSION_EXPIRY = 60 * 60 * 1000;
const SESSION_KEY = "chat_session_id";
const SESSION_EXPIRY_KEY = "chat_session_expiry";

export function getOrCreateSessionId(): string {
	if (typeof localStorage === "undefined") {
		return crypto.randomUUID();
	}

	const storedId = localStorage.getItem(SESSION_KEY);
	const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
	const now = Date.now();

	if (storedId && expiryTime && parseInt(expiryTime) > now) {
		return storedId;
	}

	const newSessionId = crypto.randomUUID();
	localStorage.setItem(SESSION_KEY, newSessionId);
	localStorage.setItem(SESSION_EXPIRY_KEY, (now + SESSION_EXPIRY).toString());

	return newSessionId;
}

export const SessionContext = createContext<string>("");

export function useSession(): string {
	return useContext(SessionContext);
}
