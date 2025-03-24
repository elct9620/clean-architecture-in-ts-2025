import { ConversationSchema } from "@/repository/KvConversationRepository";
import { env } from "cloudflare:test";
import { TestContext } from "vitest";

export async function givenConversation(
	ctx: TestContext,
	conversation: ConversationSchema,
) {
	await env.KV.put(
		`conversation:${conversation.id}`,
		JSON.stringify(conversation),
	);
}
