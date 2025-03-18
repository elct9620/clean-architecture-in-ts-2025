import { createContext, useContext } from "hono/jsx/dom";

// 創建 Session Context
export const SessionContext = createContext<string>(crypto.randomUUID());

// 創建 Hook 以便於使用 Session
export function useSession(): string {
	return useContext(SessionContext);
}
