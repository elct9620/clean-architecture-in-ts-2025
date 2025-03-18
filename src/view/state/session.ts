import { createContext, useContext } from "hono/jsx/dom";

// 會話過期時間（毫秒）：1小時
const SESSION_EXPIRY = 60 * 60 * 1000;

// localStorage 鍵名
const SESSION_KEY = "chat_session_id";
const SESSION_EXPIRY_KEY = "chat_session_expiry";

/**
 * 獲取或創建會話 ID
 * 如果 localStorage 中存在有效的會話 ID，則使用它
 * 否則創建一個新的會話 ID 並存儲到 localStorage
 */
export function getOrCreateSessionId(): string {
	// 檢查是否在瀏覽器環境
	if (typeof localStorage === "undefined") {
		return crypto.randomUUID();
	}

	const storedId = localStorage.getItem(SESSION_KEY);
	const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
	const now = Date.now();

	// 檢查會話是否存在且未過期
	if (storedId && expiryTime && parseInt(expiryTime) > now) {
		return storedId;
	}

	// 創建新會話
	const newSessionId = crypto.randomUUID();
	localStorage.setItem(SESSION_KEY, newSessionId);
	localStorage.setItem(SESSION_EXPIRY_KEY, (now + SESSION_EXPIRY).toString());

	return newSessionId;
}

// 創建 Session Context
export const SessionContext = createContext<string>("");

// 創建 Hook 以便於使用 Session
export function useSession(): string {
	return useContext(SessionContext);
}
