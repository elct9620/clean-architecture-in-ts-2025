export enum Role {
	User = "user",
	Assistant = "assistant",
}

export interface Message {
	role: Role;
	content: string;
}
