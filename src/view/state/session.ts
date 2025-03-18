import { createContext, useContext } from "hono/jsx/dom";

// 使用 Web Crypto API 生成 UUID
function generateUUID(): string {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	
	// 設置 UUID 版本 (版本 4)
	array[6] = (array[6] & 0x0f) | 0x40;
	// 設置變體 (變體 1)
	array[8] = (array[8] & 0x3f) | 0x80;
	
	// 將 UUID 轉換為標準格式
	return Array.from(array)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
		.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

// 創建 Session Context
export const SessionContext = createContext<string>(generateUUID());

// 創建 Hook 以便於使用 Session
export function useSession(): string {
	return useContext(SessionContext);
}
