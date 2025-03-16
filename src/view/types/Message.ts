export enum Role {
	User = "user",
	Assistant = "assistant",
}

export enum ActionType {
	AddUserMessage = "ADD_USER_MESSAGE",
	AddAssistantMessage = "ADD_ASSISTANT_MESSAGE",
	UpdateLastMessage = "UPDATE_LAST_MESSAGE",
}

export interface Message {
	role: Role;
	content: string;
}
