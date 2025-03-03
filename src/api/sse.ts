// Reference: https://github.com/Azure/fetch-event-source/blob/main/src/parse.ts

export interface ServerEvent {
	id: string;
	event: string;
	data: string;
	retry?: number;
}

const enum ControlChars {
	NewLine = 10,
	CarriageReturn = 13,
	Space = 32,
	Colon = 58,
}

type onMessage = (event: ServerEvent) => void;

export async function readEvents(stream: ReadableStream, onMessage?: onMessage) {
	await getBytes(stream, getLines(getEvents(onMessage)));
}

async function getBytes(stream: ReadableStream, onChunk: (chunk: Uint8Array) => void) {
	const reader = stream.getReader();
	let buffer: ReadableStreamReadResult<Uint8Array>;
	while (!(buffer = await reader.read()).done) {
		onChunk(buffer.value);
	}
}

function getLines(onLine: (line: Uint8Array, fieldLength: number) => void) {
	let buffer: Uint8Array | undefined;
	let position: number;
	let fieldLength: number;
	let discardTrailingNewline = false;

	return function onChunk(array: Uint8Array) {
		if (buffer == undefined) {
			buffer = array;
			position = 0;
			fieldLength = -1;
		} else {
			buffer = concat(buffer, array);
		}

		const bufferLength = buffer.length;
		let lineStart = 0;

		while (position < bufferLength) {
			if (discardTrailingNewline) {
				if (buffer[position] === ControlChars.NewLine) {
					lineStart = ++position;
				}

				discardTrailingNewline = false;
			}

			let lineEnd = -1;
			for (; position < bufferLength && lineEnd === -1; ++position) {
				switch (buffer[position]) {
					case ControlChars.Colon:
						const isFirstColon = fieldLength === -1;
						if (isFirstColon) {
							fieldLength = position - lineStart;
						}
						break;
					case ControlChars.CarriageReturn:
						discardTrailingNewline = true;
					case ControlChars.NewLine:
						lineEnd = position;
						break;
				}
			}

			const isWaitingForData = lineEnd === -1;
			if (isWaitingForData) {
				break;
			}

			onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
			lineStart = position;
			fieldLength = -1;
		}

		const isLastChunk = bufferLength === position;
		const isRemainingData = lineStart !== 0;

		if (isLastChunk) {
			buffer = undefined;
		} else if (isRemainingData) {
			buffer = buffer.subarray(lineStart);
			position -= lineStart;
		}
	};
}

function getEvents(onMessage?: onMessage) {
	let event = newEvent();
	const decoder = new TextDecoder();

	return function onLine(line: Uint8Array, fieldLength: number) {
		const isEndOfEvent = line.length === 0;
		if (isEndOfEvent) {
			onMessage?.(event);
			event = newEvent();
		}

		const isReadable = fieldLength > 0;
		if (isReadable) {
			const field = decoder.decode(line.subarray(0, fieldLength));
			const valueOffset = fieldLength + (line[fieldLength + 1] === ControlChars.Space ? 2 : 1);
			const value = decoder.decode(line.subarray(valueOffset));

			switch (field) {
				case 'id':
					event.id = value;
					break;
				case 'event':
					event.event = value;
					break;
				case 'data':
					event.data += event.data ? event.data + '\n' + value : value;
					break;
				case 'retry':
					const retry = parseInt(value, 10);
					if (!isNaN(retry)) {
						event.retry = retry;
					}
					break;
			}
		}
	};
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
	const result = new Uint8Array(a.length + b.length);
	result.set(a);
	result.set(b, a.length);
	return result;
}

function newEvent(): ServerEvent {
	return { id: '', event: '', data: '', retry: undefined };
}
