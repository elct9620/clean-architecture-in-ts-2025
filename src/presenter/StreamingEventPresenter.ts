import { StreamingEventPresenter } from "@/usecase/interface";
import { SSEStreamingApi } from "hono/streaming";

export class HonoServerEventPresenter implements StreamingEventPresenter {
	constructor(private readonly stream: SSEStreamingApi) {}

	async messagePartial(chunk: string): Promise<void> {
		await this.stream.writeSSE({
			event: "message",
			data: JSON.stringify({ content: chunk }),
		});
	}

	async refreshCart(): Promise<void> {
		await this.stream.writeSSE({
			event: "refresh",
			data: JSON.stringify({}),
		});
	}
}
