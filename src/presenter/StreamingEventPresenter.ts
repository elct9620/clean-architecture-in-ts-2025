import { StreamingEventPresenter } from "@/usecase/interface";
import { SSEStreamingApi } from "hono/streaming";

export class HonoServerEventPresenter implements StreamingEventPresenter {
	constructor(private readonly stream: SSEStreamingApi) {}

	async emit(event: string, data: any): Promise<void> {
		await this.stream.writeSSE({
			event,
			data: JSON.stringify(data),
		});
	}
}
