export class CartItem {
	public readonly name: string;
	public readonly price: number;
	public readonly quantity: number;

	constructor(name: string, price: number, quantity: number) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
	}

	get total(): number {
		return this.price * this.quantity;
	}

	updateQuantity(quantity: number): CartItem {
		return new CartItem(this.name, this.price, quantity);
	}
}

export class Cart {
	public readonly id: string;
	private _items: CartItem[] = [];
	private _isDirty = false;

	constructor(id: string) {
		this.id = id;
	}

	get items(): CartItem[] {
		return [...this._items];
	}

	get isDirty(): boolean {
		return this._isDirty;
	}

	addItem(name: string, price: number, quantity: number): void {
		this._isDirty = true;

		const existingItem = this._items.find((item) => item.name === name);
		if (existingItem) {
			this._items = this._items.map((item) => {
				if (item.name === name) {
					return item.updateQuantity(item.quantity + quantity);
				}
				return item;
			});

			return;
		}

		this._items.push(new CartItem(name, price, quantity));
	}

	removeItem(name: string): void {
		this._isDirty = true;
		this._items = this._items.filter((item) => item.name !== name);
	}

	updateItem(name: string, quantity: number): void {
		this._items = this._items.map((item) => {
			if (item.name === name) {
				this._isDirty = true;
				return item.updateQuantity(quantity);
			}
			return item;
		});
	}
}
